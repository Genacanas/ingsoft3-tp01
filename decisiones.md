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


## TP06 - CD: Environments, Aprobaciones y Deployment Patterns

### Enlaces de este TP
- **Paquete Backend:** https://github.com/Genacanas/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-backend
- **Paquete Frontend:** https://github.com/Genacanas/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-frontend
- **URL de QA (Frontend):** https://front-qa-lu45.onrender.com
- **URL de PROD (Frontend):** https://front-prod-oqig.onrender.com
- **Corrida donde salte� publicar la imagen (PR):** https://github.com/Genacanas/ingsoft3-tp01/actions
- **Corrida final en main (Public� y Despleg�):** https://github.com/Genacanas/ingsoft3-tp01/actions

### El artefacto
El pipeline publica las im�genes Docker **solo** cuando la verificaci�n est� en verde y el push es en main. El paso de publicaci�n est� intencionalmente al final del job uild-backend y uild-frontend. Si se publicara igual cuando los tests fallan, estar publicado dejar�a de significar "esto pas� la verificaci�n" y el registry se llenar�a de im�genes rotas.

### CD vs Continuous Deployment
Implementamos **Continuous Delivery**. Hay un pipeline que automatiza la verificaci�n y el despliegue a QA, pero el paso final hacia Producci�n tiene un "gate humano" (aprobaci�n manual). Continuous Deployment ser�a si el pipeline llegara a producci�n sin intervenci�n humana, lo cual requiere una madurez muy alta en tests y monitoreo.

### El dise�o de la cadena
- 
eeds: deploy-qa asegura que Producci�n no se dispare hasta que QA haya sido desplegado exitosamente.
- if: github.ref == 'refs/heads/main' en deploy-qa garantiza que los Pull Requests verifiquen pero no desplieguen.
- environment: qa y environment: production se usan para heredar los secretos de los Deploy Hooks con alcance restringido (los de PROD no son accesibles para QA ni para PRs no aprobados).

### El Aprobador
Antes de aprobar el paso a Producci�n, el aprobador revisa que el smoke test de QA haya dado verde, verifica qu� cambia en ese commit en particular, y se asegura de que sea el momento adecuado para el negocio.

### Letra chica del Free Tier y Smoke Test
El free tier de Render tiene cold starts (el servicio se duerme tras 15 minutos sin tr�fico). Si el pipeline hiciera un simple curl, fallar�a. Por eso el smoke test tiene un loop que reintenta cada 20 segundos hasta 30 veces. El smoke test llama a /health, /api/tareas (para confirmar la BD) y al front. Sin embargo, no verifica *qu�* versi�n est� corriendo, solo que responde.

### Garant�a perdida en Render
Dado que Render (en este TP) reconstruye la aplicaci�n desde el c�digo fuente del repositorio en lugar de correr la imagen inmutable que publicamos en ghcr.io, perdemos la garant�a estricta de que "se despliega exactamente lo mismo que se verific�" (podr�an cambiar dependencias en ese nuevo build). Esto se soluciona desplegando im�genes pre-compiladas.

### Estrategia de Deployment y Rollback
- **Estrategia para PROD real:** Elegir�a **Blue-Green** porque permite tener dos entornos productivos y el cambio (router) es instant�neo, con cero downtime y rollback inmediato. Requerir�a duplicar infraestructura temporalmente.
- **Plan de Rollback actual:** Para volver atr�s en caso de falla, copio las URLs de los Deploy Hooks de Render de PROD y les agrego &ref=<SHA_ANTERIOR>. 
- **Tiempo cronometrado del rollback:** 36 segundos.
- *Aclaraci�n:* El rollback redespliega el c�digo viejo, pero **NO** deshace los cambios en la base de datos (por ejemplo, columnas eliminadas).

### Declaraci�n de IA
Se utiliz� Antigravity AI para guiar la creaci�n de los entornos, configurar ci.yml, escribir la plantilla de Nginx y redactar este documento de decisiones.


## TP07 — Contenedores en el pipeline + Integración y E2E

### Enlaces del TP7

| Recurso | URL |
|---|---|
| Backend package (ghcr.io) | https://github.com/Genacanas/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-backend |
| Frontend package (ghcr.io) | https://github.com/Genacanas/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-frontend |
| Commit que rompió la app | `6447c165e81e6f1a398acd4db6b5010806020437` |
| Corrida fallida (integración 🟢 / E2E 🔴) | https://github.com/Genacanas/ingsoft3-tp01/actions/runs/38500864916 |
| Corrida exitosa hasta PROD | https://github.com/Genacanas/ingsoft3-tp01/actions/runs/38502481406 |
| QA Frontend | https://front-qa-vvvs.onrender.com |
| QA API | https://api-qa-h097.onrender.com |
| PROD Frontend | https://front-prod-tfut.onrender.com |
| PROD API | https://api-prod-3ip5.onrender.com |

### 1. Build once, deploy many — qué problema del TP6 resuelve

En el TP6, Render reconstruía la aplicación desde el código fuente cada vez que hacíamos un deploy. Eso introduce un riesgo sutil: las dependencias (package.json, pip) se resuelven de nuevo en el momento del build, y si alguna biblioteca publica una versión nueva o el índice de paquetes cambia, el binario que llega a PROD puede diferir del que pasó los tests en CI. "Build once, deploy many" cierra esa brecha: publicamos una imagen inmutable en ghcr.io, la verificamos en QA y mandamos *esa misma imagen* a PROD, sin recompilar nada.

### 2. Estrategia de etiquetas

Usamos dos tipos de etiqueta en ghcr.io:

