from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db

# Crear las tablas en la base de datos de forma síncrona
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Gestor de Tareas",
    description="API REST para aplicación To-Do list",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde el frontend SPA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # PRECAUCIÓN: En producción, reemplazar con dominios específicos
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Sistema"])
def health_check():
    """Endpoint de salud para verificar que la API está funcionando."""
    return {"status": "ok"}

@app.get("/api/tareas", response_model=List[schemas.Tarea], tags=["Tareas"])
def listar_tareas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todas las tareas."""
    tareas = db.query(models.Tarea).offset(skip).limit(limit).all()
    return tareas

@app.post("/api/tareas", response_model=schemas.Tarea, tags=["Tareas"], status_code=201)
def crear_tarea(tarea: schemas.TareaCreate, db: Session = Depends(get_db)):
    """Crear una nueva tarea."""
    db_tarea = models.Tarea(**tarea.model_dump())
    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

@app.put("/api/tareas/{tarea_id}", response_model=schemas.Tarea, tags=["Tareas"])
def actualizar_tarea(tarea_id: int, tarea_update: schemas.TareaUpdate, db: Session = Depends(get_db)):
    """Actualizar una tarea existente (ej. marcar como completada)."""
    db_tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if db_tarea is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    # Solo actualiza los campos proporcionados (ignora los no enviados)
    update_data = tarea_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tarea, key, value)
        
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

@app.delete("/api/tareas/{tarea_id}", tags=["Tareas"])
def eliminar_tarea(tarea_id: int, db: Session = Depends(get_db)):
    """Eliminar una tarea específica."""
    db_tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if db_tarea is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    db.delete(db_tarea)
    db.commit()
    return {"mensaje": "Tarea eliminada exitosamente"}
