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
                recordatorios = data.filter(r => r.usuario_id === usuario_id); // Filtrar por usuario
                console.log("📄 Recordatorios cargados:", recordatorios);
                if (callback) callback(); // 🔄 Ejecutar callback si existe
            })
            .catch(error => console.error('❌ Error al obtener recordatorios:', error));
    }

    function verRecordatorios() {
        console.log("🔄 Actualizando lista de recordatorios...");
        cargarRecordatoriosDesdeBackend(() => {
            renderizarListaRecordatorios(); // 🖥️ Se asegura de mostrar los recordatorios en la interfaz
        });
    }

    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = ''; // 🔄 Limpia antes de insertar nuevos elementos

        if (!recordatorios || recordatorios.length === 0) {
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
                    verRecordatorios();
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
                verRecordatorios();
            })
            .catch(error => console.error('❌ Error al eliminar:', error));
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
                    recordatorios = []; // 🔄 Limpia la lista localmente
                    renderizarListaRecordatorios(); // 🖥️ Refresca la interfaz
                })
                .catch(error => console.error('❌ Error al eliminar todos:', error));
        }
    }

    function verificarRecordatorios() {
        const ahora = new Date();
        const actualISO = ahora.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

        recordatorios.forEach(rec => {
            const fechaRec = rec.fecha.slice(0, 16); // Asegurar mismo formato
            if (fechaRec === actualISO) {
                audio.play();
                alert(`🔔 Recordatorio: ${rec.titulo}`);
                eliminarRecordatorio(rec);
            }
        });
    }

    verRecordatorios(); // ⚠️ Ahora carga y muestra los recordatorios al iniciar
    setInterval(verificarRecordatorios, 60000); // cada 60 segundos
});
