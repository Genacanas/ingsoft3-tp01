decisiones.md â€” tres cosas, cortas y honestas:

Por quÃ© Git no pudo resolver el conflicto solo â€” y quÃ© habrÃ­a tenido que pasar para que nunca apareciera.
QuÃ© problemas encontraste y cÃ³mo los solucionaste. Los tropiezos bien contados valen mÃ¡s que un camino perfecto: son los que demuestran que entendiste.
DeclaraciÃ³n de uso de IA: quÃ© partes hiciste con ayuda de inteligencia artificial y cÃ³mo verificaste lo que te devolviÃ³ (Â§ Uso de IA del enunciado


## Por quÃ© Git no pudo resolver el conflicto solo
Ya que hubo dos cambios en el codigo en la misma linea de codigo. Para que no aparecieran, se podria esperar a que se suba el cambio de la version A, el editor B hacer el pull y recien ahi hacer sus cambios y pushearlos.

## QuÃ© problemas encontraste y cÃ³mo los solucionaste
No tuve problemas en si, mas de los esperados.

## DeclaraciÃ³n de uso de IA
No se utilizo la IA, solo utilce la guia .md y el video con la voz del profe.


## TP2 â€” Contenedores

### 1. ElecciÃ³n de la app del semestre
- **AplicaciÃ³n:** Gestor de Tareas (To-Do List).
- **Backend:** Python con FastAPI.
- **Frontend:** HTML/JS / React.
- **Base de Datos:** PostgreSQL.
- **JustificaciÃ³n:** Cumple con los requisitos mÃ­nimos de backend + frontend + BD. Es un sistema ligero, fÃ¡cil de mantener y probar.

## DeclaraciÃ³n de uso de IA
Se utilizo la IA para ayudarme a entender conceptos y comandos a lo largo del tp, ademas de decirme que dependencias e imagenes de mis tecnologias debia utilizar en los Dockerfile. Tambien ayudo a redactar el README.md


## TP03 â€” PlanificaciÃ³n y Trazabilidad

### 1. DuraciÃ³n del Sprint
Se fijÃ³ una duraciÃ³n de **2 semanas**. Se eligiÃ³ este perÃ­odo para alinear las iteraciones con el calendario oficial de entregas del aula virtual, manteniendo un ritmo constante de entregas cortas de valor.

### 2. LÃ­mite de Trabajo en Progreso (WIP Limit)
Se estableciÃ³ un lÃ­mite de **2 tarjetas** en la columna *In Progress*. Siguiendo la regla para trabajo individual ($1 \text{ persona} + 1$), el margen de 2 permite trabajar en un Ã­tem sin acumular tareas a medio hacer, dejando una vÃ¡lvula de escape si un trabajo queda bloqueado esperando revisiÃ³n.

### 3. DiagnÃ³stico de la Historia Mal Escrita
- **Por quÃ© estÃ¡ mal:** La consigna *"Como desarrollador quiero crear la tabla usuarios"* es una **tarea tÃ©cnica disfrazada**. No entrega un incremento de valor observable por un usuario final ni justifica el beneficio real del requerimiento.
- **CÃ³mo la reescribirÃ­a:** *"Como usuario registrado quiero iniciar sesiÃ³n con credenciales para acceder a mi panel personal de tareas."*

### 4. Problemas Encontrados y Soluciones
- Se optÃ³ por la gestiÃ³n visual mediante la interfaz web de GitHub Projects para asegurar la correcta vinculaciÃ³n de jerarquÃ­as (sub-issues) y evitar conflictos de autenticaciÃ³n con CLI en entornos locales.

### 5. DeclaraciÃ³n de Uso de IA
Se utilizÃ³ IA como asistente conceptual para la estructuraciÃ³n de la jerarquÃ­a (Ã‰pica -> Historia -> Tareas), la redacciÃ³n del archivo `.github/workflows/ci.yml` y la articulaciÃ³n de las justificaciones Ã¡giles para la defensa oral.

# TP04 Decisiones de DiseÃ±o y Arquitectura - (CI: Pipelines as Code)

## 1. Estructura del Pipeline
Se configuraron dos jobs independientes que ejecutan en paralelo: `build-backend` y `build-frontend`[cite: 1].
* **Â¿Por quÃ© en paralelo?**: Para minimizar el tiempo total de ejecuciÃ³n y validar que ambas partes se construyan de manera aislada en runners efÃ­meros[cite: 1].
* **Triggers**: Se definieron disparadores para `pull_request` sobre `main` (para validar los cambios antes de integrar) y `push` sobre `main` (para actualizar la corrida que lee el badge y dejar el cache listo para futuros PRs)[cite: 1].

## 2. ConstrucciÃ³n basada en Dockerfile
El pipeline ejecuta `docker/build-push-action` usando los `Dockerfile` del TP2 en lugar de compilar directamente en el runner con herramientas nativas[cite: 1].
* **RazÃ³n**: Mantiene una Ãºnica fuente de verdad[cite: 1]. Evita tener dos definiciones de build que puedan divergir y garantiza que el CI verifica exactamente la misma imagen que luego se desplegarÃ¡ en producciÃ³n[cite: 1].

## 3. Estrategia de Cache de Capas
Se configurÃ³ el cache del builder en GitHub Actions (`type=gha`) utilizando `docker/setup-buildx-action`[cite: 1].
* **Capas reutilizadas**: Aquellas que instalan dependencias cuando los archivos manifiesto (`.csproj`, `package.json`) no sufren modificaciones[cite: 1].
* **Capas no reutilizadas**: Las etapas finales que copian el cÃ³digo fuente y compilan la aplicaciÃ³n[cite: 1].
* **Comportamiento si el cache desaparece**: El pipeline es totalmente independiente del cache[cite: 1]. Si las capas se eliminan o expiran, la construcciÃ³n simplemente se realiza desde cero, tardando mÃ¡s tiempo pero resultando exitosa[cite: 1].

## 4. Problemas Encontrados y Soluciones
* **Conflicto de cache entre jobs**: Inicialmente ambos jobs sobreescribÃ­an sus capas[cite: 1]. Se solucionÃ³ definiendo un identificador de espacio Ãºnico (`scope=backend` y `scope=frontend`) en las opciones del cache[cite: 1].
* **Bloqueo por actualizaciÃ³n de rama (`strict: true`)**: La regla exigiÃ³ que la rama del PR estuviera al dÃ­a con `main` antes de hacer el merge[cite: 1]. Se resolviÃ³ presionando **Update branch** en el PR para correr la verificaciÃ³n sobre el resultado mezclado[cite: 1].

## 5. DeclaraciÃ³n de Uso de IA
Se utilizÃ³ la asistencia de IA para:
* Guiar la configuraciÃ³n de los triggers y sintaxis de los workflows de GitHub Actions[cite: 1].
* Diagnosticar el funcionamiento de las reglas de protecciÃ³n de rama y el comportamiento del gate[cite: 1].
* VerificaciÃ³n: Cada sugerencia fue probada, ejecutada y auditada a travÃ©s de los logs de la pestaÃ±a Actions y las revisiones en los Pull Requests[cite: 1].

## TP05 — Testing y Calidad Automatizada

### 1. Lógica elegida para testear

- **Backend:** Se extrajo a `backend/logica.py` las funciones `calcular_vencimiento` y `validar_titulo`. También se creó `backend/servicios.py` con `ServicioDeTareas` que recibe un `INotificador` por inyección. Se eligió esta lógica porque el cálculo del SLA (fecha de vencimiento según prioridad) y la validación del título son las dos reglas de negocio centrales de la app. Un bug en cualquiera de las dos genera tareas con vencimiento incorrecto o datos corruptos.
- **Frontend:** Se extrajo la lógica pura a `frontend/src/lib/tareas.js` con las funciones `validarTitulo` (regla de validación) y `pendientesDe` (que recibe el cliente HTTP por parámetro para poder mockearlo).

### 2. Umbral de Cobertura (Coverage)

- **Umbral:** Se fijó en **80%** sobre la métrica de **líneas y ramas** (ambas).
- **¿Por qué 80%?:** Tras escribir los tests, el backend midió 86% de líneas y el frontend 83%. Se eligió 80% porque ancla el número justo por debajo de la medición real, frenando si alguien baja sin agregar tests, sin ser inalcanzable desde el primer día.
- **Branch coverage actual:** Backend ~85% de ramas, Frontend ~85% de ramas.
- **Qué dejamos afuera de la cuenta — y por qué:**
  - **Backend:** Se midió solo `logica.py` y `servicios.py`. Quedaron fuera `main.py` (arranque FastAPI + rutas sin lógica propia), `database.py`, `models.py` y `schemas.py` (clases de datos, sin reglas de negocio). Excluirlos no es trampa: si hubiera lógica allí, primero habría que extraerla.
  - **Frontend:** Se usó `include: ['src/lib/**']` en `vite.config.js` para medir solo la lógica pura. Quedó fuera `app.js` que solo maneja eventos del DOM y llamadas `fetch` — sin inyección de dependencias, su test sería un test de integración que necesita el navegador, no un unit test.

### 3. Coverage alto no garantiza calidad (con ejemplo concreto)

En `backend/tests/test_logica.py`, si escribiéramos este test:

```python
def test_trampa():
    calcular_vencimiento("alta")   # sin ningún assert
```

La función `calcular_vencimiento` quedaría al 100% de líneas ejecutadas... pero el test no verifica absolutamente nada. Si alguien cambia `days=1` por `days=99`, ese test seguiría verde. Por eso el umbral de coverage es un detector de agujeros (código que nadie ejercita), no una garantía de corrección.

### 4. Refactorización para Mockear

- **Backend:** `NotificadorEmail` originalmente se habría instanciado adentro del servicio con `self._notificador = NotificadorEmail()`. Así, desde un test, no había forma de reemplazarla sin mandar un email real. Se refactorizó para que el constructor reciba el notificador: `def __init__(self, notificador: INotificador)`. Ahora el test le pasa un `Mock()` y verifica la interacción sin tocar la red.
- **Frontend:** `pendientesDe` originalmente llamaría a `fetch` directamente, haciéndola imposible de testear sin un servidor levantado. Se refactorizó para recibir la función `traer` por parámetro (`pendientesDe(prioridad, traer)`), permitiendo inyectar un `vi.fn()` en los tests.

### 5. El ejercicio del camino sin cubrir (rama de código)

Al revisar el reporte HTML de coverage del backend, se identificó que en `calcular_vencimiento` la **rama `if ahora is None`** (la rama que evalúa cuando no se pasa el parámetro `ahora`) contaba como ejecutada solo por el camino `False` (cuando el test le pasa el tiempo explícitamente). La rama `True` (cuando `ahora` es `None` y se llama sin ese parámetro) no estaba siendo ejercitada en el test parametrizado.

- **Línea:** `if ahora is None:` en `logica.py` línea 5.
- **Entrada que la recorrería:** Llamar a `calcular_vencimiento("alta")` sin el segundo parámetro.
- **Decisión:** Se decidió **no agregar ese test por separado**, ya que la función en producción siempre se llama sin el parámetro (el `main.py` llama `logica.calcular_vencimiento(db_tarea.prioridad)`), así que esa rama `True` es el caso real. En cambio, los tests inyectan el tiempo para garantizar determinismo (no depender de `datetime.now()`). El tradeoff es claro y aceptado.

### 6. Pull Requests de Demostración

- **Corrida roja por cobertura (el umbral frenando):** https://github.com/Genacanas/ingsoft3-tp01/actions/runs/35616042887/job/106386884911?pr=23
  - El job `build-backend` falló porque `categorizar_tarea` tenía 7 ramas sin tests, bajando la cobertura por debajo del 80%.
- **Primer Pull Request (secuencia completa: bloqueado → tests agregados → verde → mergeado):** https://github.com/Genacanas/ingsoft3-tp01/pull/23
- **Segundo Pull Request (abierto y en rojo hasta la defensa):** https://github.com/Genacanas/ingsoft3-tp01/pull/24

### 7. Problemas encontrados y soluciones

- **`pytest` no encontraba `logica` como módulo:** Al correr `pytest` directamente desde la terminal, Python no tenía el directorio `backend/` en el path. Se solucionó corriendo `python -m pytest` desde dentro de `backend/`, que agrega el directorio actual al path automáticamente.
- **`echo` en PowerShell rompió `requirements.txt`:** Al agregar `pytest` con `echo pytest >> requirements.txt`, la línea quedó pegada a la última línea existente (`uvicorn==0.52.3pytest`). Se corrigió con PowerShell `Set-Content`.
- **Docker `ENTRYPOINT` bloqueaba el paso de cobertura en CI:** El paso "Reporte de coverage" intentaba correr `python -m coverage report` en el contenedor, pero el `ENTRYPOINT` fijo de `pytest` le añadía pytest como prefijo. Se solucionó con `--entrypoint python` en el `docker run`.
- **Conflicto de merge en `feat/demostracion-roja`:** Al hacer `git pull origin main` en esa rama, `logica.py` tenía dos funciones nuevas en la misma zona. Se resolvió manteniendo ambas funciones.

### 8. Declaración de Uso de IA

Se utilizó la IA generativa (Antigravity AI Assistant) para:
- Configurar el workflow `ci.yml` con las etapas de tests y publicación de coverage.
- Configurar vitest con `@vitest/coverage-v8` y el umbral en `vite.config.js`.
- Crear la estructura inicial de `logica.py`, `servicios.py` y los archivos de tests.
- Resolver los problemas de integración descritos arriba.

Verificación: cada archivo generado por IA fue ejecutado localmente (`python -m pytest`, `npm run test -- --run --coverage`) y los resultados revisados antes de hacer commit. Se puede defender cada assert y qué comportamiento protege.

