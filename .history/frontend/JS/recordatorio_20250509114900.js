document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios'; // ✅ Puerto correcto
    const usuario_id = 1;
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', cargarRecordatoriosDesdeBackend);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    // ✅ Función para cargar recordatorios desde el backend
    function cargarRecordatoriosDesdeBackend() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                console.log('📄 Recordatorios cargados desde el backend:', data);
                recordatorios = data.filter(r => r.usuario_id === usuario_id);
                localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
                renderizarListaRecordatorios();
            })
            .catch(error => console.error('❌ Error al obtener los recordatorios:', error));
    }

    // ✅ Función para agregar un nuevo recordatorio
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
                console.log('✅ Creado en backend:', data);
                alert('✅ Recordatorio agregado correctamente.');
                cargarRecordatoriosDesdeBackend(); // ✅ Forzar actualización después de agregar
            })
            .catch(error => {
                console.error('❌ Error al guardar en el servidor:', error);
                alert('❌ Error al guardar el recordatorio en el servidor.');
            });

        } else {
            alert('⚠️ Por favor, completa todos los campos.');
        }
    }

    // ✅ Función para renderizar la lista de recordatorios en la interfaz
    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = '';

        if (!recordatorios.length) {
            lista.innerHTML = '<li>No hay recordatorios</li>';
            return;
        }

        recordatorios.forEach((rec, index) => {
            console.log(`🔎 Verificando recordatorio: ${rec.titulo}`);

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
            btn.removeEventListener('click', eliminarRecordatorio);
            btn.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                const recordatorio = recordatorios[index];
                eliminarRecordatorio(recordatorio);
            });
        });

        console.log("✅ Lista de recordatorios renderizada con éxito.");
    }

    // ✅ Función para eliminar un recordatorio
    function eliminarRecordatorio(recordatorio) {
        console.log(`🗑️ Eliminando recordatorio:`, recordatorio);

        fetch(API_URL, { 
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

            // ✅ Eliminar de la lista local y actualizar el almacenamiento
            recordatorios = recordatorios.filter(r => r.titulo !== recordatorio.titulo || r.fecha !== recordatorio.fecha);
            localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
            renderizarListaRecordatorios();
        })
        .catch(error => console.error('❌ Error al eliminar:', error));
    }

    // ✅ Función para eliminar todos los recordatorios
    function eliminarTodosLosRecordatorios() {
        if (recordatorios.length === 0) {
            alert("⚠️ No hay recordatorios para eliminar.");
            return;
        }

        if (confirm("🚮 ¿Deseas eliminar todos los recordatorios?")) {
            fetch(`${API_URL}/usuario`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id })
            })
            .then(res => res.json())
            .then(data => {
                console.log('✅ Todos eliminados en el backend:', data);
                alert('🗑️ Todos los recordatorios eliminados.');

                recordatorios = [];
                localStorage.removeItem('recordatorios');
                renderizarListaRecordatorios();
            })
            .catch(error => console.error('❌ Error al eliminar todos:', error));
        }
    }

    // ✅ Cargar los recordatorios al iniciar
    cargarRecordatoriosDesdeBackend();
});
