document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];
    const audio = new Audio("/frontend/sonidos/Recordatorio.mp3");

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', verRecordatorios);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    function cargarRecordatoriosDesdeBackend() {
        fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            recordatorios = data; // 🔄 Guarda los recordatorios obtenidos del backend
            console.log("📄 Recordatorios cargados desde MySQL:", recordatorios);
        })
        .catch(error => console.error('❌ Error al obtener los recordatorios:', error));
    }

    function agregarRecordatorio() {
        const mensaje = document.getElementById('mensaje-recordatorio').value;
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
                console.log('✅ Creado en backend:', data);
                alert('Recordatorio agregado correctamente.');
                cargarRecordatoriosDesdeBackend(); // 🔄 Refresca los recordatorios
            })
            .catch(error => {
                console.error('❌ Error al guardar en el servidor:', error);
                alert('❌ Error al guardar el recordatorio.');
            });
        } else {
            alert('⚠️ Completa todos los campos.');
        }
    }

    function verRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = '';

        if (recordatorios.length === 0) {
            lista.innerHTML = '<li>No hay recordatorios</li>';
        } else {
            recordatorios.forEach((rec, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${rec.titulo} - ${rec.fecha} 
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

        lista.style.display = 'block';
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
            console.log('🗑️ Recordatorio eliminado en backend:', data);
            alert('Recordatorio eliminado correctamente.');
            cargarRecordatoriosDesdeBackend();
        })
        .catch(error => console.error('❌ Error al eliminar en el servidor:', error));
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
                console.log('✅ Todos eliminados en el backend:', data);
                alert('🗑️ Todos los recordatorios eliminados.');
                cargarRecordatoriosDesdeBackend();
            })
            .catch(error => console.error('❌ Error al eliminar todos:', error));
        }
    }

    function verificarRecordatorios() {
        const ahora = new Date();
        const fechaActual = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');

        recordatorios.forEach((rec) => {
            if (rec.fecha.split('T')[0] === fechaActual && rec.fecha.split('T')[1].substring(0,5) === horaActual) {
                audio.play();
                alert(`¡Recordatorio activado! ${rec.titulo}`);
                eliminarRecordatorio(rec);
            }
        });
    }

    cargarRecordatoriosDesdeBackend(); // ⚠️ Carga recordatorios desde la base de datos al inicio
    setInterval(verificarRecordatorios, 60000); // Verificar cada minuto
});
