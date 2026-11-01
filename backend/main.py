"""
time_tracker — Backend API
Built on AINative Platform. Uses ZeroDB for storage, AINative JWT for auth.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routers.authentication import router as authentication_router
from app.routers.timer_control import router as timer_control_router
from app.routers.log_management import router as log_management_router
from app.routers.time_summary import router as time_summary_router

app = FastAPI(
    title="time_tracker API",
    version="0.1.0",
    description="Backend API for time_tracker, powered by AINative platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.ainative.studio"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication_router, prefix='/api/v1')
app.include_router(timer_control_router, prefix='/api/v1')
app.include_router(log_management_router, prefix='/api/v1')
app.include_router(time_summary_router, prefix='/api/v1')

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "time_tracker"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
