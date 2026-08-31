// URL base de la API FastAPI
const API_URL = 'http://localhost:8080/api';

// Referencias a elementos del DOM
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const loadingEl = document.getElementById('loading');

// Elementos del dashboard
const dashboardEl = document.getElementById('dashboard');
const metricSlaEl = document.getElementById('metric-sla');
const metricTotalEl = document.getElementById('metric-total');
const metricTimesEl = document.getElementById('metric-times');

// Almacenar las tareas en memoria
let currentTasks = [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    fetchMetricas();
});

// Manejar el envío del formulario
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const prioridad = document.getElementById('prioridad').value;
    
    if (!titulo) return; 
    
    const submitBtn = taskForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Agregando...';

    await createTask({ titulo, descripcion: descripcion || null, prioridad });
    
    taskForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Agregar Tarea';
});

async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tareas`);
        if (!response.ok) throw new Error('Error de red o del servidor');
        
        const tasks = await response.json();
        currentTasks = tasks;
        renderTasks(tasks);
    } catch (error) {
        console.error('Error al cargar:', error);
        showError('No se pudo conectar con el backend.');
    }
}

async function fetchMetricas() {
    try {
        const response = await fetch(`${API_URL}/metricas`);
        if (!response.ok) return;
        
        const data = await response.json();
        
        if (data.total_completadas > 0) {
            dashboardEl.style.display = 'block';
            metricSlaEl.textContent = `${data.porcentaje_a_tiempo}%`;
            metricTotalEl.textContent = data.total_completadas;
            metricTimesEl.textContent = `Tiempos Promedio: Alta (${data.tiempo_promedio_resolucion_horas.alta}h) | Media (${data.tiempo_promedio_resolucion_horas.media}h) | Baja (${data.tiempo_promedio_resolucion_horas.baja}h)`;
        } else {
            dashboardEl.style.display = 'none';
        }
    } catch (error) {
        console.error('Error al cargar métricas:', error);
    }
}

async function createTask(taskData) {
    try {
        const response = await fetch(`${API_URL}/tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        
        if (!response.ok) throw new Error('Error al crear');
        fetchTasks();
        fetchMetricas();
    } catch (error) {
        alert('Hubo un error al crear la tarea.');
    }
}

async function toggleTaskComplete(id, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completada: !currentStatus }),
        });
        
        if (!response.ok) throw new Error('Error al actualizar');
        fetchTasks();
        fetchMetricas();
    } catch (error) {
        alert('Hubo un error al actualizar la tarea.');
    }
}

async function editTask(id) {
    const task = currentTasks.find(t => t.id === id);
    if (!task) return;
    
    const newTitle = prompt('Editar título:', task.titulo);
    if (newTitle === null) return;
    
    const newDesc = prompt('Editar descripción:', task.descripcion || '');
    if (newDesc === null) return;
    
    if (!newTitle.trim()) {
        alert('El título no puede estar vacío');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/tareas/${id}`, {
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
        alert('Hubo un error al editar la tarea.');
    }
}

async function deleteTask(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea permanentemente?')) return;
    
    try {
        const response = await fetch(`${API_URL}/tareas/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');
        fetchTasks();
        fetchMetricas();
    } catch (error) {
        alert('Hubo un error al eliminar la tarea.');
    }
}

function renderTasks(tasks) {
    loadingEl.style.display = 'none';
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state">No hay tareas pendientes. ¡Empieza creando una!</p>';
        return;
    }
    
    tasks.sort((a, b) => {
        if (a.completada === b.completada) {
            return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
        }
        return a.completada ? 1 : -1;
    });

    tasks.forEach(task => {
        const dateObj = new Date(task.fecha_creacion);
        const dateStr = dateObj.toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
        });
        
        let priorityLabel = 'Media';
        if (task.prioridad === 'alta') priorityLabel = 'Alta';
        if (task.prioridad === 'baja') priorityLabel = 'Baja';
        
        let slaBadge = '';
        if (task.completada && task.fecha_completada && task.fecha_vencimiento) {
            const isOk = new Date(task.fecha_completada) <= new Date(task.fecha_vencimiento);
            if (isOk) {
                slaBadge = `<span class="badge badge-sla badge-sla-ok">✓ SLA A Tiempo</span>`;
            } else {
                slaBadge = `<span class="badge badge-sla badge-sla-fail">✗ SLA Vencido</span>`;
            }
        } else if (!task.completada && task.fecha_vencimiento) {
            const isLate = new Date() > new Date(task.fecha_vencimiento);
            if (isLate) {
                slaBadge = `<span class="badge badge-sla badge-sla-fail">✗ Vencida</span>`;
            }
        }
        
        const li = document.createElement('li');
        li.className = `task-item ${task.completada ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content">
                <div>
                    <span class="badge badge-${task.prioridad}">${priorityLabel}</span>
                    ${slaBadge}
                </div>
                <div class="task-title" style="margin-top: 0.5rem;">${escapeHTML(task.titulo)}</div>
                ${task.descripcion ? `<div class="task-desc">${escapeHTML(task.descripcion)}</div>` : ''}
                <span class="task-date">Registrada: ${dateStr}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">Editar</button>
                <button class="btn btn-sm btn-${task.completada ? 'primary' : 'success'}" 
                        onclick="toggleTaskComplete(${task.id}, ${task.completada})">
                    ${task.completada ? 'Deshacer' : 'Completar'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Eliminar</button>
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

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