- **`sha-<commit>`**: identifica exactamente qué código contiene la imagen. Es inmutable: no se puede pisar con otro push. El pipeline la genera automáticamente para cada commit que llega a `main`.
- **`v7.0.0`**: nombre semántico, legible por humanos, que marca el release oficial. Apunta al mismo layer que `sha-5aa06e5`.

No publicamos `latest` porque `latest` es mutable: si alguien la pisa en un deploy futuro, perdemos la trazabilidad y no sabemos qué está corriendo en PROD.

En Render, cada servicio se configuró apuntando a la imagen inicial. Pero el Deploy Hook que llama el pipeline siempre pasa la imagen de *esa corrida concreta* mediante el parámetro `imgURL`, sobreescribiendo la imagen base configurada en el servicio.

### 3. Del tag a la imagen: trazabilidad completa

```
git rev-list -n1 v7.0.0
# → 5aa06e58fbd468df87576cf941f4340dc00b0704

# La imagen en ghcr.io se llama:
ghcr.io/genacanas/ingsoft3-tp01-backend:sha-5aa06e5
ghcr.io/genacanas/ingsoft3-tp01-frontend:sha-5aa06e5
```

Así se puede ir desde la etiqueta del release hasta la imagen exacta que corre en producción, sin ambigüedad.

### 4. Cómo comprobar que un entorno ejecuta TU imagen

Mirando el panel **Events** del servicio en Render: debe decir `"Triggered via Deploy Hook"` junto al SHA de la imagen que le pasamos. El smoke test solo verifica que el servicio responde; si el deploy falló pero el servicio antiguo sigue levantado, el smoke devuelve 200 igual. El evento de Render es la única prueba de que el deploy realmente ocurrió con la imagen nueva.

### 5. Tests elegidos

**Integración (api.spec.js) — 3 tests, fixture `request`:**
1. `GET /api/tareas` responde 200 y devuelve un array.
2. `POST /api/tareas` con título válido crea la tarea y la devuelve con `id`.
3. `POST /api/tareas` con título vacío devuelve 422 (validación del backend).

Estos tests hablan directamente con la API desplegada en QA, sin browser ni frontend. Verifican que el contrato HTTP del backend funciona.

**E2E (tareas.spec.js) — 3 tests, browser Chromium:**
1. Crear una tarea → aparece en la lista → el botón "Eliminar" la saca.
2. Título de más de 100 caracteres → aparece el mensaje de error en el DOM, no se crea la tarea.
3. Crear una tarea → presionar "Completar" → el ítem cambia de estilo (clase `completada`).

Estos tests simulan un usuario real: abren el navegador, hacen clic, leen el DOM.

### 6. Por qué integración ≠ E2E — la tabla verde/rojo

| Integración | E2E | Significado |
|---|---|---|
| 🟢 | 🟢 | Todo bien |
| 🟢 | 🔴 | El backend funciona, el frontend está roto (ej: botón con texto incorrecto) |
| 🔴 | 🔴 | El backend está caído, el frontend también falla en consecuencia |
| 🔴 | 🟢 | Improbable, pero podría pasar si E2E usa datos cacheados |

En nuestra rotura controlada (PR #34) cambiamos el texto del botón de `"Agregar Tarea"` a `"Crear Tarea"`. Los tests de integración dieron verde porque la API no cambió. Los E2E dieron rojo porque Playwright no encontró el botón. Eso demostró que las dos capas de tests son complementarias.

### 7. Integración amplia vs. estrecha

Usamos **integración amplia** (también llamada "social"): los tests de integración llaman a la API real ya desplegada en QA, con su base de datos de verdad. La alternativa estrecha ("solitary") levantaría un backend con BD mockeada localmente en CI.

- **Ventaja de la opción elegida:** simplicidad, no hay que arrancar servicios locales ni mockear nada.
- **Desventaja:** si la BD de QA tiene datos sucios o el servicio tiene cold start, el test puede fallar por razones ajenas al código.

### 8. Cold start y estrategia de espera

Los servicios de Render free tier se apagan tras 15 minutos sin tráfico. Para mitigarlo:

- El job `smoke` despierta explícitamente los servicios de QA antes de que corran los tests.
- Los tests E2E tienen timeout de 60 segundos por acción y 1 retry automático (`retries: 1` en `playwright.config.js`).

### 9. Misma imagen en QA y PROD del front

El frontend tiene una sola imagen (`ghcr.io/genacanas/ingsoft3-tp01-frontend:sha-...`). Lo que cambia entre QA y PROD es la variable de entorno `BACKEND_URL` que Nginx usa como proxy inverso: en QA apunta a `api-qa-h097.onrender.com` y en PROD a `api-prod-3ip5.onrender.com`. Así una sola imagen sirve para ambos entornos.

### 10. Servicios recreados como "Existing Image"

El free tier de Render eliminó los servicios originales del TP6 por inactividad. Al recrearlos, los creamos directamente como **Existing Image** porque la interfaz de Render no permite cambiar el tipo de fuente de un servicio existente una vez creado. Las nuevas URLs se cargaron en los Secrets de GitHub (`RENDER_HOOK_FRONT_QA`, etc.).

### 11. Límite conocido: QA compartido entre corridas

Si dos Pull Requests se mergean casi al mismo tiempo, sus pipelines pueden correr en paralelo. Ambos deploys apuntan al mismo servicio QA, así que los tests de la corrida A podrían ejecutarse sobre la imagen de la corrida B (o viceversa). Este problema se llama *race condition en el entorno compartido* y la solución habitual es usar entornos efímeros por rama (deploy-per-PR), que no tenemos en el free tier.

### Declaración de IA
Se utilizó Antigravity AI para diseñar la estrategia de tests de integración y E2E, configurar el pipeline completo (incluyendo el job de rotura controlada), debuggear el error de `API_URL` hardcodeada en `localhost`, y redactar esta sección de decisiones.
