def generate_patient_code(last_id: int):
    return f"PDMS{str(last_id).zfill(5)}"