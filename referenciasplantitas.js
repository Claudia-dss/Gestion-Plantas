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
    // creamos el elemento HTML de la fila
    const fila = document.createElement('tr'); //Crea una nueva fila de tabla
    fila.setAttribute ('data-id', id);//crea una etiqueta con el id

    //creamos el contenido HTML de la fila
    fila.innerHTML = `
        <td><input type="text" value="${planta.nombre}" class="nombre"></td>
        <td><input type="file" class="foto"></td>
        <td>
            <select class="tipo">
                <option value="">Selecciona...</option>
                <option value="Suculenta" ${planta.tipo === 'Suculenta' ? 'selected' : ''}>Suculenta</option>
                <option value="Cactus" ${planta.tipo === 'Cactus' ? 'selected' : ''}>Cactus</option>
                <option value="Crasas" ${planta.tipo === 'Crasas' ? 'selected' : ''}>Crasas</option>
                <option value="Planta con flor" ${planta.tipo === 'Planta con flor' ? 'selected' : ''}>Planta con flor</option>
                <option value="Planta sin flor" ${planta.tipo === 'Planta sin flor' ? 'selected' : ''}>Planta sin flor</option>
                <option value="Planta acuática" ${planta.tipo === 'Planta acuática' ? 'selected' : ''}>Planta acuática</option>
                <option value="Árbol" ${planta.tipo === 'Árbol' ? 'selected' : ''}>Árbol</option>
                <option value="Hierba" ${planta.tipo === 'Hierba' ? 'selected' : ''}>Hierba</option>
               
            </select>
        </td>
        <td>
            <select class="ubicacion">
                <option value="Salón" ${planta.ubicacion === 'Salón' ? 'selected' : ''}>Salón</option>
                <option value="Cocina" ${planta.ubicacion === 'Cocina' ? 'selected' : ''}>Cocina</option>
                <option value="Habitación" ${planta.ubicacion === 'Habitación' ? 'selected' : ''}>Habitación</option>
                <option value="Baño" ${planta.ubicacion === 'Baño' ? 'selected' : ''}>Baño</option>
                <option value="Terraza" ${planta.ubicacion === 'Terraza' ? 'selected' : ''}>Terraza</option>
            </select>
        </td>
        <td>
            <select class="estado">
                <option value="Sana" ${planta.estado === 'Sana' ? 'selected' : ''}>Sana</option>
                <option value="Enferma" ${planta.estado === 'Enferma' ? 'selected' : ''}>Enferma</option>
                <option value="Muerta" ${planta.estado === 'Muerta' ? 'selected' : ''}>Muerta</option>
            </select>
        </td>
        <td><input type="date" value="${planta.adquirida}" class="adquirida"></td>
    `;
    return fila;
}

function anadirFila(){
    const tbody = document.querySelectorAll('#miTabla tbody tr');
    const nuevaFila = crearFila();
    tbody.appendChild(nuevaFila);
}

function guardarCambios() {
    const filas = document.querySelectorAll('#miTabla tbody tr');
    const datos = Array.from(filas).map(fila => {
        return {
            id: fila.getAttribute('data-id'),
            nombre: fila.querySelector('.nombre').value,
            tipo: fila.querySelector('.tipo').value,
            ubicacion: fila.querySelector('.ubicacion').value,
            estado: fila.querySelector('.estado').value,
            adquirida: fila.querySelector('.adquirida').value
        };
    });

    console.log("Datos a guardar:", datos);
    alert("Revisa la consola (F12) para ver los datos capturados.");
}

