document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];

    // Verificación de carga del script
    console.log("✅ JS cargado correctamente");

    // Asignación de eventos a los botones
    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', cargarRecordatoriosDesdeBackend);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    // Función para renderizar la lista de recordatorios
    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        if (!lista) {
            console.error('❌ Error: No se encontró lista-recordatorios en el HTML.');
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

    // Función para cargar recordatorios desde el backend
    console.log('Entrando en cargarRecordatoriosDesdeBackend');
function cargarRecordatoriosDesdeBackend() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            console.log('Recordatorios cargados:', data);
            recordatorios = data
                .filter(r => r.usuario_id === usuario_id)
                .map(r => ({ ...r, mostrado: false }));
            console.log('Recordatorios filtrados:', recordatorios);
            renderizarListaRecordatorios();
            lista.style.display = 'block';
        })
        .catch(error => console.error('Error al obtener los recordatorios:', error));
}

    // Función para agregar un nuevo recordatorio
    function agregarRecordatorio() {
        const mensaje = document.getElementById('mensaje-recordatorio').value.trim();
        const fecha = document.getElementById('fecha-recordatorio').value;
        const hora = document.getElementById('hora-recordatorio').value;

        if (mensaje && fecha && hora) {
            const fechaCompleta = `${fecha}T${hora}`;

            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id, titulo: mensaje, descripcion: "", fecha: fechaCompleta })
            })
            .then(res => res.json())
            .then(data => {
                console.log('✅ Creado en backend:', data);
                alert('✅ Recordatorio agregado correctamente.');
                cargarRecordatoriosDesdeBackend();
            })
            .catch(error => {
                console.error('❌ Error al guardar en el servidor:', error);
                alert('❌ Error al guardar el recordatorio en el servidor.');
            });

        } else {
            alert('⚠️ Por favor, completa todos los campos.');
        }
    }

    // Función para eliminar un recordatorio específico
    function eliminarRecordatorio(recordatorio) {
        console.log(`🗑️ Eliminando recordatorio:`, recordatorio);

        fetch(API_URL, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, titulo: recordatorio.titulo, fecha: recordatorio.fecha })
        })
        .then(res => res.json())
        .then(() => cargarRecordatoriosDesdeBackend())
        .catch(error => console.error('❌ Error al eliminar:', error));
    }

    // Función para eliminar todos los recordatorios
    function eliminarTodosLosRecordatorios() {
        if (recordatorios.length === 0) {
            alert("⚠️ No hay recordatorios para eliminar.");
            return;
        }

        fetch(`${API_URL}/usuario`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id })
        })
        .then(res => res.json())
        .then(() => cargarRecordatoriosDesdeBackend())
        .catch(error => console.error('❌ Error al eliminar todos:', error));
    }

    // Cargar los recordatorios al iniciar
    cargarRecordatoriosDesdeBackend();

    // Verificar y activar recordatorios automáticamente cada 3 segundos
    setInterval(() => {
        const ahora = new Date();

        recordatorios.forEach(rec => {
            const fechaRec = new Date(rec.fecha);
            const diferencia = Math.abs(ahora - fechaRec); // en milisegundos

            if (diferencia <= 3000 && !rec.mostrado) { // dentro de los 3 segundos
                alert(`🔔 Recordatorio: ${rec.titulo}`);
                rec.mostrado = true; // para no mostrarlo de nuevo
            }
        });
    }, 3000);
});
