from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class Tarea(Base):
    __tablename__ = "tareas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True, nullable=False)
    descripcion = Column(String, nullable=True)
    completada = Column(Boolean, default=False)
    # Genera la fecha automáticamente en el motor de base de datos
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
