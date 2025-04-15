document.addEventListener('DOMContentLoaded', function () {
    let alarmas = [];
    let indiceAlarma = 0;

    document.getElementById('iniciar-alarma').addEventListener('click', function () {
        configurarAlarma();
    });

    document.getElementById('agregar-alarma').addEventListener('click', function () {
        configurarAlarma();
    });

    document.getElementById('detener-alarma').addEventListener('click', function () {
        detenerAlarma();
    });

    document.getElementById('ver-alarmas').addEventListener('click', function () {
        mostrarAlarmas();
    });

    document.getElementById('eliminar-alarma').addEventListener('click', function () {
        eliminarAlarma();
    });

    function configurarAlarma() {
        const horaAlarma = document.getElementById('hora-alarma').value;
        const tonoAlarma = document.getElementById('tono-alarma').value;
        const diasSeleccionados = obtenerDiasSeleccionados();

        if (horaAlarma !== '' && tonoAlarma !== '' && diasSeleccionados.length > 0) {
            const nuevaAlarma = {
                id: indiceAlarma++,
                hora: horaAlarma,
                tono: tonoAlarma,
                dias: diasSeleccionados,
                activa: true // Alarma activa por defecto
            };

            // Agrega la nueva alarma al array
            alarmas.push(nuevaAlarma);

            // Programa la alarma
            programarAlarma(nuevaAlarma);

            alert('Alarma programada. Se activará a la hora especificada los días: ' + diasSeleccionados.join(', '));
        } else {
            alert('Por favor, completa todos los campos para configurar la alarma.');
        }
    }

    function programarAlarma(alarma) {
        const ahora = new Date();

        alarma.dias.forEach(function (dia) {
            const proximoDia = obtenerProximoDia(ahora, dia);
            const tiempoRestante = calcularTiempoRestante(alarma.hora, proximoDia);

            setTimeout(function () {
                alert(`¡Despierta! Es hora de levantarse. (${dia} a las ${alarma.hora})`);
            }, tiempoRestante);
        });
    }

    function obtenerProximoDia(ahora, dia) {
        const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const indiceDia = dias.indexOf(dia);
        const diferenciaDias = (indiceDia + 7 - ahora.getDay()) % 7;
        return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + diferenciaDias);
    }

    function calcularTiempoRestante(horaAlarma, proximoDia) {
        const horaAlarmaDate = new Date(`${proximoDia.toISOString().split('T')[0]}T${horaAlarma}:00`);
        return horaAlarmaDate.getTime() - Date.now();
    }

    function obtenerDiasSeleccionados() {
        const diasSeleccionados = [];
        const checkboxes = document.querySelectorAll('.dias-semana input[type="checkbox"]:checked');

        checkboxes.forEach(function (checkbox) {
            diasSeleccionados.push(checkbox.value);
        });

        return diasSeleccionados;
    }

    function detenerAlarma() {
        // Lógica para detener la alarma
        // Puedes usar clearTimeout según cómo hayas programado la alarma
        alert('Alarma detenida.');
    }

    function mostrarAlarmas() {
        // Mostrar el listado de alarmas en el área específica
        const areaAlarmas = document.getElementById('area-alarmas');
        areaAlarmas.innerHTML = '<h2>Listado de Alarmas</h2><pre>' + JSON.stringify(alarmas, null, 2) + '</pre>';
    }

    function eliminarAlarma() {
        const idEliminar = prompt('Ingrese el ID de la alarma que desea eliminar:');

        if (idEliminar !== null) {
            const index = alarmas.findIndex(alarma => alarma.id === parseInt(idEliminar, 10));

            if (index !== -1) {
                alarmas.splice(index, 1);
                mostrarAlarmas();  // Actualizar la visualización después de la eliminación
                alert('Alarma eliminada correctamente.');
            } else {
                alert('No se encontró ninguna alarma con el ID especificado.');
            }
        }
    }
});


