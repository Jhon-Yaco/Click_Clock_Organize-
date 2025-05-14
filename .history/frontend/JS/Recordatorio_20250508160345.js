document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];
    const audio = new Audio("/frontend/sonidos/Recordatorio.mp3");

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', cargarRecordatoriosDesdeBackend);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    function cargarRecordatoriosDesdeBackend() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                recordatorios = data.filter(r => r.usuario_id === usuario_id);
                console.log("📄 Recordatorios cargados:", recordatorios);
                renderizarListaRecordatorios();
            })
            .catch(error => console.error('❌ Error al obtener recordatorios:', error));
    }

    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = '';

        if (recordatorios.length === 0) {
            lista.innerHTML = '<li>No hay recordatorios</li>';
            return;
        }

        recordatorios.forEach((rec, index) => {
            const fechaHora = new Date(rec.fecha);
            const fechaStr = fechaHora.toLocaleDateString();
            const horaStr = fechaHora.toTimeString().substring(0, 5); // HH:MM

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
                    cargarRecordatoriosDesdeBackend();
                })
                .catch(error => {
                    console.error('❌ Error al guardar:', error);
                    alert('❌ Error al guardar el recordatorio.');
                });
        } else {
            alert('⚠️ Completa todos los campos.');
        }
    }

    function eliminarRecordatorio(recordatorio) {
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id,
                titulo: recordatorio.titulo,
                fecha: recordatorio.fecha
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log('🗑️ Eliminado:', data);
                alert('🗑️ Recordatorio eliminado.');
                cargarRecordatoriosDesdeBackend();
            })
            .catch(error => {
                console.error('❌ Error al eliminar:', error);
            });
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
                    recordatorios = [];
                    renderizarListaRecordatorios();
                })
                .catch(error => console.error('❌ Error al eliminar todos:', error));
        }
    }

    function verificarRecordatorios() {
        const ahora = new Date();
        const actualISO = ahora.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

        recordatorios.forEach(rec => {
            const fechaRec = rec.fecha.slice(0, 16);
            if (fechaRec === actualISO) {
                audio.play();
                alert(`🔔 Recordatorio: ${rec.titulo}`);
                eliminarRecordatorio(rec);
            }
        });
    }

    cargarRecordatoriosDesdeBackend();
    setInterval(verificarRecordatorios, 60000);
});
