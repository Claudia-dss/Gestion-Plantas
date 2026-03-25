plantas = [];  // Array vacío donde guardaremos las plantas
let contadorId = 1;  // Contador para dar IDs únicos a cada planta

function crearFila(planta = null) {
    // 1. Asignamos un ID único
    const id = planta ? planta.id : contadorId++; //si hay planta, usa su id, si no hay, usa contadorId y luego va sumando el id
    //Creamos un "molde" (objeto) con todas las propiedades vacías
    if(!planta){
        planta = {
            id: id,
            nombre: '',
            foto: '',
            tipo:'',
            ubicacion: '',
            estado:'',
            adquirida: new Date().toISOString().split('T')[0] //se obtiene la fecha del dia que es, la convierte en texto, corta en la T y toma la primera parte.
        };
    }

    const tbody = document.getElementById('miTabla').querySelector('tbody');
    const fila = document.createElement('tr'); //Crea una nueva fila de tabla
    fila.setAttribute ('data-id', id);//crea una etiqueta con el id

    //creamos el contenido HTML de la fila
    fila.innerHTML = `
        <td><input type="text" value="${planta.nombre}" data-field="nombre" placeholder="Ej: Rosa"></td>
        <td><input type="date" value="${planta.adquirida}" data-field="adquirida"></td>
        <td><input type="file" data-field="foto"></td>
        <td>
            <select data-field="tipo">
                <option value="">Selecciona un tipo</option>
                <option value="Suculenta">Suculenta</option>
                <option value="Cactus">Cactus</option>
                <option value="Crasas">Crasas</option>
                <option value="Planta con flor">Planta con flor</option>
                <option value="Planta sin flor">Planta sin flor</option>
                <option value="Planta acuática">Planta acuática</option>
                <option value="Árbol">Árbol</option>
                <option value="Hierba">Hierba</option>
            </select>
        </td>
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
    `;

    fila.addEventListener('click', function () {
    document.querySelectorAll('#miTabla tr.marcada').forEach(f => f.classList.remove('marcada'));// Desmarca cualquier fila previamente marcada
    this.classList.add('marcada');// Marca la fila clickada
});

    tbody.appendChild(fila);
    return fila;
}

async function guardarCambios() {
    //obtenemos la fila donde están los inputs
    const tabla = document.getElementById('miTabla');
    const tbody = tabla.querySelector('tbody'); 
    const fila = tbody.rows;

    const plantas = [];

    if(filas.lenght === 0){
        alert("No hay filas para guardar.");
        return;
    }

    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];

    //extraemos valores de los inputs
        const nombre = fila.cells[0].querySelector('input').value;
        const adquirida = fila.cells[1].querySelector('input[type= "date"]').value;
        const foto = fila.cells[2].querySelector('input[type= "file"]').value;
        const tipo = fila.cells[3].querySelector('select').value;
        const ubicacion = fila.cells[4].querySelector('select').value;
        const estado = fila.cells[5].querySelector('select').value;
    
    plantas.push({ nombre, foto, tipo, ubicacion, estado, adquirida });
}

    const respuesta = await fetch('/api/plantas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantas)
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