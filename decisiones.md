decisiones.md — tres cosas, cortas y honestas:

Por qué Git no pudo resolver el conflicto solo — y qué habría tenido que pasar para que nunca apareciera.
Qué problemas encontraste y cómo los solucionaste. Los tropiezos bien contados valen más que un camino perfecto: son los que demuestran que entendiste.
Declaración de uso de IA: qué partes hiciste con ayuda de inteligencia artificial y cómo verificaste lo que te devolvió (§ Uso de IA del enunciado


## Por qué Git no pudo resolver el conflicto solo
Ya que hubo dos cambios en el codigo en la misma linea de codigo. Para que no aparecieran, se podria esperar a que se suba el cambio de la version A, el editor B hacer el pull y recien ahi hacer sus cambios y pushearlos.

## Qué problemas encontraste y cómo los solucionaste
No tuve problemas en si, mas de los esperados.

## Declaración de uso de IA
No se utilizo la IA, solo utilce la guia .md y el video con la voz del profe.


## TP2 — Contenedores

### 1. Elección de la app del semestre
- **Aplicación:** Gestor de Tareas (To-Do List).
- **Backend:** Python con FastAPI.
- **Frontend:** HTML/JS / React.
- **Base de Datos:** PostgreSQL.
- **Justificación:** Cumple con los requisitos mínimos de backend + frontend + BD. Es un sistema ligero, fácil de mantener y probar.

## Declaración de uso de IA
Se utilizo la IA para ayudarme a entender conceptos y comandos a lo largo del tp, ademas de decirme que dependencias e imagenes de mis tecnologias debia utilizar en los Dockerfile. Tambien ayudo a redactar el README.md


## TP03 — Planificación y Trazabilidad

### 1. Duración del Sprint
Se fijó una duración de **2 semanas**. Se eligió este período para alinear las iteraciones con el calendario oficial de entregas del aula virtual, manteniendo un ritmo constante de entregas cortas de valor.

### 2. Límite de Trabajo en Progreso (WIP Limit)
Se estableció un límite de **2 tarjetas** en la columna *In Progress*. Siguiendo la regla para trabajo individual ($1 \text{ persona} + 1$), el margen de 2 permite trabajar en un ítem sin acumular tareas a medio hacer, dejando una válvula de escape si un trabajo queda bloqueado esperando revisión.

### 3. Diagnóstico de la Historia Mal Escrita
- **Por qué está mal:** La consigna *"Como desarrollador quiero crear la tabla usuarios"* es una **tarea técnica disfrazada**. No entrega un incremento de valor observable por un usuario final ni justifica el beneficio real del requerimiento.
- **Cómo la reescribiría:** *"Como usuario registrado quiero iniciar sesión con credenciales para acceder a mi panel personal de tareas."*

### 4. Problemas Encontrados y Soluciones
- Se optó por la gestión visual mediante la interfaz web de GitHub Projects para asegurar la correcta vinculación de jerarquías (sub-issues) y evitar conflictos de autenticación con CLI en entornos locales.

### 5. Declaración de Uso de IA
Se utilizó IA como asistente conceptual para la estructuración de la jerarquía (Épica -> Historia -> Tareas), la redacción del archivo `.github/workflows/ci.yml` y la articulación de las justificaciones ágiles para la defensa oral.