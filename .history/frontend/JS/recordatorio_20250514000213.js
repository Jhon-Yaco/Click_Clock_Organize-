document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];

    // ✅ Función para cargar recordatorios desde el backend
    function cargarRecordatoriosDesdeBackend() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                recordatorios = data.filter(r => r.usuario_id === usuario_id);
                renderizarListaRecordatorios();
            })
            .catch(error => console.error('❌ Error al obtener los recordatorios:', error));
    }

    // ✅ Función para renderizar la lista de recordatorios
    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');

        if (!lista) {
            console.error("❌ Error: No se encontró 'lista-recordatorios' en el HTML.");
            return;
        }

        lista.innerHTML = '';

        if (recordatorios.length === 0) {
            lista.innerHTML = '<li>No hay recordatorios</li>';
        } else {
            recordatorios.forEach((rec, index) => {
                const fechaHora = new Date(rec.fecha);
                const fechaStr = fechaHora.toLocaleDateString();
                const horaStr = fechaHora.toTimeString().substring(0, 5);

                const li = document.createElement('li');
                li.innerHTML = `
                    ${rec.titulo} - ${fechaStr} ${horaStr}
                    <button class="btn-eliminar" data-id="${rec.id}">Eliminar</button>
                `;
                lista.appendChild(li);

                li.querySelector('.btn-eliminar').addEventListener('click', function () {
                    eliminarRecordatorio(rec.id);
                });
            });
        }

        console.log("✅ Lista de recordatorios renderizada correctamente.");
    }

    // ✅ Función para reproducir sonido cuando se activa un recordatorio
    function reproducirSonido() {
        const audio = new Audio('/frontend/sonidos/Recordatorio.mp3'); // ⚡ Asegúrate de que la ruta es correcta
        audio.load(); // Precarga el sonido antes de reproducir
        audio.play().catch(error => console.error('❌ Error al reproducir sonido:', error));
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

    // ✅ Función para eliminar un recordatorio específico
    function eliminarRecordatorio(recordatorioId) {
        console.log(`🗑️ Eliminando recordatorio con ID:`, recordatorioId);

        fetch(`${API_URL}/${recordatorioId}`, { // ✅ Se usa el ID del recordatorio
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(() => {
            recordatorios = recordatorios.filter(r => r.id !== recordatorioId); // ✅ Lo elimina de la lista local
            renderizarListaRecordatorios(); // ✅ Refresca la interfaz
        })
        .catch(error => console.error('❌ Error al eliminar:', error));
    }

    // ✅ Asignación de eventos a los botones
    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', function () {
        const lista = document.getElementById('lista-recordatorios');
        if (lista.style.display === "none") {
            cargarRecordatoriosDesdeBackend();
            lista.style.display = "block"; // ✅ Muestra la lista
        } else {
            lista.style.display = "none"; // ✅ Oculta la lista si ya está visible
        }
    });

    // ✅ Inicialmente oculta la lista de recordatorios
    document.getElementById('lista-recordatorios').style.display = "none";

    // ✅ Cargar los recordatorios al iniciar
    cargarRecordatoriosDesdeBackend();
});
