//establece el servidor. Maneja las peticiones HTTP y se conecta con el archivo conexion-bd.js.

//importamos express
const express = require('express');

//importamos body-parser para poder transcribir JSON o formularios enviados
const bodyParser = require('body-parser');

//importamos la conexion a la bbdd
const db = require('./conexion-bd.js');

const app = express(); //iniciamos app
const PORT = 3000; //puerto de mi servidor

//configuramos Express para servir archivos estáticos:
app.use(express.static(__dirname)); //permite al navegador cargar HTML directamente
app.use(bodyParser.json()); //analizador para JSON
app.use(bodyParser.urlencoded({extended: true})); //analizador para datos de formulario

//Funciones para ejecutar consultas de SQL de forma limpia y asincrona
function queryDB(sql, values = []){
    //promesa para la asincronía de la conexion a la bbdd
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if(error){
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//API endpoint para guardar una nueva planta desde misPlantas.html. ASYNC=devuelve promesa automática y maneja peticiones de HTTP.
    //req=contiene la info de la peticion solicitada. res=objeto para enviar la respuesta solicitada.
app.post('/api/plantas', async (req, res) => {

    //los datos de la planta se envían en el cuerpo de la peticion
    const {nombre, tipo, ubicación, estado, adquirida} = req.body;

    //consulta SQL para insertar datos
    const sql = `
        INSERT INTO plantas (nombre, tipo, ubicación, estado, fecha_adquisicion, ultimo_riego, ultimo_fertilizante, ultimo_cambio_tierra)
        VALUES ( ?, ?, ?, ?, ?, NULL, NULL, NULL)
        `;
    const values = [nombre, tipo, ubicación, estado, adquirida];

    try {
        const results = await queryDB(sql, values);
        //si va bien, se envia la respuesta:
        res.status(201).json({
            message: '¡Planta guardada con éxito!', 
            id: results.insertId
        });
    } catch (error) {
        console.error('Error al guardar la planta:', error);
        //en caso de error, enviamos respuesta con el estado 500(error interno del servidor)
        req.status(500).json({
            message: 'Error al guardar la planta.',
            error:error.message
        });
    }
});

//ruta: /api/cuidados/:id_planta
app.put('/api/cuidados/:id_planta', async (req, res) => {
    const plantaId = req.params.id_planta;
    //los campos que se actualizan
    const {proximo_riego, ultimo_riego, proxima_fertilizacion, ultima_fertilizacion, proximo_cambio_tierra, ultimo_cambio_tierra
    } = req.body;

    //SET. el array crece dinámicamente según sea necesario.
    let setClauses = [];
    let values = [];

    if (ultimo_riego) {
        setClauses.push('ultimo_riego = ?');
        values.push(ultimo_riego);
    }

    if(proximo_riego) {
        setClauses.push('proximo_riego = ?')
        values.push(proximo_riego);
    }

    if(ultima_fertilizacion) {
        setClauses.push('ultima_fertilizacion = ?')
        values.push(ultima_fertilizacion);
    }

    if (proxima_fertilizacion) {
        setClauses.push('proxima_fertilizacion = ?')
        values.push(proxima_fertilizacion);
    }

    if (ultimo_cambio_tierra) {
        setClauses.push('ultimo_cambio_tierra = ?')
        values.push(ultimo_cambio_tierra);
    }

    if (proximo_cambio_tierra) {
        setClauses.push('proximo_cambio_tierra = ?')
        values.push(proximo_cambio_tierra);
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.'});
    }

    //El ${setClauses.join(', ')} evalúa el array y lo convierte a string
    const sql = `UPDATE plantas SET ${setClauses.join(', ')} WHERE id = ?`;
    values.push(plantaId); // Agregamos el ID de la planta al final

    try {
        const result = await queryDB(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Planta no encontrada.' });
        }
        res.status(200).json({ message: 'Cuidados actualizados con éxito.' });
    } catch(error) {
        //Log interno 
        console.error('Error al actualizar Cuidados:', error);
        //500 = Error genérico del servidor
        res.status(500).json({ message: 'Error al actualizar Cuidados.', error: error.message });
    }
});

//endpoint para obntener las plantas que necesitan cuidados
app.get('/api/cuidados/pendientes', async (req, res) => {
    // La función NOW() en MySQL obtiene la fecha y hora actual.
    // Se seleccionan las plantas donde la fecha de 'próximo riego' es anterior o igual a hoy.
    const sql = ` SELECT nombre, proximo_riego, ultima_fertilizacion, proximo_cambio_tierra
        FROM plantas
        WHERE proximo_riego <= NOW() OR proxima_fertilizacion <= NOW() OR proximo_cambio_tierra <= NOW()`;
    try {
        const plantasPendientes = await queryDB(sql);
        res.status(200).json(plantasPendientes); //.json para que la respuesta sea más legible
    } catch(error) {
        console.error('Error al obtener los Cuidados pendientes:', error);
        res.status(400).json({message: 'Error al obtener los Cuidados pendientes.', error: error.message})
    }
});

//para iniciar el servidor
//app.listen: Escucha conexiones entrantes en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor de Mi Jardín corriendo en http://localhost:${PORT}`);
    console.log(`Accede a la página principal en http://localhost:${PORT}/plantas.html`);
});