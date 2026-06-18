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
            adquirida: new Date().toISOString().split('T')[0], //se obtiene la fecha del dia que es, la convierte en texto, corta en la T y toma la primera parte.
            foto: '',
            tipo:'',
            ubicacion: '',
            estado:'',
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
        <td><input type="date" class="fecha"></td>
        <td><input type="date" class="fecha"></td>
        <td><input type="date" class="fecha"></td>
    `;

    fila.addEventListener('click', function () {
    document.querySelectorAll('#miTabla tr.marcada').forEach(f => f.classList.remove('marcada'));// Desmarca cualquier fila previamente marcada
    this.classList.add('marcada');// Marca la fila clickada
});

    tbody.appendChild(fila);
    return fila;

    const inputFoto = fila.querySelector('input[type="file"]');
    const tdFoto = fila.cells[2];

inputFoto.addEventListener('change', function () {
    const archivo = this.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = function (e) {
    // Creamos una imagen pequeña de previsualización
    let preview = tdFoto.querySelector('img');
    if (!preview) {
        preview = document.createElement('img');
        preview.style.width = '50px';
        preview.style.height = '50px';
        preview.style.objectFit = 'cover';
        preview.style.borderRadius = '6px';
        preview.style.marginTop = '4px';
        tdFoto.appendChild(preview);
    }
    preview.src = e.target.result; // base64 temporal solo para mostrar
    };
    reader.readAsDataURL(archivo);
    });
}

async function guardarCambios() {
    const tabla = document.getElementById('miTabla');
    const todasLasFilas = tabla.querySelector('tbody').rows;

    if (todasLasFilas.length === 0) {
    alert("No hay filas para guardar.");
    return;
    }

    for (let i = 0; i < todasLasFilas.length; i++) {
    const fila = todasLasFilas[i];
    const celdas = fila.querySelectorAll('input, select');

    const nombreVal = celdas[0].value.trim();
    if (nombreVal === "") {
        alert(`Error en la fila ${i + 1}: el nombre no puede estar vacío.`);
        celdas[0].focus();
        return;
    }

    // Empaqueta los datos como multipart/form-data
    const formData = new FormData();
    formData.append('nombre', nombreVal);
    formData.append('adquirida', celdas[1].value);
    
    const inputFoto = fila.querySelector('input[type="file"]');
    if (inputFoto.files[0]) {
      formData.append('foto', inputFoto.files[0]); // el archivo de verdad
    }

    formData.append('tipo', celdas[3].value);
    formData.append('ubicacion', celdas[4].value);
    formData.append('estado', celdas[5].value);

    try {
        const respuesta = await fetch('http://localhost:3000/api/plantas', {
        method: 'POST',
        body: formData 
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        console.error('Error fila', i + 1, error);
        alert(`Error al guardar la planta "${nombreVal}".`);
        return;
    }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor.');
        return;
        }
    }

    alert('¡Todas las plantas guardadas con éxito!');
}

async function cargarPlantas() {
    try{
        const respuesta = await fetch('http://localhost:3000/api/plantas');
        const plantas = await respuesta.json();

        const tbody = document.getElementById('miTabla').querySelector('tbody');
        tbody.innetHTML = ''; //limpiamos tabla antes de rellenar

        plantas.forEach(planta => {
            const fila = document.createElement('tr');
            fila.setAttribute('data-id', planta.id);

            fila.innerHTML = `
                <td><input type="text" value="${planta.nombre ?? ''}" data-field="nombre"></td>
                <td><input type="date" value="${planta.adquirida ? planta.adquirida.split('T')[0] : ''}" data-field="adquirida"></td>
                <td>
                    ${planta.foto ? `<img src="/${planta.foto}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">` : '<input type="file" data-field="foto">'}
                </td>
                <td>
                    <select data-field="tipo">
                        <option value="">Selecciona un tipo</option>
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
                    <select data-field="ubicacion">
                        <option value="">Selecciona ubicación</option>
                        <option value="Salón" ${planta.ubicacion === 'Salón' ? 'selected' : ''}>Salón</option>
                        <option value="Habitación" ${planta.ubicacion === 'Habitación' ? 'selected' : ''}>Habitación</option>
                        <option value="Baño" ${planta.ubicacion === 'Baño' ? 'selected' : ''}>Baño</option>
                        <option value="Cocina" ${planta.ubicacion === 'Cocina' ? 'selected' : ''}>Cocina</option>
                        <option value="Terraza" ${planta.ubicacion === 'Terraza' ? 'selected' : ''}>Terraza</option>
                    </select>
                </td>
                <td>
                    <select data-field="estado">
                        <option value="">Selecciona estado</option>
                        <option value="Sana" ${planta.estado === 'Sana' ? 'selected' : ''}>Sana</option>
                        <option value="Enferma" ${planta.estado === 'Enferma' ? 'selected' : ''}>Enferma</option>
                        <option value="Muerta" ${planta.estado === 'Muerta' ? 'selected' : ''}>Muerta</option>
                    </select>
                </td>
                <td><input type="date" value="${planta.ultimo_riego ? planta.ultimo_riego.split('T')[0] : ''}" data-field="ultimo_riego"></td>
                <td><input type="date" value="${planta.ultimo_fertilizante ? planta.ultimo_fertilizante.split('T')[0] : ''}" data-field="ultimo_fertilizante"></td>
                <td><input type="date" value="${planta.ultimo_cambio_tierra ? planta.ultimo_cambio_tierra.split('T')[0] : ''}" data-field="ultimo_cambio_tierra"></td>
            `;

            fila.addEventListener('click', function () {
                document.querySelectorAll('#miTabla tr.marcada').forEach(f => f.classList.remove('marcada'));
                this.classList.add('marcada');
            });
            
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Eror al cargar las plantas:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarPlantas);


function eliminarFilaSeleccionada() {
    const filaParaBorrar = document.querySelector('#miTabla tr.marcada');

    if(filaParaBorrar){
        filaParaBorrar.remove();
        console.log("Fila seleccionada eliminada con éxito.");
    } else {
        alert("Por favor, seleccione primero una fila para eliminar.")
    }
}