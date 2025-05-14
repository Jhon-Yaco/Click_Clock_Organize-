

document.addEventListener('DOMContentLoaded', function () {
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    const audio = new Audio("/frontend/sonidos/Recordatorio.mp3");
    const usuario_id = 1; // ⚠️ Ajusta este ID según el usuario actual

    document.getElementById('agregar-recordatorio').addEventListener('click', agregarRecordatorio);
    document.getElementById('ver-recordatorios').addEventListener('click', verRecordatorios);
    document.getElementById('eliminar-recordatorios').addEventListener('click', eliminarTodosLosRecordatorios);

    function guardarRecordatorios() {
        localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
    }

    function agregarRecordatorio() {
        const mensaje = document.getElementById('mensaje-recordatorio').value;
        const fecha = document.getElementById('fecha-recordatorio').value;
        const hora = document.getElementById('hora-recordatorio').value;

        if (mensaje && fecha && hora) {
            const nuevoRecordatorio = { mensaje, fecha, hora };
            recordatorios.push(nuevoRecordatorio);
            guardarRecordatorios();

            const fechaCompleta = `${fecha}T${hora}`;

            // Enviar al backend
            fetch('http://127.0.0.1:5000/api/recordatorios', {
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
                    console.log('Creado en backend:', data);
                    alert('Recordatorio agregado correctamente.');
                    verRecordatorios();
                })
                .catch(error => {
                    console.error('Error al guardar en el servidor:', error);
                    alert('Error al guardar el recordatorio en el servidor.');
                });

        } else {
            alert('Por favor, completa todos los campos.');
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
                    ${rec.mensaje} - ${rec.fecha} ${rec.hora} 
                    <button class="btn-eliminar" data-index="${index}">Eliminar</button>
                `;
                lista.appendChild(li);
            });

            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = this.getAttribute('data-index');
                    eliminarRecordatorio(index);
                });
            });
        }

        lista.style.display = 'block';
    }

    function eliminarRecordatorio(index) {
        const recordatorio = recordatorios[index];
        const fechaCompleta = `${recordatorio.fecha}T${recordatorio.hora}`;

        // Eliminar del localStorage
        recordatorios.splice(index, 1);
        guardarRecordatorios();
        verRecordatorios();

        // Eliminar del backend
        fetch('http://127.0.0.1:5000/api/recordatorios', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id,
                titulo: recordatorio.mensaje,
                fecha: fechaCompleta
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Eliminado en backend:', data);
            })
            .catch(error => {
                console.error('Error al eliminar del servidor:', error);
            });
    }

    function eliminarTodosLosRecordatorios() {
        if (recordatorios.length === 0) {
            alert("No hay recordatorios para eliminar.");
            return;
        }

        if (confirm("¿Deseas eliminar todos los recordatorios?")) {
            // Eliminar del localStorage
            recordatorios = [];
            guardarRecordatorios();
            verRecordatorios();

            // Eliminar del backend
            fetch('http://127.0.0.1:5000/api/recordatorios/usuario', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id })
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Todos eliminados del backend:', data);
                    alert('Todos los recordatorios eliminados.');
                })
                .catch(error => {
                    console.error('Error al eliminar todos del servidor:', error);
                });
        }
    }

    function verificarRecordatorios() {
        const ahora = new Date();
        const fechaActual = ahora.toISOString().split('T')[0];
        const horaActual = ahora.toTimeString().substring(0, 5); // HH:MM

        recordatorios.forEach((rec, index) => {
            if (rec.fecha === fechaActual && rec.hora === horaActual) {
                audio.play();
                alert(`¡Recordatorio activado! ${rec.mensaje}`);
                eliminarRecordatorio(index);
            }
        });
    }

    setInterval(verificarRecordatorios, 60000);
    document.getElementById('lista-recordatorios').style.display = "none";
});
