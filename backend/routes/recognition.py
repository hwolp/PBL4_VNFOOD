from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import Optional

try:
    from ..database import get_db_connection
    from ..auth import get_current_user_optional
    from ..utils.image_processing import predict_pytorch
    from ..utils.database_queries import get_food_details
except ImportError:
    from backend.database import get_db_connection
    from backend.auth import get_current_user_optional
    from backend.utils.image_processing import predict_pytorch
    from backend.utils.database_queries import get_food_details

router = APIRouter()

@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    language: str = 'vi',
    current_user: Optional[str] = Depends(get_current_user_optional)
):
    try:
        from ..config import BLUR_THRESHOLD
    except ImportError:
        from backend.config import BLUR_THRESHOLD
    
    image_bytes = await file.read()
    class_id, confidence_score = predict_pytorch(image_bytes)

    if class_id == -1:
         raise HTTPException(status_code=500, detail="Lỗi xử lý ảnh hoặc dự đoán.")
    if class_id == -2 or class_id == -3:
         if class_id == -2: print("LỖI: Độ tin cậy thấp (< 0.5)")
         if class_id == -3: print(f"LỖI: Ảnh quá mờ (Variance < {BLUR_THRESHOLD})")
         raise HTTPException(status_code=400, detail="Nhận diện thất bại. Vui lòng chụp ảnh lại.")

    conn = get_db_connection()
    if not conn:
         raise HTTPException(status_code=500, detail="Không thể kết nối database")

    cursor = conn.cursor(dictionary=True)
    try:
        result = get_food_details(class_id, cursor, language)
        result['confidence'] = round(confidence_score * 100, 2)
        return result

    except HTTPException as e:
         raise e
    except Exception as e:
         print(f"Lỗi truy vấn database: {e}")
         raise HTTPException(status_code=500, detail="Lỗi truy vấn database.")
    finally:
         if cursor: cursor.close()
         if conn: conn.close()

