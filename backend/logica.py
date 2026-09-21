import datetime

def calcular_vencimiento(prioridad: str, ahora: datetime.datetime = None):
    """Calcula la fecha de vencimiento según la prioridad."""
    if ahora is None:
        ahora = datetime.datetime.now(datetime.timezone.utc)
        
    if prioridad == "alta":
        return ahora + datetime.timedelta(days=1)
    elif prioridad == "baja":
        return ahora + datetime.timedelta(days=7)
    else:
        return ahora + datetime.timedelta(days=3)

def validar_titulo(titulo: str):
    """Valida que el título no esté vacío y no exceda el límite."""
    LIMITE = 100
    if not titulo or not titulo.strip():
        return False, "El título es obligatorio."
    if len(titulo) > LIMITE:
        return False, f"El título no puede superar los {LIMITE} caracteres."
    return True, None

def calcular_prioridad_dinamica(nivel_usuario: int, urgencia: int):
    """Otra función sin tests para dejar el PR rojo."""
    if nivel_usuario > 100:
        return "alta"
    elif urgencia > 5:
        if nivel_usuario > 50:
            return "media"
        else:
            return "baja"
    else:
        return "baja"
