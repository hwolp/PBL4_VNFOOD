SECRET_KEY = "day-la-khoa-bi-mat-rat-manh-cua-toi-hay-thay-doi-no"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Ledangkhanh@2005',
    'database': 'vnfood'
}

PI_ADDRESS = "192.168.1.8"
PI_API_URL = f"http://{PI_ADDRESS}:8000"

BLUR_THRESHOLD = 100.0
CONFIDENCE_THRESHOLD = 0.7

MODEL_PATH = "model_traced.pt"

