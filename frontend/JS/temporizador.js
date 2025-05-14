
document.addEventListener('DOMContentLoaded', function () {
    let tiempoRestante;
    let temporizadorInterval;

    document.getElementById('iniciar-temporizador').addEventListener('click', function () {
        iniciarTemporizador();
    });

    document.getElementById('detener-temporizador').addEventListener('click', function () {
        detenerTemporizador();
    });

    function iniciarTemporizador() {
        const tiempoInput = document.getElementById('tiempo-temporizador');
        const tiempoMinutos = parseInt(tiempoInput.value, 10);

        if (!isNaN(tiempoMinutos) && tiempoMinutos > 0) {
            tiempoRestante = tiempoMinutos * 60; // Convertir minutos a segundos

            temporizadorInterval = setInterval(function () {
                if (tiempoRestante <= 0) {
                    detenerTemporizador();
                    alert('¡Tiempo agotado!'); // Puedes personalizar esto
                } else {
                    mostrarTiempo();
                    tiempoRestante--;
                }
            }, 1000);
        } else {
            alert('Por favor, ingrese un tiempo válido en minutos.');
        }
    }

    function detenerTemporizador() {
        clearInterval(temporizadorInterval);
    }

    function mostrarTiempo() {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;

        const display = document.getElementById('temporizador-display');
        display.textContent = `${agregarCero(minutos)}:${agregarCero(segundos)}`;
    }

    function agregarCero(valor) {
        return valor < 10 ? `0${valor}` : valor;
    }
});

