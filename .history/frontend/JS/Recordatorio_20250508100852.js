document.addEventListener('DOMContentLoaded', function () {
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    const audio = new Audio("/frontend/sonidos/Recordatorio.mp3");

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

            // Enviar al backend
            fetch('http://localhost:3307/api/recordatorios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoRecordatorio)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                alert('Recordatorio agregado correctamente y enviado a la base de datos.');
                verRecordatorios();
            })
            .catch(error => {
                console.error('Error al guardar en el servidor:', error);
                alert('Error al enviar el recordatorio al servidor.');
            });

        } else {
            alert('Completa todos los campos.');
        }
    }

    function verRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        if (lista.style.display === "none" || lista.style.display === "") {
            lista.style.display = "block";
            lista.innerHTML = '';
    
            if (recordatorios.length === 0) {
                const li = document.createElement('li');
                li.innerHTML = 'No hay recordatorios';
                lista.appendChild(li);
            } else {
                recordatorios.forEach((recordatorio, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `${recordatorio.mensaje} - ${recordatorio.fecha} ${recordatorio.hora} 
                        <button class="btn-eliminar" data-index="${index}">Eliminar</button>`;
                    lista.appendChild(li);
                });
    
                document.querySelectorAll('.btn-eliminar').forEach(boton => {
                    boton.addEventListener('click', function () {
                        eliminarRecordatorio(this.getAttribute('data-index'));
                    });
                });
            }
        } else {
            lista.style.display = "none";
        }
    }

    function eliminarRecordatorio(index) {
        recordatorios.splice(index, 1);
        guardarRecordatorios();
        verRecordatorios();
    }

    function eliminarTodosLosRecordatorios() {
        if (recordatorios.length === 0) {
            alert("No hay recordatorios para eliminar.");
            return;
        }

        if (confirm("¿Estás seguro de que deseas eliminar todos los recordatorios?")) {
            recordatorios = [];

            // Lógica para eliminar en el backend
            fetch('http://127.0.0.1:3307/api/recordatorio', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  usuario_id: 1, // Agrégalo aquí si no lo tienes
                  titulo: mensaje,
                  descripcion: "", // puedes dejarlo vacío si no usas descripción
                  fecha: `${fecha}T${hora}`
                })
              })
            }};              

    function verificarRecordatorios() {
        const ahora = new Date();
        const fechaActual = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');

        recordatorios.forEach((recordatorio, index) => {
            if (recordatorio.fecha === fechaActual && recordatorio.hora === horaActual) {
                audio.play();
                alert(`¡Recordatorio activado! ${recordatorio.mensaje}`);
                eliminarRecordatorio(index);
            }
        });
    }

    setInterval(verificarRecordatorios, 60000); // Verificar cada minuto
    document.getElementById('lista-recordatorios').style.display = "none";
});
