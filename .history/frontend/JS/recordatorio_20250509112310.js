document.addEventListener('DOMContentLoaded', function () {
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    const usuario_id = 1;
    const API_URL = 'http://localhost:5000/api/recordatorios'; // ⚠️ Se ajustó el puerto

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', verRecordatorios);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

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
                verRecordatorios();
            })
            .catch(error => {
                console.error('❌ Error al guardar en el servidor:', error);
                alert('❌ Error al guardar el recordatorio en el servidor.');
            });

        } else {
            alert('⚠️ Por favor, completa todos los campos.');
        }
    }

    function verRecordatorios() {
        fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            console.log('📄 Recordatorios desde el backend:', data);
        })
        .catch(error => console.error('❌ Error al obtener los recordatorios:', error));
    }

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
            })
            .catch(error => console.error('❌ Error al eliminar todos:', error));
        }
    }
});
