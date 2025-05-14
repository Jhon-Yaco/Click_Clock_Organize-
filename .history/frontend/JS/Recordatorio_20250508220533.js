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
                lista.style.display = "block";
            });
        } else {
            lista.style.display = "none";
        }
    }

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
                <button class="btn-eliminar" data-index="${recordatorios.indexOf(rec)}">Eliminar</button>
            `;
            lista.appendChild(li);
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                eliminarRecordatorio(recordatorios[index]);
            });
        });

        console.log("✅ Lista de recordatorios renderizada con éxito.");
    }

    function eliminarRecordatorio(recordatorio) {
        console.log(`🗑️ Intentando eliminar recordatorio:`, recordatorio);

        fetch(`${API_URL}`, { // ✅ Eliminación por título y fecha
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: recordatorio.titulo,
                fecha: recordatorio.fecha
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(`🗑️ Recordatorio eliminado del backend:`, data);
            cargarRecordatoriosDesdeBackend(() => renderizarListaRecordatorios());
        })
        .catch(error => console.error(error));
    }

    toggleListaRecordatorios();
});
