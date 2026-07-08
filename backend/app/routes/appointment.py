from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from datetime import datetime
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate
from app.models.patient import Patient
from app.utils.deps import require_role
from app.models.user import User
router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Create Appointment
@router.post("/")
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db),user=Depends(require_role("compounder"))):

    # Slot Check
    existing = db.query(Appointment).filter(
        Appointment.doctor_id == data.doctor_id,
        Appointment.date == data.date,
        Appointment.time == data.time
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Slot already booked")

    new_appointment = Appointment(**data.dict())

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment


# ✅ Get Today Appointments
# @router.get("/today")
# def today_appointments(db: Session = Depends(get_db)):
#     today = date.today()

#     return db.query(Appointment).filter(Appointment.date == today).all()



# @router.get("/todays")
# def today_appointments(db: Session = Depends(get_db)):

#     today = date.today()
#     now_time = datetime.now().time()

#     appointments = db.query(Appointment).filter(
#         Appointment.date == today
#     ).order_by(Appointment.time).all()

#     updated = False

#     for appt in appointments:
#         if appt.status == "pending" and appt.time < now_time:
#             appt.status = "cancelled"
#             updated = True

#     if updated:
#         db.commit()

#     return appointments

@router.get("/todays")
def today_appointments(db: Session = Depends(get_db),user=Depends(require_role("doctor"))):

    today = date.today()

    # Cancel all pending appointments before today
    db.query(Appointment).filter(
        Appointment.status == "pending",
        Appointment.date < today
    ).update(
        {"status": "cancelled"},
        synchronize_session=False
    )

    db.commit()

    # now_time = datetime.now().time()

    # appointments = db.query(Appointment).filter(
    #     Appointment.date == today
    # ).order_by(Appointment.time).all()
    appointments = db.query(Appointment).filter(
        Appointment.date == today,
        Appointment.doctor_id == user["user_id"]   # 🔥 IMPORTANT
    ).order_by(Appointment.time).all()
    # updated = False

    # for appt in appointments:
    #     if appt.status == "pending" and appt.time < now_time:
    #         appt.status = "cancelled"
    #         updated = True

    # if updated:
    #     db.commit()

    # ✅ ADD THIS PART
    result = []

    for appt in appointments:
        patient = db.query(Patient).filter(
            Patient.id == appt.patient_id
        ).first()

        # result.append({
        #     "id": appt.id,
        #     "patient_id": appt.patient_id,
        #     "patient_code": patient.patient_code if patient else None,
        #     "patient_name": patient.name if patient else None,
        #     "time": appt.time,
        #     "status": appt.status
        # })
        doctor = db.query(User).filter(User.id == appt.doctor_id).first()

        result.append({
            "id": appt.id,
            "patient_id": appt.patient_id,
            "patient_code": patient.patient_code if patient else None,
            "patient_name": patient.name if patient else None,

            "doctor_id": appt.doctor_id,
            "doctor_name": doctor.name if doctor else None,  # 🔥 NEW

            "time": appt.time,
            "status": appt.status,
            "notes": appt.notes 
        })
    return result

# ✅ Get Tomorrow Appointments (Compounder Feature)
@router.get("/tomorrow")
def tomorrow_appointments(db: Session = Depends(get_db),user=Depends(require_role("compounder"))):
    tomorrow = date.today() + timedelta(days=1)

    # return db.query(Appointment).filter(Appointment.date == tomorrow).all()
    appointments = db.query(Appointment).filter(

        Appointment.date == tomorrow,
        # Appointment.doctor_id == user["user_id"]
        # Appointment.date == tomorrow
    ).order_by(Appointment.time).all()

    result = []

    for appt in appointments:
        patient = db.query(Patient).filter(
            Patient.id == appt.patient_id
        ).first()

        # result.append({
        #     "id": appt.id,
        #     "patient_id": appt.patient_id,
        #     "patient_code": patient.patient_code if patient else None,
        #     "patient_name": patient.name if patient else None,
        #     "patient_phone": patient.phone if patient else None,
        #     "doctor_id": appt.doctor_id,
        #     "time": appt.time
        # })

        doctor = db.query(User).filter(User.id == appt.doctor_id).first()

        result.append({
            "id": appt.id,
            "patient_id": appt.patient_id,
            "patient_code": patient.patient_code if patient else None,
            "patient_name": patient.name if patient else None,
            "patient_phone": patient.phone if patient else None,

            "doctor_id": appt.doctor_id,
            "doctor_name": doctor.name if doctor else None,  # 🔥 ADD THIS

            "time": appt.time
        })


    return result



# ✅ Reschedule Appointment
@router.put("/{appointment_id}")
def reschedule(appointment_id: int, data: AppointmentCreate, db: Session = Depends(get_db), user=Depends(require_role("compounder"))):

    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Check slot again
    existing = db.query(Appointment).filter(
        Appointment.doctor_id == data.doctor_id,
        Appointment.date == data.date,
        Appointment.time == data.time
    ).first()

    if existing and existing.id != appointment_id:
        raise HTTPException(status_code=400, detail="Slot already booked")

    appointment.date = data.date
    appointment.time = data.time
    appointment.notes = data.notes

    db.commit()
    db.refresh(appointment)

    return appointment

@router.get("/last/{patient_id}")
def get_last_appointment(patient_id: int, db: Session = Depends(get_db)):

    # get last appointment (latest date)
    last = db.query(Appointment).filter(
        Appointment.patient_id == patient_id
    ).order_by(Appointment.date.desc()).first()

    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "patient_name": patient.name,
        "patient_code": patient.patient_code,
        "dob": patient.dob,
        "address": patient.address,
        "last_appointment_date": last.date if last else None,
        "last_status": last.status if last else None
    }


@router.get("/by-date")
def get_slots(doctor_id: int, date: date, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.date == date
    ).all()

    return [appt.time.strftime("%H:%M") for appt in appointments]
