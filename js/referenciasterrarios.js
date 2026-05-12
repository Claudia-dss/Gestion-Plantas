terrarios = [];
let contadorId = 1;

function crearFila(terrario = null){
    const id = terrario ? terrario.id : contadorId++; 

    if(!terrario){
        terrario = {
            id: 'id',
            nombre: '',
            adquirida: new Date().toISOString().split('T')[0],
            foto:'',
            ubicacion: '',
            estado:'',
        }
    }

    const tbody = document.getElementById('miTabla').querySelector('tbody');
    const fila = document.createElement('tr');
    fila.setAttribute('data-id', id);

    fila.innerHTML = `
        <td><input type="text" value="${terrario.nombre}" data-field="nombre" placeholder="Ej: Rosa"></td>
        <td><input type="date" value="${terrario.adquirida}" data-field="adquirida"></td>
        <td><input type="file" data-field="foto"></td>
        <td>
            <select data-field="ubicacion">
                <option value="">Selecciona ubicación</option>
                <option value="Salón">Salón</option>
                <option value="Habitación">Habitación</option>
                <option value="Baño">Baño</option>
                <option value="Cocina">Cocina</option>
                <option value="Terraza">Terraza</option>
            </select>
        </td>
        <td>
            <select data-field="estado">
                <option value="">Selecciona estado</option>
                <option value="Sana">Sana</option>
                <option value="Enferma">Enferma</option>
                <option value="Muerta">Muerta</option>
            </select>
        </td>
        <td><input type="date" class="fecha"></td>
    `;

    fila.addEventListener('click', function () {
    document.querySelector('#miTabla tr.marcada').forEach(f => f.classList.remove ('marcada'));
    this.classList.add('marcada');
    });

    tbody.appendChild(fila)
    return fila;
}

async function guardarCambios(){
    const tabla = document.getElementById('miTabla');
    const tbody = document.querySelector('tbody');
    const fila = tbody.rows;

    const terrarios = [];

    if(fila.length === 0){
        alert ('No hay filas para guardar')
        return;
    }

    for (let i = 0; i < fila.length; i++) {
        const fila = fila[i];

        const nombre = fila.cells[0].querySelector('input').value;
        const adquirida = fila.cells[1].querySelector('input[type= "date"]').value;
        const foto = fila.cells[2].querySelector('input[type= "file"]').value;
        const ubicacion = fila.cells[3].querySelector('select').value;
        const estado = fila.cells[4].querySelector('select').value;

        terrarios.push({ nombre, adquirida, foto, ubicacion, estado});
    }


    const respuesta = await fetch('/api/terrarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(terrarios)
    });

    const resultado = await respuesta.json();
    alert(resultado.message);
}


function eliminarFilaSeleccionada() {
    const filaParaBorrar = document.querySelector('#miTabla tr.marcada');

    if(filaParaBorrar){
        filaParaBorrar.remove();
        console.log("Fila seleccionada eliminada con éxito.");
    } else {
        alert("Por favor, seleccione primero una fila para eliminar.")
    }
}