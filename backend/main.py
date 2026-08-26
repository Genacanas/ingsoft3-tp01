from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import datetime

import models, schemas
from database import engine, get_db

# Crear las tablas en la base de datos de forma síncrona
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Gestor de Tareas con SLA",
    description="API REST para aplicación To-Do list con métricas de SLA",
    version="1.1.0"
)

# Configurar CORS para permitir peticiones desde el frontend SPA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Sistema"])
def health_check():
    return {"status": "ok"}

@app.get("/api/metricas", tags=["Métricas"])
def obtener_metricas(db: Session = Depends(get_db)):
    """Obtiene métricas de cumplimiento de SLA."""
    tareas_completadas = db.query(models.Tarea).filter(models.Tarea.completada == True).all()
    
    total = len(tareas_completadas)
    a_tiempo = 0
    tiempos_resolucion = {"alta": [], "media": [], "baja": []}
    
    for t in tareas_completadas:
        if t.fecha_completada and t.fecha_vencimiento:
            # Chequear si se cumplió el SLA
            if t.fecha_completada <= t.fecha_vencimiento:
                a_tiempo += 1
            
            # Calcular tiempo de resolución
            if t.fecha_creacion:
                # Reemplazar tzinfo para que ambas sean UTC offset-aware
                creacion = t.fecha_creacion
                completada = t.fecha_completada
                
                # Para evitar problemas con SQLite dates que vuelven sin timezone
                if creacion.tzinfo is None:
                    creacion = creacion.replace(tzinfo=datetime.timezone.utc)
                if completada.tzinfo is None:
                    completada = completada.replace(tzinfo=datetime.timezone.utc)
                
                horas = (completada - creacion).total_seconds() / 3600
                p = t.prioridad if t.prioridad in tiempos_resolucion else "media"
                tiempos_resolucion[p].append(horas)
                
    porcentaje = (a_tiempo / total * 100) if total > 0 else 0
    
    promedios = {}
    for p, tiempos in tiempos_resolucion.items():
        promedios[p] = (sum(tiempos) / len(tiempos)) if len(tiempos) > 0 else 0
        
    return {
        "total_completadas": total,
        "porcentaje_a_tiempo": round(porcentaje, 2),
        "tiempo_promedio_resolucion_horas": {
            "alta": round(promedios["alta"], 1),
            "media": round(promedios["media"], 1),
            "baja": round(promedios["baja"], 1)
        }
    }

@app.get("/api/tareas", response_model=List[schemas.Tarea], tags=["Tareas"])
def listar_tareas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tareas = db.query(models.Tarea).offset(skip).limit(limit).all()
    return tareas

@app.post("/api/tareas", response_model=schemas.Tarea, tags=["Tareas"], status_code=201)
def crear_tarea(tarea: schemas.TareaCreate, db: Session = Depends(get_db)):
    db_tarea = models.Tarea(**tarea.model_dump())
    
    # Lógica de negocio SLA: calcular fecha de vencimiento
    now = datetime.datetime.now(datetime.timezone.utc)
    if db_tarea.prioridad == "alta":
        db_tarea.fecha_vencimiento = now + datetime.timedelta(days=1)
    elif db_tarea.prioridad == "baja":
        db_tarea.fecha_vencimiento = now + datetime.timedelta(days=7)
    else:
        db_tarea.fecha_vencimiento = now + datetime.timedelta(days=3)
        
    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

@app.put("/api/tareas/{tarea_id}", response_model=schemas.Tarea, tags=["Tareas"])
def actualizar_tarea(tarea_id: int, tarea_update: schemas.TareaUpdate, db: Session = Depends(get_db)):
    db_tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if db_tarea is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    update_data = tarea_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "completada" and value != db_tarea.completada:
            if value:
                db_tarea.fecha_completada = datetime.datetime.now(datetime.timezone.utc)
            else:
                db_tarea.fecha_completada = None
        setattr(db_tarea, key, value)
        
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

@app.delete("/api/tareas/{tarea_id}", tags=["Tareas"])
def eliminar_tarea(tarea_id: int, db: Session = Depends(get_db)):
    db_tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if db_tarea is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    db.delete(db_tarea)
    db.commit()
    return {"mensaje": "Tarea eliminada exitosamente"}
