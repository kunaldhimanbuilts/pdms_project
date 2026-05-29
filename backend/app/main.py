from fastapi import FastAPI
from app.routes import auth
from app.database import Base, engine
from app.models import user
from app.models import patient
from app.models import appointment
from app.models import diagnosis, prescription
from app.models import medicine
from app.routes import diagnosis_v2

app = FastAPI()
from app.routes import patient
from app.routes import appointment
from app.routes import diagnosis

from app.routes import medicine

from app.routes import admin
from app.routes import dashboard
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user





Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(patient.router, prefix="/patients", tags=["Patients"])
app.include_router(appointment.router, prefix="/appointments", tags=["Appointments"])
app.include_router(diagnosis.router, prefix="/diagnosis", tags=["Diagnosis"])

app.include_router(medicine.router, prefix="/medicines", tags=["Medicines"])

app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(dashboard.router, prefix="/dashboard")


app.include_router(user.router, prefix="/users", tags=["Users"])


app.include_router(diagnosis_v2.router, prefix="/diagnosis-v2", tags=["Diagnosis V2"])



@app.get("/")
def home():
    return {"message": "PDMS Backend Running 🚀"}


# if __name__ == "__main__":
#     import uvicorn
#     # uvicorn.run("app.main:app", host="127.0.0.1", port=8000)
#     uvicorn.run(
#         "app.main:app",
#         host="127.0.0.1",
#         port=8000,
#         log_config=None   # 🔥 THIS FIXES ERROR
#     )
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_config=None
    )


# # ✅ Health check route
# @app.get("/status")
# def status():
#     return {
#         "status": "ok",
#         "service": "clinic-backend"
#     }
