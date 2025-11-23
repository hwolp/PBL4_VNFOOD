# SQL Parts - Tách file inset.sql thành các phần nhỏ

Thư mục này chứa các file SQL đã được tách từ `inset.sql` để dễ debug và quản lý.

## Cấu trúc:

- **00_setup.sql** - File setup database và tạo tất cả các bảng
- **00_dish_00_BANH_BEO.sql** - Món ăn class_id = 0
- **01_dish_01_BÁNH_BỘT_LỌC.sql** - Món ăn class_id = 1
- **02_dish_02_BÁNH_CĂN.sql** - Món ăn class_id = 2
- ... (tương tự cho các món khác)
- **master.sql** - File master để chạy tất cả

## Cách sử dụng:

### Chạy tất cả:
```sql
SOURCE sql_parts/master.sql;
```

### Chạy từng phần để debug:
```sql
-- 1. Chạy setup trước
SOURCE sql_parts/00_setup.sql;

-- 2. Chạy từng món ăn để tìm lỗi
SOURCE sql_parts/00_dish_00_BANH_BEO.sql;
SOURCE sql_parts/01_dish_01_BÁNH_BỘT_LỌC.sql;
-- ...
```

## Lợi ích:

1. **Dễ debug**: Khi có lỗi, bạn biết chính xác món ăn nào bị lỗi
2. **Dễ quản lý**: Mỗi món ăn là một file riêng
3. **Dễ sửa**: Chỉ cần sửa file của món ăn bị lỗi
4. **Dễ test**: Có thể test từng món ăn riêng lẻ

