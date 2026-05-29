from pydantic import BaseModel

class MedicineCreate(BaseModel):
    name: str
    type: str