from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.utils.deps import require_roles

router = APIRouter()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ GET ALL DOCTORS
@router.get("/doctors")
def get_doctors(
    db: Session = Depends(get_db),
    user=Depends(require_roles(["admin", "compounder"]))  # 🔐 optional security
):
    doctors = db.query(User).filter(User.role == "doctor").all()

    return [
        {
            "id": doc.id,
            "name": doc.name
        }
        for doc in doctors
    ]