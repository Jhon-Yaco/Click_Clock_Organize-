document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];
    const audio = new Audio("/frontend/sonidos/Recordatorio.mp3");

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', toggleListaRecordatorios);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

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

    function toggleListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');

        if (lista.style.display === "none" || lista.style.display === "") {
            cargarRecordatoriosDesdeBackend(() => {
                renderizarListaRecordatorios();
                lista.style.display = "block"; // ✅ Mostrar la lista
            });
        } else {
            lista.style.display = "none"; // ✅ Ocultar la lista si ya está visible
        }
    }

    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = '';

        if (!recordatorios.length) {
            lista.innerHTML = '<li>No hay recordatorios</li>';
            return;
        }

        recordatorios.forEach((rec, index) => {
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
                toggleListaRecordatorios();
            })
            .catch(error => {
                console.error('❌ Error al guardar:', error);
                alert('❌ Error al guardar el recordatorio.');
            });
        } else {
            alert('⚠️ Completa todos los campos.');
        }
    }
    function eliminarRecordatorio(recordatorioId) {
        fetch(`${API_URL}/${recordatorioId}`, { // ✅ Ahora el ID se envía en la URL correctamente
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`❌ Error al eliminar: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            console.log(`🗑️ Recordatorio eliminado del backend:`, data);
            cargarRecordatoriosDesdeBackend(() => renderizarListaRecordatorios()); // ✅ Recargar lista desde el backend
        })
        .catch(error => console.error(error));
    }
    
    
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

    function verificarRecordatorios() {
        const ahora = new Date().toISOString().slice(0, 16);

        recordatorios.forEach(rec => {
            if (rec.fecha.slice(0, 16) === ahora) {
                audio.play();
                alert(`🔔 Recordatorio: ${rec.titulo}`);
                eliminarRecordatorio(rec.id);
            }
        });
    }

    toggleListaRecordatorios();
    setInterval(verificarRecordatorios, 60000);
});
