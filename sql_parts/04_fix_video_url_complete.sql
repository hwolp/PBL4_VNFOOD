USE vnfood;

-- Bước 1: Thêm cột video_url vào bảng dishes (nếu chưa có)
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

-- Bước 2: Xóa cột video_url khỏi bảng instructions (nếu có)
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

-- Kiểm tra kết quả
SELECT 'Migration completed!' as status;
SELECT 'dishes.video_url exists:' as check1, 
       COUNT(*) > 0 as result
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = @dbname 
  AND table_name = 'dishes' 
  AND column_name = 'video_url';

SELECT 'instructions.video_url removed:' as check2,
       COUNT(*) = 0 as result
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = @dbname 
  AND table_name = 'instructions' 
  AND column_name = 'video_url';

