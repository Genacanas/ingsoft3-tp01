import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Cargar variables de entorno (útil si hay un archivo .env en local)
load_dotenv()

# Obtener URL de la base de datos desde las variables de entorno.
# Fallback a SQLite para desarrollo local rápido si no hay PostgreSQL configurado.
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./tareas.db"
)

# SQLite necesita un argumento especial para permitir multithreading.
# PostgreSQL no lo necesita, así que lo evaluamos dinámicamente.
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

# Configurar el motor de la base de datos
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

# Sesión para interactuar con la DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para definir nuestros modelos ORM
Base = declarative_base()

# Dependencia para obtener la sesión de la base de datos en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
