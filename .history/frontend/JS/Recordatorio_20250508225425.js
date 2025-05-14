document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];
    const audio = new Audio("/frontend/sonidos/Recordatorio.mp3");

    // ✅ Función para cargar recordatorios desde el backend
    function cargarRecordatoriosDesdeBackend(callback) {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                recordatorios = data.filter(r => r.usuario_id === usuario_id);
                console.log("📄 Recordatorios cargados:", recordatorios);
                if (callback) callback();
            })
            .catch(error => console.error('❌ Error al obtener recordatorios:', error));
    }

    // ✅ Función para alternar la lista de recordatorios
    function toggleListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');

        if (!lista) {
            console.error('❌ Elemento "lista-recordatorios" no encontrado.');
            return;
        }

        if (lista.style.display === "none" || lista.style.display === "") {
            cargarRecordatoriosDesdeBackend(() => {
                renderizarListaRecordatorios();
                lista.style.display = "block";
            });
        } else {
            lista.style.display = "none";
        }
    }

    // ✅ Función para renderizar la lista de recordatorios en la interfaz
    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = '';

        if (!recordatorios.length) {
            lista.innerHTML = '<li>No hay recordatorios</li>';
            return;
        }

        recordatorios.forEach((rec) => {
            console.log(`🔎 Verificando recordatorio ID: ${rec.id} - ${rec.titulo}`);

            const fechaHora = new Date(rec.fecha);
            const fechaStr = fechaHora.toLocaleDateString();
            const horaStr = fechaHora.toTimeString().substring(0, 5);

            const li = document.createElement('li');
            li.innerHTML = `
                ${rec.titulo} - ${fechaStr} ${horaStr}
                <button class="btn-eliminar" data-id="${rec.id}">Eliminar</button>
            `;
            lista.appendChild(li);
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function () {
                const recordatorioId = this.getAttribute('data-id');
                eliminarRecordatorio(recordatorioId);
            });
        });

        console.log("✅ Lista de recordatorios renderizada con éxito.");
    }

    // ✅ Función para agregar un nuevo recordatorio
    function agregarRecordatorio() {
        const mensaje = document.getElementById('mensaje-recordatorio').value.trim();
        const fecha = document.getElementById('fecha-recordatorio').value;
        const hora = document.getElementById('hora-recordatorio').value;

        if (mensaje && fecha && hora) {
            const fechaCompleta = `${fecha}T${hora}`;

            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id,
                    titulo: mensaje,
                    descripcion: "",
                    fecha: fechaCompleta
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log('✅ Recordatorio creado:', data);
                alert('✅ Recordatorio agregado.');
                document.getElementById('mensaje-recordatorio').value = '';
                cargarRecordatoriosDesdeBackend(() => renderizarListaRecordatorios());
            })
            .catch(error => {
                console.error('❌ Error al guardar:', error);
                alert('❌ Error al guardar el recordatorio.');
            });
        } else {
            alert('⚠️ Completa todos los campos.');
        }
    }

    // ✅ Función para eliminar un recordatorio
    function eliminarRecordatorio(recordatorioId) {
        console.log(`🗑️ Intentando eliminar recordatorio con ID: ${recordatorioId}`);
    
        fetch(`${API_URL}/${recordatorioId}`, { 
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) {
                console.error(`❌ Error al eliminar recordatorio: ${res.status} ${res.statusText}`);
                return res.json().catch(() => ({
                    mensaje: "❌ Error al eliminar. La respuesta del servidor no es válida."
                }));
            }
            return res.json();
        })
        .then(data => {
            console.log(`🗑️ Recordatorio eliminado del backend:`, data);
            cargarRecordatoriosDesdeBackend(() => renderizarListaRecordatorios());
        })
        .catch(error => console.error('❌ Error de red o JSON inválido:', error));
    }
    

    // ✅ Función para eliminar todos los recordatorios
    function eliminarTodosLosRecordatorios() {
        if (confirm("🚮 ¿Eliminar todos los recordatorios?")) {
            fetch(`${API_URL}/usuario`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id })
            })
            .then(res => res.json())
            .then(data => {
                console.log('✅ Todos eliminados:', data);
                cargarRecordatoriosDesdeBackend(() => renderizarListaRecordatorios());
            })
            .catch(error => console.error('❌ Error al eliminar todos:', error));
        }
    }

    // ✅ Vincular eventos a los botones después de definir las funciones
    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', toggleListaRecordatorios);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    toggleListaRecordatorios();
});
