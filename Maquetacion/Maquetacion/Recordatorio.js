document.addEventListener('DOMContentLoaded', function () {
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    const audio = new Audio("Recordatorio.mp3");

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
            recordatorios.push({ mensaje, fecha, hora });
            guardarRecordatorios();
            alert('Recordatorio agregado correctamente.');
            verRecordatorios();
        } else {
            alert('Completa todos los campos.');
        }
    }

    function verRecordatorios() {
        const lista = document.getElementById('lista-recordatorios');
        lista.innerHTML = '';

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
            guardarRecordatorios();
            verRecordatorios();
            alert("Todos los recordatorios han sido eliminados.");
        }
    }

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
    verRecordatorios();
});
