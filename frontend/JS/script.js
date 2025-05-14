document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', cargarRecordatoriosDesdeBackend);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    function cargarRecordatoriosDesdeBackend() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                recordatorios = data.filter(r => r.usuario_id === usuario_id);
                localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
                renderizarListaRecordatorios();
            })
            .catch(error => console.error('❌ Error al obtener los recordatorios:', error));
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
                body: JSON.stringify({ usuario_id, titulo: mensaje, descripcion: "", fecha: fechaCompleta })
            })
            .then(res => res.json())
            .then(() => {
                alert('✅ Recordatorio agregado correctamente.');
                cargarRecordatoriosDesdeBackend();
            })
            .catch(error => alert('❌ Error al guardar el recordatorio.'));
        } else {
            alert('⚠️ Por favor, completa todos los campos.');
        }
    }

    function renderizarListaRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = recordatorios.length
            ? recordatorios.map(rec => `<li>${rec.titulo} - ${new Date(rec.fecha).toLocaleString()}
                <button class="btn-eliminar" data-titulo="${rec.titulo}" data-fecha="${rec.fecha}">Eliminar</button>
            </li>`).join('')
            : '<li>No hay recordatorios</li>';

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function () {
                eliminarRecordatorio(this.dataset.titulo, this.dataset.fecha);
            });
        });
    }

    function eliminarRecordatorio(titulo, fecha) {
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, fecha })
        })
        .then(() => {
            recordatorios = recordatorios.filter(r => r.titulo !== titulo || r.fecha !== fecha);
            localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
            renderizarListaRecordatorios();
        })
        .catch(error => console.error('❌ Error al eliminar:', error));
    }

    function eliminarTodosLosRecordatorios() {
        if (confirm("🚮 ¿Deseas eliminar todos los recordatorios?")) {
            fetch(`${API_URL}/usuario`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id })
            })
            .then(() => {
                recordatorios = [];
                localStorage.removeItem('recordatorios');
                renderizarListaRecordatorios();
                alert('🗑️ Todos los recordatorios eliminados.');
            })
            .catch(error => console.error('❌ Error al eliminar todos:', error));
        }
    }

    cargarRecordatoriosDesdeBackend();
});
