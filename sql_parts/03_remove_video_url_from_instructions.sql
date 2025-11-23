USE vnfood;

-- Xóa cột video_url khỏi bảng instructions
-- (vì giờ mỗi món chỉ có 1 video trong bảng dishes, không phải mỗi bước 1 video)
ALTER TABLE instructions DROP COLUMN video_url;

