from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# Esquema base con los atributos comunes
class TareaBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    completada: bool = False

# Esquema para crear una tarea (hereda del base)
class TareaCreate(TareaBase):
    pass

# Esquema para actualizar (todos los campos opcionales)
class TareaUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    completada: Optional[bool] = None

# Esquema de respuesta completo
class Tarea(TareaBase):
    id: int
    fecha_creacion: datetime

    # Configuración para que Pydantic lea desde modelos SQLAlchemy ORM
    model_config = ConfigDict(from_attributes=True)
