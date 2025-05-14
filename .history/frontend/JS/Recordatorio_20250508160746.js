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
            document.getElementById('lista-recordatorios').style.display = "block"; // ✅ Asegurar que la lista se haga visible
        });
    }

    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        
        // 🔍 Verificar si el elemento existe
        if (!lista) {
            console.error('❌ No se encontró el elemento con id "lista-recordatorios". Revisa el HTML.');
            return;
        }
        
        lista.innerHTML = ''; // 🔄 Limpiar antes de insertar nuevos elementos

        if (!recordatorios.length) {
            lista.innerHTML = '<li>No hay recordatorios</li>';
            return;
        }

        recordatorios.forEach((rec, index) => {
            console.log("📝 Procesando recordatorio:", rec); // ✅ Verificar si los datos son correctos

            let fechaHora = new Date(rec.fecha);
            if (isNaN(fechaHora.getTime())) {
                console.error("❌ Error con formato de fecha, revisa el backend:", rec.fecha);
                return;
            }

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
                    recordatorios = [];
                    renderizarListaRecordatorios();
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
                eliminarRecordatorio(rec);
            }
        });
    }

    verRecordatorios();
    setInterval(verificarRecordatorios, 60000);
});
