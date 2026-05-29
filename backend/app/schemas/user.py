from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str | None = None
    phone: str | None = None
    password: str