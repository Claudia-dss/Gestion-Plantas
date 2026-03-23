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
        <td><input type="date" value="${planta.adquirida}" data-field="adquirida"></td>
    `;

    tbody.appendChild(fila);
    return fila;
}

async function guardarCambios(){
    //obtenemos la fila donde están los inputs
    const tabla = document.getElementById('miTabla');
    const tbody = tabla.querySelector('tbody'); 
    const fila = tbody.rows[0]; //usamos la primera fila

    //extraemos valores de los inputs
    const nombre = fila.cells[0].querySelector('input').value;
  //const foto = 
    const tipo = fila.cells[2].querySelector('select').value;
    const ubicacion = fila.cells[3].querySelector('select').value;
    const estado = fila.cells[4].querySelector('select').value;
    const adquirida = fila.cells[5].querySelector('input[type= "date"]').value;
}