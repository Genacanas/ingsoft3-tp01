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
- **Backend:** Se extrajo a backend/logica.py la función calcular_vencimiento y validar_titulo. Se mockeó NotificadorEmail mediante el inyector ServicioDeTareas. Elegí esta lógica porque el SLA es el núcleo de este sistema.
- **Frontend:** Se separó la lógica a frontend/src/lib/tareas.js. Se mockeó la función fetch que trae datos de la API.

### 2. Umbral de Cobertura (Coverage)
- **Umbral:** Se fijó en **80%** sobre la métrica de líneas y ramas.
- **¿Por qué 80%?:** El backend alcanzó 86% y el frontend 83% tras escribir los tests básicos. 80% nos da un margen realista sin ser excesivamente restrictivo.
- **Exclusiones:** En backend, se corren tests sobre los módulos puros de lógica para evitar el arranque (FastAPI). En frontend, se utilizó include: ['src/lib/**'] para excluir la inyección al DOM.

### 3. El límite de la Cobertura (Coverage engañoso)
Una cobertura alta no garantiza la calidad. Por ejemplo, si en test_logica.py llamara a calcular_vencimiento() pero olvidara escribir los asserts, la cobertura sumaría porcentaje, pero el test no habría verificado absolutamente nada.

### 4. Refactorización para Mockear
- **Backend:** En lugar de instanciar NotificadorEmail internamente, se inyectó la dependencia en ServicioDeTareas.
- **Frontend:** En pendientesDe(prioridad, traer), se recibe la función traer por parámetro. Esto permitió inyectar un doble.

### 5. Pull Requests de Demostración
- **Corrida bloqueada por Coverage:** https://github.com/Genacanas/ingsoft3-tp01/actions/runs/35616042887/job/106386884911?pr=23
- **Primer Pull Request (Bloqueado y luego arreglado):** https://github.com/Genacanas/ingsoft3-tp01/pull/23
- **Segundo Pull Request (El que quedó rojo):** [Agregar link del PR 2 aquí]

### 6. Ejercicio de la Rama sin Cubrir
Durante la revisión local de la cobertura, se notó que en calcular_vencimiento la rama 'si no se envía ahora' no siempre era ejercitada. Se decidió testear inyectando el tiempo manualmente para garantizar determinismo (la rama quedó aceptada).

### 7. Declaración de Uso de IA
Se utilizó la IA generativa (Antigravity AI Assistant) para asistir durante la configuración del workflow ci.yml, setup inicial de vitest y pytest, y reestructurar la lógica de negocio.
