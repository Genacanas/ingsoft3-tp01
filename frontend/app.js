// URL base de la API FastAPI
const API_URL = 'http://localhost:8080/api/tareas';

// Referencias a elementos del DOM
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const loadingEl = document.getElementById('loading');

// Almacenar las tareas en memoria para poder editarlas sin volver a consultar al servidor
let currentTasks = [];

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchTasks);

// Manejar el envío del formulario para crear tareas
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    
    if (!titulo) return; // Validación básica
    
    // Deshabilitar botón temporalmente para evitar doble envío
    const submitBtn = taskForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Agregando...';

    await createTask({ titulo, descripcion: descripcion || null });
    
    taskForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Agregar Tarea';
});

// Cargar tareas desde el backend REST
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error de red o del servidor');
        
        const tasks = await response.json();
        currentTasks = tasks;
        renderTasks(tasks);
    } catch (error) {
        console.error('Error al cargar:', error);
        showError('No se pudo conectar con el backend. Asegúrate de ejecutar FastAPI.');
    }
}

// Crear una nueva tarea mediante POST
async function createTask(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        
        if (!response.ok) throw new Error('Error al crear');
        
        // Refrescar la lista
        fetchTasks();
    } catch (error) {
        console.error('Error al crear:', error);
        alert('Hubo un error al crear la tarea. Verifica la conexión.');
    }
}

// Alternar estado (Completar/Deshacer) mediante PUT
async function toggleTaskComplete(id, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completada: !currentStatus }),
        });
        
        if (!response.ok) throw new Error('Error al actualizar');
        
        fetchTasks(); // Podríamos actualizar el DOM directamente para mejor rendimiento, pero refrescar garantiza consistencia.
    } catch (error) {
        console.error('Error al actualizar:', error);
        alert('Hubo un error al actualizar la tarea.');
    }
}

// Editar título y descripción de la tarea
async function editTask(id) {
    const task = currentTasks.find(t => t.id === id);
    if (!task) return;
    
    const newTitle = prompt('Editar título:', task.titulo);
    if (newTitle === null) return; // Cancelado por el usuario
    
    const newDesc = prompt('Editar descripción:', task.descripcion || '');
    if (newDesc === null) return; // Cancelado
    
    if (!newTitle.trim()) {
        alert('El título no puede estar vacío');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                titulo: newTitle.trim(), 
                descripcion: newDesc.trim() || null 
            }),
        });
        
        if (!response.ok) throw new Error('Error al actualizar');
        fetchTasks();
    } catch (error) {
        console.error('Error al editar:', error);
        alert('Hubo un error al editar la tarea.');
    }
}

// Eliminar tarea mediante DELETE
async function deleteTask(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea permanentemente?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Error al eliminar');
        
        fetchTasks();
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Hubo un error al eliminar la tarea.');
    }
}

// Renderizar la lista de tareas en el HTML
function renderTasks(tasks) {
    loadingEl.style.display = 'none';
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state">No hay tareas pendientes. ¡Empieza creando una!</p>';
        return;
    }
    
    // Ordenar tareas: Incompletas primero, luego ordenadas por fecha de creación descendente
    tasks.sort((a, b) => {
        if (a.completada === b.completada) {
            return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
        }
        return a.completada ? 1 : -1;
    });

    tasks.forEach(task => {
        // Formatear la fecha
        const dateObj = new Date(task.fecha_creacion);
        const dateStr = dateObj.toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute:'2-digit'
        });
        
        const li = document.createElement('li');
        li.className = `task-item ${task.completada ? 'completed' : ''}`;
        
        // Uso de escapeHTML para evitar inyección de código (XSS)
        li.innerHTML = `
            <div class="task-content">
                <div class="task-title">${escapeHTML(task.titulo)}</div>
                ${task.descripcion ? `<div class="task-desc">${escapeHTML(task.descripcion)}</div>` : ''}
                <span class="task-date">Registrada: ${dateStr}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">
                    Editar
                </button>
                <button class="btn btn-sm btn-${task.completada ? 'primary' : 'success'}" 
                        onclick="toggleTaskComplete(${task.id}, ${task.completada})">
                    ${task.completada ? 'Deshacer' : 'Completar'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                    Eliminar
                </button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

function showError(message) {
    loadingEl.className = 'error-state';
    loadingEl.textContent = message;
    loadingEl.style.display = 'block';
}

// Utilidad para limpiar strings y prevenir XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
