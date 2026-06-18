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

async function guardarCambios(){
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

    formData.append('ubicacion', celdas[4].value);
    formData.append('estado', celdas[5].value);

    try {
        const respuesta = await fetch('http://localhost:3000/api/terrarios', {
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

async function cargarTerrarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/terrarios');
        const terrarios = await respuesta.json();

        const tbody = document.getElementById('miTabla').querySelector('tbody');
        tbody.innerHTML = ''; // limpiamos la tabla antes de rellenar

        terrarios.forEach(terrario => {
            const fila = document.createElement('tr');
            fila.setAttribute('data-id', terrario.id);

            fila.innerHTML = `
                <td><input type="text" value="${terrario.nombre ?? ''}" data-field="nombre"></td>
                <td><input type="date" value="${terrario.adquirida ? planta.adquirida.split('T')[0] : ''}" data-field="adquirida"></td>
                <td>
                    ${terrario.foto ? `<img src="/${terrario.foto}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">` : '<input type="file" data-field="foto">'}
                </td>
                <td>
                    <select data-field="ubicacion">
                        <option value="">Selecciona ubicación</option>
                        <option value="Salón" ${terrario.ubicacion === 'Salón' ? 'selected' : ''}>Salón</option>
                        <option value="Habitación" ${terrario.ubicacion === 'Habitación' ? 'selected' : ''}>Habitación</option>
                        <option value="Baño" ${terrario.ubicacion === 'Baño' ? 'selected' : ''}>Baño</option>
                        <option value="Cocina" ${terrario.ubicacion === 'Cocina' ? 'selected' : ''}>Cocina</option>
                        <option value="Terraza" ${terrario.ubicacion === 'Terraza' ? 'selected' : ''}>Terraza</option>
                    </select>
                </td>
                <td>
                    <select data-field="estado">
                        <option value="">Selecciona estado</option>
                        <option value="Sana" ${terrario.estado === 'Sana' ? 'selected' : ''}>Sana</option>
                        <option value="Enferma" ${terrario.estado === 'Enferma' ? 'selected' : ''}>Enferma</option>
                        <option value="Muerta" ${terrario.estado === 'Muerta' ? 'selected' : ''}>Muerta</option>
                    </select>
                </td>
                <td><input type="date" value="${terrario.ultima_pulverizacion ? terrario.ultima_pulverizacion.split('T')[0] : ''}" data-field="ultima_pulverizacion"></td>
            `;

            fila.addEventListener('click', function () {
                document.querySelectorAll('#miTabla tr.marcada').forEach(f => f.classList.remove('marcada'));
                this.classList.add('marcada');
            });

            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar los terrarios:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarTerrarios);

function eliminarFilaSeleccionada() {
    const filaParaBorrar = document.querySelector('#miTabla tr.marcada');

    if(filaParaBorrar){
        filaParaBorrar.remove();
        console.log("Fila seleccionada eliminada con éxito.");
    } else {
        alert("Por favor, seleccione primero una fila para eliminar.")
    }
}