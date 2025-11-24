# 🚀 VNFood Cloud API - Deployment Guide

## 📋 Overview

Backend API dành cho nhận diện món ăn Việt Nam sử dụng AI. Server này:
- ✅ Nhận ảnh từ client qua API
- ✅ Xử lý ảnh bằng PyTorch model
- ✅ Lưu kết quả vào MySQL database
- ✅ Trả về JSON response

## 🎯 Architecture

```
Client (Mobile/Web) 
    ↓ (Upload image)
Cloud Server (Linux)
    ↓ 
Backend API (FastAPI + Docker)
    ↓
AI Model (PyTorch)
    ↓
MySQL Database
    ↓
JSON Response → Client
```

## 📦 Requirements

- **OS**: Linux Server (Ubuntu 20.04+ recommended)
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **RAM**: Minimum 4GB (8GB recommended for AI model)
- **Storage**: 10GB free space

## 🛠️ Installation Steps

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd PBL4_VNFOOD
```

### 2. Configure Environment

```bash
# Copy example environment file
cp backend/.env.example backend/.env

# Edit with your settings
nano backend/.env
```

**Important**: Update these values in `.env`:
```env
SECRET_KEY=your-very-secure-random-key-here
DB_PASSWORD=your-secure-database-password
DB_ROOT_PASSWORD=your-mysql-root-password
```

### 3. Deploy with Docker

#### Option A: Quick Deploy (Recommended)

```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option B: Manual Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Verify Deployment

```bash
# Check API health
curl http://localhost:8000/health

# Access API documentation
# Open browser: http://your-server-ip:8000/docs
```

## 📡 API Endpoints

### 🔐 Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user info

### 🍲 Food Recognition
- `POST /predict` - Upload image and get recognition result
  ```bash
  curl -X POST "http://localhost:8000/predict" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@/path/to/food-image.jpg" \
    -F "language=vi"
  ```

### 🍽️ Dishes
- `GET /dishes` - Get all dishes
- `GET /dishes/{id}` - Get dish details
- `GET /dishes/search?q=pho` - Search dishes

### 📜 History
- `GET /history` - Get recognition history
- `POST /history` - Add to history
- `DELETE /history/{id}` - Delete history item

### ⭐ Favorites
- `GET /favorites` - Get favorite dishes
- `POST /favorites` - Add to favorites
- `DELETE /favorites/{id}` - Remove from favorites

### 🛒 Shopping List
- `GET /shopping` - Get shopping list
- `POST /shopping` - Add item
- `PATCH /shopping/{id}` - Update item
- `DELETE /shopping/{id}` - Delete item

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | deployment environment | `production` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `SECRET_KEY` | JWT secret key | - |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | Database user | `vnfood_user` |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | `vnfood` |
| `DB_PORT` | Database port | `3306` |
| `CONFIDENCE_THRESHOLD` | AI confidence threshold | `0.7` |
| `BLUR_THRESHOLD` | Image blur threshold | `100.0` |

### Database Schema

Database schema được tự động import từ `sql_parts/` khi container khởi động lần đầu.

## 🐳 Docker Commands

### Common Operations

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend bash

# View resource usage
docker stats
```

### Troubleshooting

```bash
# Check container status
docker-compose ps

# View all logs
docker-compose logs

# Rebuild after code changes
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Access MySQL directly
docker-compose exec mysql mysql -u root -p
```

## 📊 Monitoring

### Health Check

```bash
# API health endpoint
curl http://localhost:8000/health

# Container health
docker-compose ps
```

### Logs

```bash
# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f mysql

# Last 100 lines
docker-compose logs --tail=100
```

## 🔒 Security Considerations

1. **Change default passwords** in `.env` file
2. **Use strong SECRET_KEY** for JWT tokens
3. **Enable firewall** on the server
4. **Use HTTPS** with reverse proxy (Nginx/Caddy)
5. **Regular backups** of database
6. **Update Docker images** regularly

## 🚀 Production Deployment

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase timeout for AI processing
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

### SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📦 Database Backup

```bash
# Backup
docker-compose exec mysql mysqldump -u root -p vnfood > backup.sql

# Restore
docker-compose exec -T mysql mysql -u root -p vnfood < backup.sql
```

## 🐛 Common Issues

### Issue: Out of Memory

**Solution**: Increase server RAM or add swap space
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Issue: Port Already in Use

**Solution**: Change port in `docker-compose.yml` or kill the process
```bash
# Find process using port 8000
sudo lsof -i :8000

# Kill process
sudo kill -9 <PID>
```

### Issue: Database Connection Failed

**Solution**: Wait for MySQL container to be fully ready
```bash
docker-compose logs mysql
# Wait until you see "ready for connections"
```

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review configuration in `.env` file
- Ensure all ports are accessible
- Check Docker container status

## 📝 License

[Your License Here]
