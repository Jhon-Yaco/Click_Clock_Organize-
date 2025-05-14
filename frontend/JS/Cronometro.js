document.addEventListener('DOMContentLoaded', function () {
    let cronometroInterval;
    let segundos = 0;
    let minutos = 0;
    let horas = 0;
    let tiemposGuardados = [];

    document.getElementById('iniciar-cronometro').addEventListener('click', function () {
        iniciarCronometro();
    });

    document.getElementById('detener-cronometro').addEventListener('click', function () {
        detenerCronometro();
    });

    document.getElementById('reiniciar-cronometro').addEventListener('click', function () {
        reiniciarCronometro();
    });

    document.getElementById('guardar-tiempo').addEventListener('click', function () {
        guardarTiempo();
    });

    document.getElementById('borrar-tiempo').addEventListener('click', function () {
        borrarTiempos();
    });

    document.getElementById('mostrar-Tiempos-Guardados').addEventListener('click', function () {
        mostrarTiemposGuardados();
    });

    function iniciarCronometro() {
        detenerCronometro(); // Detener el cronómetro antes de iniciar uno nuevo

        cronometroInterval = setInterval(function () {
            segundos++;
            if (segundos === 60) {
                segundos = 0;
                minutos++;
                if (minutos === 60) {
                    minutos = 0;
                    horas++;
                }
            }

            actualizarDisplay();
        }, 1000);
    }

    function detenerCronometro() {
        clearInterval(cronometroInterval);
    }

    function reiniciarCronometro() {
        detenerCronometro();
        segundos = 0;
        minutos = 0;
        horas = 0;
        actualizarDisplay();
    }

    function guardarTiempo() {
        const tiempoActual = `${agregarCero(horas)}:${agregarCero(minutos)}:${agregarCero(segundos)}`;
        tiemposGuardados.push(tiempoActual);
        mostrarTiemposGuardados();
    }

    function borrarTiempos() {
        tiemposGuardados = [];
        mostrarTiemposGuardados();
    }

    function mostrarTiemposGuardados() {
        const listaTiempos = document.getElementById('lista-tiempos');
        listaTiempos.innerHTML = '';

        if (tiemposGuardados.length > 0) {
            tiemposGuardados.forEach(tiempo => {
                const elementoTiempo = document.createElement('li');
                elementoTiempo.textContent = tiempo;
                listaTiempos.appendChild(elementoTiempo);
            });
        } else {
            listaTiempos.innerHTML = '<li>No hay tiempos almacenados.</li>';
        }
    }

    function actualizarDisplay() {
        const display = document.getElementById('cronometro-display');
        display.textContent = `${agregarCero(horas)}:${agregarCero(minutos)}:${agregarCero(segundos)}`;
    }

    function agregarCero(valor) {
        return valor < 10 ? `0${valor}` : valor;
    }
});
