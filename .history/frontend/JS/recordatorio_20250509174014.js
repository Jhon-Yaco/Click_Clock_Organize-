document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', cargarRecordatoriosDesdeBackend);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        if (!lista) {
            console.error('❌ Error: Elemento lista-recordatorios no encontrado.');
            return;
        }

        lista.innerHTML = '';

        if (recordatorios.length === 0) {
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
                const index = this.getAttribute('data-index');
                eliminarRecordatorio(recordatorios[index]);
            });
        });

        console.log("✅ Lista de recordatorios renderizada correctamente.");
    }

    function cargarRecordatoriosDesdeBackend() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                recordatorios = data.filter(r => r.usuario_id === usuario_id);
                renderizarListaRecordatorios();
            })
            .catch(error => console.error('❌ Error al obtener los recordatorios:', error));
    }

    cargarRecordatoriosDesdeBackend();
});
