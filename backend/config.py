import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "day-la-khoa-bi-mat-rat-manh-cua-toi-hay-thay-doi-no")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))

# Database Configuration - Cloud MySQL
DB_CONFIG = {
    'host': os.getenv("DB_HOST", "localhost"),
    'user': os.getenv("DB_USER", "root"),
    'password': os.getenv("DB_PASSWORD", ""),
    'database': os.getenv("DB_NAME", "vnfood"),
    'port': int(os.getenv("DB_PORT", 3306)),
    'pool_name': 'vnfood_pool',
    'pool_size': int(os.getenv("DB_POOL_SIZE", 5)),
    'pool_reset_session': True
}

# AI Model Configuration
BLUR_THRESHOLD = float(os.getenv("BLUR_THRESHOLD", 100.0))
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.7))
MODEL_PATH = os.getenv("MODEL_PATH", "model_traced.pt")

# Server Configuration
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
ENVIRONMENT = os.getenv("ENVIRONMENT", "production")  # development or production

