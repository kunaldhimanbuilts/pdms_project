from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.medicine import Medicine
from app.schemas.medicine import MedicineCreate
from app.utils.deps import require_role
router = APIRouter()
from app.utils.deps import require_roles

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Add Medicine
@router.post("/")
def add_medicine(data: MedicineCreate, db: Session = Depends(get_db), user=Depends(require_role("doctor"))):

    med = Medicine(**data.dict())

    db.add(med)
    db.commit()
    db.refresh(med)

    return med


# ✅ Get All Medicines
@router.get("/")
def get_medicines(db: Session = Depends(get_db), user=Depends(require_roles(["doctor", "admin"]))):
    return db.query(Medicine).all()


# ✅ Update Medicine
@router.put("/{med_id}")
def update_medicine(med_id: int, data: MedicineCreate, db: Session = Depends(get_db), user=Depends(require_role("doctor"))):

    med = db.query(Medicine).filter(Medicine.id == med_id).first()

    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    med.name = data.name
    med.type = data.type

    db.commit()
    return med


# ✅ Delete Medicine
@router.delete("/{med_id}")
def delete_medicine(med_id: int, db: Session = Depends(get_db), user=Depends(require_role("doctor"))):

    med = db.query(Medicine).filter(Medicine.id == med_id).first()

    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(med)
    db.commit()

    return {"message": "Deleted successfully"}

@router.get("/type/{type}")
def get_by_type(type: str, db: Session = Depends(get_db), user=Depends(require_role("doctor"))):
    return db.query(Medicine).filter(Medicine.type == type).all()