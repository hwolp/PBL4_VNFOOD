# VNFood Cloud API - Quick Start

## 🚀 Quick Start (Linux Server)

### 1. Chuẩn bị

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group (optional)
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone và Configure

```bash
# Clone repo
git clone <your-repo>
cd PBL4_VNFOOD

# Copy và edit .env
cp backend/.env.example backend/.env
nano backend/.env

# Cập nhật:
# - SECRET_KEY (random string)
# - DB_PASSWORD (secure password)
```

### 3. Deploy

```bash
# Option 1: Auto deploy
chmod +x deploy.sh
./deploy.sh

# Option 2: Manual
docker-compose up -d
```

### 4. Test API

```bash
# Health check
curl http://localhost:8000/health

# Docs
http://your-server-ip:8000/docs
```

## 📡 Test Image Recognition

```bash
# Upload image để nhận diện
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/food.jpg" \
  -F "language=vi"
```

## 🔧 Manage Services

```bash
# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Update code and rebuild
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🌐 Production Setup (Optional - Nginx + SSL)

### Install Nginx

```bash
sudo apt install nginx -y
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/vnfood
```

Paste config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Timeouts for AI processing
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/vnfood /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Add SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# API health
watch -n 5 curl -s http://localhost:8000/health
```

## ⚡ Performance Tips

1. **RAM**: Minimum 4GB, recommended 8GB
2. **Swap**: Add swap if needed:
   ```bash
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```
3. **Firewall**: Allow port 8000 or 80/443
   ```bash
   sudo ufw allow 8000
   sudo ufw allow 80
   sudo ufw allow 443
   ```

## 🐛 Troubleshooting

### Container won't start
```bash
docker-compose logs backend
```

### Database connection error
```bash
docker-compose logs mysql
# Wait until "ready for connections"
```

### Port already in use
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

## 📚 Full Documentation

See [README_DEPLOYMENT.md](README_DEPLOYMENT.md) for complete documentation.
