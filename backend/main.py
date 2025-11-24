import uvicorn
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from routes import auth, recognition, history, favorites, dishes, shopping, health
except ImportError:
    from backend.routes import auth, recognition, history, favorites, dishes, shopping, health

app = FastAPI(
    title="VNFood Cloud API",
    description="Vietnamese Food Recognition API - Cloud Server",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    app.include_router(health.router, tags=["Health"])
    print("✓ Registered health router")
    app.include_router(auth.router, tags=["Authentication"])
    print("✓ Registered auth router")
    app.include_router(recognition.router, tags=["Recognition"])
    print("✓ Registered recognition router")
    app.include_router(history.router, tags=["History"])
    print("✓ Registered history router")
    app.include_router(favorites.router, tags=["Favorites"])
    print("✓ Registered favorites router")
    app.include_router(dishes.router, tags=["Dishes"])
    print("✓ Registered dishes router")
    app.include_router(shopping.router, tags=["Shopping List"])
    print("✓ Registered shopping router")
except Exception as e:
    print(f"Error registering routers: {e}")
    import traceback
    traceback.print_exc()

print("\nRegistered routes:")
for route in app.routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        print(f"  {list(route.methods)} {route.path}")

if __name__ == "__main__":
    try:
        from config import PORT, HOST, ENVIRONMENT
    except ImportError:
        from backend.config import PORT, HOST, ENVIRONMENT
    
    print("=" * 60)
    print("🚀 VNFood Cloud API Server")
    print(f"   Environment: {ENVIRONMENT}")
    print(f"   Running on: http://{HOST}:{PORT}")
    print("=" * 60)
    uvicorn.run(app, host=HOST, port=PORT, log_level="info")