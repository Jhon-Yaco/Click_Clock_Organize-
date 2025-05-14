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

    function eliminarRecordatorio(recordatorioId) {
        fetch(`${API_URL}/${recordatorioId}`, { // ✅ Ahora el ID se envía en la URL correctamente
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            console.log(`🗑️ Recordatorio eliminado del backend:`, data);
            cargarRecordatoriosDesdeBackend(() => renderizarListaRecordatorios()); // ✅ Recargar lista desde el backend
        })
        .catch(error => console.error('❌ Error al eliminar:', error));
    }

    toggleListaRecordatorios();
});
