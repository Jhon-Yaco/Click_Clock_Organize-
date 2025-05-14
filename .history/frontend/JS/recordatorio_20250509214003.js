document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', cargarRecordatoriosDesdeBackend);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    function renderizarListaRecordatorios() {
        const listaElement = document.getElementById('lista-recordatorios');

        if (!listaElement) {
            console.error("❌ Error: No se encontró 'lista-recordatorios' en el HTML.");
            return;
        }

        listaElement.innerHTML = "";

        if (recordatorios.length === 0) {
            listaElement.innerHTML = "<li>No hay recordatorios</li>";
            return;
        }

        recordatorios.forEach((recordatorio, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${recordatorio.titulo} - ${new Date(recordatorio.fecha).toLocaleString()}
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            listaElement.appendChild(li);
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
                recordatorios = data.filter(r => r.usuario_id === usuario_id).map(r => ({ ...r, mostrado: false }));
                renderizarListaRecordatorios();
            })
            .catch(error => console.error('❌ Error al obtener los recordatorios:', error));
    }

    function reproducirSonido() {
        const audio = new Audio('../sounds/alarma.mp3'); // ✅ Reproduce sonido al activarse
        audio.play();
    }

    setInterval(() => {
        const ahora = new Date();

        recordatorios.forEach(rec => {
            const fechaRec = new Date(rec.fecha);
            const diferencia = Math.abs(ahora - fechaRec);

            if (diferencia <= 3000 && !rec.mostrado) {
                alert(`🔔 Recordatorio: ${rec.titulo}`);
                reproducirSonido();
                rec.mostrado = true;
            }
        });
    }, 3000);
    
    cargarRecordatoriosDesdeBackend();
});
