document.addEventListener("DOMContentLoaded", function () {
    const horaAlarma = document.getElementById("hora-alarma");
    const agregarAlarmaBtn = document.getElementById("agregar-alarma");
    const verAlarmasBtn = document.getElementById("ver-alarmas");
    const eliminarAlarmasBtn = document.getElementById("eliminar-alarma");
    const areaAlarmas = document.getElementById("area-alarmas");

    let alarmas = JSON.parse(localStorage.getItem("alarmas")) || [];
    let alarmaActiva = null;
    let mensajeAlarma = null;
    let alarmaDetenida = false; // Nueva variable para evitar reactivación inmediata

    const audio = new Audio("Tono1.mp3");

    function guardarAlarmas() {
        localStorage.setItem("alarmas", JSON.stringify(alarmas));
    }

    function actualizarListaAlarmas() {
        areaAlarmas.innerHTML = "<h3>Alarmas Programadas:</h3>";
        if (alarmas.length === 0) {
            areaAlarmas.innerHTML += "<p>No hay alarmas configuradas.</p>";
        } else {
            alarmas.forEach((alarma, index) => {
                let alarmaElemento = document.createElement("div");
                alarmaElemento.innerHTML = `
                    <p>${alarma.hora} 
                    <button class="eliminar-btn" data-index="${index}">Eliminar</button></p>
                `;
                areaAlarmas.appendChild(alarmaElemento);
            });

            document.querySelectorAll(".eliminar-btn").forEach((btn) => {
                btn.addEventListener("click", function () {
                    let index = this.getAttribute("data-index");
                    eliminarAlarma(index);
                });
            });
        }
    }

    agregarAlarmaBtn.addEventListener("click", function () {
        if (horaAlarma.value) {
            let nuevaAlarma = { hora: horaAlarma.value };
            alarmas.push(nuevaAlarma);
            guardarAlarmas();
            actualizarListaAlarmas();
            alert("Alarma agregada: " + nuevaAlarma.hora);
        } else {
            alert("Debes seleccionar una hora.");
        }
    });

    verAlarmasBtn.addEventListener("click", function () {
        if (areaAlarmas.style.display === "none") {
            areaAlarmas.style.display = "block";
            if (alarmas.length === 0) {
                areaAlarmas.innerHTML = "<p>No hay alarmas configuradas.</p>";
            } else {
                actualizarListaAlarmas();
            }
        } else {
            areaAlarmas.style.display = "none";
        }
    });
        
        actualizarListaAlarmas();


    function verificarAlarmas() {
        let ahora = new Date();
        let horaActual = ahora.getHours().toString().padStart(2, '0') + ":" +
                         ahora.getMinutes().toString().padStart(2, '0');

        if (alarmaDetenida) return; // Si se detuvo, no volver a activar hasta el siguiente minuto

        alarmas.forEach((alarma, index) => {
            if (alarma.hora === horaActual && alarmaActiva !== alarma.hora) {
                alarmaActiva = alarma.hora;
                activarAlarma(index);
            }
        });
    }

    function activarAlarma(index) {
        if (!audio.paused) return; 
        audio.play(); 

        if (mensajeAlarma) mensajeAlarma.remove();

        mensajeAlarma = document.createElement("div");
        mensajeAlarma.id = "alarma-mensaje";
        mensajeAlarma.style = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8); color: white; padding: 15px; border-radius: 8px;
            font-size: 18px; text-align: center; z-index: 1000;
            box-shadow: 0px 0px 10px rgba(255,255,255,0.3);
        `;
        mensajeAlarma.innerHTML = `
            <p>⏰ ¡Alarma activada! ${alarmas[index].hora}</p>
            <button id="posponer-alarma" style="margin-right: 10px; background: #2980b9; border: none; padding: 8px; color: white; border-radius: 5px;">Posponer 5 min</button>
            <button id="cerrar-alarma" style="background: #e74c3c; border: none; padding: 8px; color: white; border-radius: 5px;">Detener</button>
        `;
        document.body.appendChild(mensajeAlarma);

        document.getElementById("posponer-alarma").addEventListener("click", function () {
            posponerAlarma(index);
        });

        document.getElementById("cerrar-alarma").addEventListener("click", function () {
            detenerAlarma();
        });
    }

    function posponerAlarma(index) {
        let [horas, minutos] = alarmas[index].hora.split(":").map(Number);
        minutos += 5;
        if (minutos >= 60) {
            minutos -= 60;
            horas += 1;
            if (horas >= 24) horas = 0;
        }
        alarmas[index].hora = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        guardarAlarmas();
        actualizarListaAlarmas();
        detenerAlarma();
    }

    function detenerAlarma() {
        alarmaActiva = null;
        alarmaDetenida = true; // Marcar que se detuvo para evitar reactivación inmediata
        setTimeout(() => { alarmaDetenida = false; }, 60000); // Rehabilitar después de 1 minuto

        audio.pause();
        audio.currentTime = 0;

        if (mensajeAlarma) {
            mensajeAlarma.remove();
            mensajeAlarma = null;
        }
    }

    eliminarAlarmasBtn.addEventListener("click", function () {
        alarmas = [];
        guardarAlarmas();
        actualizarListaAlarmas();
        alert("Todas las alarmas han sido eliminadas.");
        detenerAlarma();
    });

    function eliminarAlarma(index) {
        alarmas.splice(index, 1);
        guardarAlarmas();
        actualizarListaAlarmas();
        alert("Alarma eliminada.");
        detenerAlarma();
    }

    actualizarListaAlarmas();
    setInterval(verificarAlarmas, 1000);
});
