document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000/api/recordatorios';
    const usuario_id = 1;
    let recordatorios = [];

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', cargarRecordatoriosDesdeBackend);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

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

    function cargarRecordatoriosDesdeBackend() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                recordatorios = data.filter(r => r.usuario_id === usuario_id);
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

    cargarRecordatoriosDesdeBackend();

    // ✅ Verificar y activar recordatorios automáticamente
    setInterval(() => {
        const ahora = new Date().toISOString().slice(0, 16); 
        const recordatorioActivo = recordatorios.find(rec => rec.fecha === ahora);

        if (recordatorioActivo) {
            alert(`🔔 Recordatorio: ${recordatorioActivo.titulo}`);
        }
    }, 3000); // ✅ Se redujo el intervalo de verificación a 3 segundos
});
