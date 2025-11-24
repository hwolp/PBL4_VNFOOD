#!/bin/bash

# VNFood Cloud Deployment Script for Linux Server
# This script deploys the backend API with Docker

set -e  # Exit on error

echo "================================================"
echo "🚀 VNFood Cloud API Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${YELLOW}⚠️  Please edit backend/.env with your configuration before deploying!${NC}"
        echo -e "${YELLOW}   Press ENTER to continue after editing, or Ctrl+C to cancel...${NC}"
        read
    else
        echo -e "${RED}❌ .env.example not found. Cannot create .env${NC}"
        exit 1
    fi
fi

# Build and start containers
echo -e "${GREEN}📦 Building Docker images...${NC}"
docker-compose build

echo -e "${GREEN}🚀 Starting containers...${NC}"
docker-compose up -d

echo -e "${GREEN}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check container status
echo -e "${GREEN}📊 Container status:${NC}"
docker-compose ps

echo ""
echo "================================================"
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "================================================"
echo ""
echo "📍 API Server: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop server: docker-compose down"
echo ""
echo "================================================"
