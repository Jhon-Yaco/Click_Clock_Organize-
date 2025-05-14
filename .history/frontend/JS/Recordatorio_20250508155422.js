document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];
    const audio = new Audio("/frontend/sonidos/Recordatorio.mp3");

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', verRecordatorios);
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

    function verRecordatorios() {
        console.log("🔄 Actualizando lista de recordatorios...");
        cargarRecordatoriosDesdeBackend(() => {
            renderizarListaRecordatorios();
            document.getElementById('lista-recordatorios').style.display = "block";
        });
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
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            lista.appendChild(li);
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function () {
                eliminarRecordatorio(recordatorios[this.getAttribute('data-index')]);
            });
        });
    }

    function verificarRecordatorios() {
        const ahora = new Date().toISOString().slice(0, 16);

        recordatorios.forEach(rec => {
            if (rec.fecha.slice(0, 16) === ahora) {
                audio.play();
                alert(`🔔 Recordatorio: ${rec.titulo}`);
                eliminarRecordatorio(rec);
            }
        });
    }

    verRecordatorios();
    setInterval(verificarRecordatorios, 60000);
});
