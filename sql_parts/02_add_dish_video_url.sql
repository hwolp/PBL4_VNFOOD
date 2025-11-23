USE vnfood;

-- Thêm cột video_url vào bảng dishes (cho video hướng dẫn làm món ăn)
-- Lưu ý: Nếu cột đã tồn tại, câu lệnh sẽ báo lỗi nhưng không ảnh hưởng đến dữ liệu
-- Có thể bỏ qua lỗi hoặc kiểm tra cột tồn tại trước khi chạy
SET @dbname = DATABASE();
SET @tablename = 'dishes';
SET @columnname = 'video_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1', -- Cột đã tồn tại, không làm gì
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(500) NULL AFTER image_url')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Xóa cột video_url khỏi bảng instructions (vì giờ mỗi món chỉ có 1 video, không phải mỗi bước 1 video)
-- Lưu ý: Nếu cột không tồn tại, câu lệnh sẽ báo lỗi nhưng không ảnh hưởng đến dữ liệu
SET @tablename2 = 'instructions';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename2)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename2, ' DROP COLUMN ', @columnname), -- Cột tồn tại, xóa nó
  'SELECT 1' -- Cột không tồn tại, không làm gì
));
PREPARE dropIfExists FROM @preparedStatement2;
EXECUTE dropIfExists;
DEALLOCATE PREPARE dropIfExists;

