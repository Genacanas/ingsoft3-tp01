[![CI](https://github.com/Genacanas/ingsoft3-tp01/actions/workflows/ci.yml/badge.svg)](https://github.com/Genacanas/ingsoft3-tp01/actions/workflows/ci.yml)

# Proyecto IngSoft3 - versión B


Aquí tienes una propuesta completa y profesional para tu archivo **`README.md`**. Está redactada siguiendo estrictamente las pautas de la cátedra, destacando los pasos para un arranque desde cero y documentando ambas formas de ejecución (compilando localmente o desde las imágenes publicadas en GitHub Container Registry).

---

```markdown
# TP2 — Contenerización y Orquestación (Gestor de Tareas)

Este repositorio contiene la contenerización y orquestación con Docker y Docker Compose para la aplicación del curso (Backend en Python/FastAPI, Frontend en HTML/JS con Nginx como proxy reverso, y base de datos PostgreSQL)[cite: 1].

---

## 📋 Requisitos Previos

Para ejecutar la aplicación en cualquier máquina limpia, únicamente se requiere tener instalado[cite: 1]:

* **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (en Windows/Mac) o **Docker Engine + Docker Compose** (en Linux)[cite: 1].
* **Git** para clonar el repositorio[cite: 1].

---

## 🚀 Guía de Arranque desde Cero

### 1. Clonar el Repositorio

```bash
git clone [https://github.com/genacanas/ingsoft3-tp01.git](https://github.com/genacanas/ingsoft3-tp01.git)
cd ingsoft3-tp01

```

---

### 2. Configurar las Variables de Entorno

Antes de levantar los contenedores, es obligatorio crear el archivo `.env` a partir de la plantilla de ejemplo. El archivo `.env` contiene las credenciales de la base de datos y no se encuentra versionado en el repositorio por razones de seguridad.

**En Linux / Mac / Git Bash:**

```bash
cp .env.example .env

```

**En Windows (PowerShell):**

```powershell
cp .env.example .env

```

(Opcional: puedes editar `.env` para cambiar la contraseña por defecto `DB_PASSWORD` si lo deseas).

---

### 3. Levantar el Sistema

Tienes dos opciones para ejecutar la aplicación:

#### 🔹 Opción A: Compilación Local (`docker-compose.yml`)

Construye las imágenes de Backend y Frontend localmente mediante sus respectivos `Dockerfile`:

```bash
docker compose up -d --build

```

#### 🔹 Opción B: Desde GitHub Container Registry (`docker-compose.registry.yml`)

Descarga e inicia directamente las imágenes públicas publicadas en GHCR sin necesidad de compilar:

```bash
docker compose -f docker-compose.registry.yml up -d

```

---

## 🌐 Accesos a la Aplicación

Una vez que los contenedores estén activos:

* **Frontend (Interfaz Web):** [http://localhost:3000](http://localhost:3000)

* **Backend API (Healthcheck / Docs):** [http://localhost:8080/docs](http://localhost:8080/docs) (o `/health`)



---

## 🔍 Verificación y Estado de los Servicios

Para verificar que los 3 contenedores estén corriendo correctamente y la base de datos se encuentre en estado `healthy`:

```bash
docker compose ps

```

Para ver los logs en tiempo real de los servicios:

```bash
# Ver logs de todo el sistema
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

```

---

## 🛑 Detener el Sistema y Gestión de Persistencia

### Apagado normal (Conserva los datos de la base de datos)

Apaga y remueve los contenedores manteniéndolos limpios, pero **conservando el volumen de datos** `db_data`:

```bash
docker compose down

```

### Apagado completo (Limpia los volúmenes de datos)

Apaga los contenedores y **elimina los volúmenes**, reiniciando la base de datos a su estado vacío:

```bash
docker compose down -v

```

---

## 📄 Documentación del Trabajo Práctico

* **[`decisiones.md`](https://www.google.com/search?q=./decisiones.md):** Justificación técnica sobre la selección de imágenes base, estructura multi-stage, manejo de secretos y arquitectura de red.


* **[`evidencias.md`](https://www.google.com/search?q=./evidencias.md):** Capturas de pantalla de la aplicación en ejecución, prueba de persistencia de datos y evidencia de imágenes publicadas en GitHub Packages.
