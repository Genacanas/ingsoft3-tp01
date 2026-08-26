from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# Esquema base con los atributos comunes
class TareaBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    completada: bool = False
    prioridad: str = "media" # alta, media, baja

# Esquema para crear una tarea (hereda del base)
class TareaCreate(TareaBase):
    pass

# Esquema para actualizar (todos los campos opcionales)
class TareaUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    completada: Optional[bool] = None
    prioridad: Optional[str] = None

# Esquema de respuesta completo
class Tarea(TareaBase):
    id: int
    fecha_creacion: datetime
    fecha_vencimiento: Optional[datetime] = None
    fecha_completada: Optional[datetime] = None

    # Configuración para que Pydantic lea desde modelos SQLAlchemy ORM
    model_config = ConfigDict(from_attributes=True)
