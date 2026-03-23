
//intervalo en días
const INTERVALO_RIEGO = 15;
const INTERVALO_FERTILIZACION = 30;
const INTERVALO_TIERRA = 365;
const INTERVALO_PULVER = 365;

function vencido(fechaUltima, intervaloDias) {
    if (!fechaUltima) return false;
    const ultima = new Date(fechaUltima);
    const hoy = new Date();
    const diferenciaDias = (hoy - ultima) / (1000 * 60 * 60 * 24);
    return diferenciaDias >= intervaloDias;
}

function formatearFecha(fecha){
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES');
}

function proxCuidado(fechaUltima, intervaloDias){
    if(!ultimaFecha) return '-';
    const proxima = new Date(fechaUltima);
    proxima.setDate(proxima.getDate() + intervaloDias);
    return proxima.toLocaleDateString('es-ES');
}

async function cargarCuidadosPend() {
    try{
        const respuesta = await fetch ('/api/cuidados/pendientes');
        const plantas = await respuesta.json();

        const tbody = document.querySelector('#miTabla tbody');
        tbody.innerHTML = '';

        const plantasVencidas = plantas.filter(p =>
            vencido(p.ultimo_riego, INTERVALO_RIEGO) ||
            vencido(p.ultima_fertilizacion, INTERVALO_FERTILIZACION) ||
            vencido(p.ultimo_cambio_tierra, INTERVALO_TIERRA) ||
            vencido(p.ultima_pulverizacion, INTERVALO_PULVER)
        );

        if(plantasVencidas.lenght === 0){
            tbody.innerHTML = `<tr><td colspan="9">✅ ¡Todas las plantas están al día!</td></tr>`;
            return;
        }

        plantasVencidas.forEach(planta => {
            const fila = document.createElement('tr');
            const claseRiego = vencido(planta.ultimo_riego, INTERVALO_RIEGO) ? 'vencido' : '';
            const claseFertil = vencido(planta.ultima_fertilizacion, INTERVALO_FERTILIZACION) ? 'vencido' : '';
            const claseTierra = vencido(planta.ultimo_cambio_tierra, INTERVALO_TIERRA) ? 'vencido' : '';
            const clasePulver = vencido(planta.ultima_pulverizacion, INTERVALO_PULVER) ? 'vencido' : '';

            fila.innerHTML = `
                <td>${planta.nombre}</td>
                <td class="${claseRiego}">${formatearFecha(planta.ultimo_riego)}</td>
                <td class="${claseRiego}">${proximaCita(planta.ultimo_riego, INTERVALO_RIEGO)}</td>
                <td class="${claseFertil}">${formatearFecha(planta.ultima_fertilizacion)}</td>
                <td class="${claseFertil}">${proximaCita(planta.ultima_fertilizacion, INTERVALO_FERTILIZACION)}</td>
                <td class="${claseTierra}">${formatearFecha(planta.ultimo_cambio_tierra)}</td>
                <td class="${claseTierra}">${proximaCita(planta.ultimo_cambio_tierra, INTERVALO_TIERRA)}</td>
                <td class="${clasePulver}">${formatearFecha(planta.ultima_pulverizacion)}</td>
                <td class="${clasePulver}">${proximaCita(planta.ultima_pulverizacion, INTERVALO_PULVER)}</td>
                <td>—</td>
                <td>—</td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar los Cuidados Pendientes', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarCuidadosPendientes);