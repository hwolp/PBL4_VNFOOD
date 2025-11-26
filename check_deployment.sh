#!/bin/bash

# Script kiểm tra deployment trên Linux server
# Chạy: bash check_deployment.sh

echo "================================================"
echo "🔍 Kiểm tra VNFood Deployment"
echo "================================================"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Kiểm tra Docker
echo -e "\n${BLUE}1. Kiểm tra Docker${NC}"
echo "------------------------------------------------"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker đã cài đặt${NC}"
    docker --version
else
    echo -e "${RED}❌ Docker chưa cài đặt${NC}"
    exit 1
fi

if docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose đã cài đặt${NC}"
    docker compose version
else
    echo -e "${RED}❌ Docker Compose chưa cài đặt${NC}"
    exit 1
fi

# 2. Kiểm tra file cần thiết
echo -e "\n${BLUE}2. Kiểm tra files${NC}"
echo "------------------------------------------------"
files=("docker-compose.yml" "Dockerfile" "backend/database.py" "backend/config.py" "backend/main.py")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file không tồn tại${NC}"
    fi
done

# 3. Kiểm tra file database.py syntax
echo -e "\n${BLUE}3. Kiểm tra syntax database.py${NC}"
echo "------------------------------------------------"
if python3 -m py_compile backend/database.py 2>/dev/null; then
    echo -e "${GREEN}✅ database.py syntax OK${NC}"
else
    echo -e "${RED}❌ database.py có lỗi syntax${NC}"
    echo "Nội dung 5 dòng đầu:"
    head -5 backend/database.py
fi

# 4. Kiểm tra file .env
echo -e "\n${BLUE}4. Kiểm tra .env${NC}"
echo "------------------------------------------------"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ backend/.env tồn tại${NC}"
    echo "DB_HOST=$(grep '^DB_HOST=' backend/.env | cut -d'=' -f2)"
    echo "DB_USER=$(grep '^DB_USER=' backend/.env | cut -d'=' -f2)"
    echo "DB_NAME=$(grep '^DB_NAME=' backend/.env | cut -d'=' -f2)"
elif [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env ở root (dùng cho docker-compose)${NC}"
    echo "DB_HOST=$(grep '^DB_HOST=' .env | cut -d'=' -f2)"
else
    echo -e "${YELLOW}⚠️  Chưa có file .env${NC}"
    echo "Tạo từ .env.example:"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ Đã tạo backend/.env${NC}"
    fi
fi

# 5. Kiểm tra containers
echo -e "\n${BLUE}5. Kiểm tra Docker containers${NC}"
echo "------------------------------------------------"
if docker compose ps 2>/dev/null | grep -q vnfood; then
    docker compose ps
else
    echo -e "${YELLOW}⚠️  Containers chưa chạy${NC}"
fi

# 6. Kiểm tra logs nếu containers đang chạy
echo -e "\n${BLUE}6. Kiểm tra logs${NC}"
echo "------------------------------------------------"
if docker compose ps 2>/dev/null | grep -q vnfood_backend; then
    echo "Backend logs (10 dòng cuối):"
    docker compose logs --tail=10 backend
    
    echo -e "\nMySQL logs (10 dòng cuối):"
    docker compose logs --tail=10 mysql
else
    echo -e "${YELLOW}⚠️  Containers chưa chạy, không có logs${NC}"
fi

# 7. Test kết nối nếu đang chạy
echo -e "\n${BLUE}7. Test API endpoints${NC}"
echo "------------------------------------------------"
if docker compose ps 2>/dev/null | grep -q "vnfood_backend.*Up"; then
    # Test health endpoint
    if curl -f -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health endpoint OK${NC}"
        curl -s http://localhost:8000/health | head -3
    else
        echo -e "${RED}❌ Health endpoint failed${NC}"
    fi
    
    # Test dishes endpoint
    if curl -f -s "http://localhost:8000/dishes?limit=1" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Dishes endpoint OK${NC}"
    else
        echo -e "${RED}❌ Dishes endpoint failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend chưa chạy${NC}"
fi

# 8. Kiểm tra database.py trong container
echo -e "\n${BLUE}8. Kiểm tra database.py trong container${NC}"
echo "------------------------------------------------"
if docker compose ps 2>/dev/null | grep -q vnfood_backend; then
    echo "5 dòng đầu của /app/database.py trong container:"
    docker compose exec -T backend head -5 /app/database.py
    
    echo -e "\nKiểm tra syntax trong container:"
    if docker compose exec -T backend python -m py_compile /app/database.py 2>&1; then
        echo -e "${GREEN}✅ Syntax OK trong container${NC}"
    else
        echo -e "${RED}❌ Syntax error trong container${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend container chưa chạy${NC}"
fi

# 9. Tổng kết
echo -e "\n${BLUE}================================================${NC}"
echo -e "${BLUE}📊 TỔNG KẾT${NC}"
echo -e "${BLUE}================================================${NC}"

if docker compose ps 2>/dev/null | grep -q "vnfood_backend.*Up" && \
   curl -f -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Deployment hoạt động tốt!${NC}"
    echo ""
    echo "API endpoints:"
    echo "  - http://localhost:8000/health"
    echo "  - http://localhost:8000/docs"
    echo "  - http://localhost:8000/dishes"
else
    echo -e "${YELLOW}⚠️  Cần kiểm tra và sửa lỗi${NC}"
    echo ""
    echo "Các bước tiếp theo:"
    echo "  1. Kiểm tra file database.py: cat backend/database.py | head -5"
    echo "  2. Rebuild image: docker compose build --no-cache backend"
    echo "  3. Start lại: docker compose up -d"
    echo "  4. Xem logs: docker compose logs -f backend"
fi

echo ""
