//importamos express
const express = require('express');

//importamos body-parser para poder transcribir JSON o formularios enviados
const bodyParser = require('body-parser');

//importamos la conexion a la bbdd
const db = require('./conexion-bd.js');

//importamos multer para poder subir fotos
const multer = require('multer');
const path = require('path');

const app = express(); //iniciamos app
const PORT = 3000; //puerto de mi servidor

//configuramos Express para servir archivos estáticos:
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permite peticiones de cualquier origen
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(express.static(__dirname)); //permite al navegador cargar HTML directamente
app.use(express.json()); //analizador para JSON
app.use(bodyParser.urlencoded({extended: true})); //analizador para datos de formulario
app.use('/uploads', express.static('uploads'));

//donde y cómo guardamos los archivos de fotos
const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/'); // carpeta donde se guardan las fotos
    },
    filename: function (req, file, cb) {
    // Nombre único: timestamp + extensión original
    const nombreUnico = Date.now() + path.extname(file.originalname);
    cb(null, nombreUnico);
    }
});

const upload = multer({ storage: almacenamiento });


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
    const plantasRecibidas = req.body; // Recibimos el array enviado desde el frontend [1]

    // Validamos que recibimos datos
    if (!Array.isArray(plantasRecibidas)) {
        return res.status(400).json({ message: 'Formato de datos inválido, se esperaba un array.' });
    }

    try {
        // Aquí usamos un bucle para insertar cada planta recibida [5]
        for (const planta of plantasRecibidas) {
            const { nombre, adquirida, foto, tipo, ubicacion, estado, ultimo_riego, ultimo_fertilizante, ultimo_cambio_tierra } = planta;
            
            const sql = `INSERT INTO plantas (nombre, adquirida, foto, tipo, ubicacion, estado, ultimo_riego, ultimo_fertilizante, ultimo_cambio_tierra) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            await queryDB(sql,[nombre, adquirida, foto, tipo, ubicacion, estado, ultimo_riego, ultimo_fertilizante, ultimo_cambio_tierra]);
        }

        res.status(200).json({ message: 'Todas las plantas han sido guardadas correctamente.' });
    } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
});

//ruta: /api/cuidados/:id_planta
app.put('/api/cuidados/:id_planta', async (req, res) => {
    const plantaId = req.params.id_planta;
    //los campos que se actualizan
    const {proximo_riego, ultimo_riego, proxima_fertilizacion, ultimo_fertilizante, proximo_cambio_tierra, ultimo_cambio_tierra,
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

    if(ultimo_fertilizante) {
        setClauses.push('ultimo_fertilizante = ?')
        values.push(ultimo_fertilizante);
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


app.post('/api/terrarios', async (req, res) => {

    const {nombre, adquirida, foto, ubicacion, estado} = req.body;

    if (!nombre || !estado) {
        return res.status(400).json({ error: "Faltan campos obligatorios para el registro" });
    }

    const sql = `
        INSERT INTO terrarios (nombre, adquirida, foto, ubicacion, estado)
        VALUES ( ?, ?, ?, ?, ?)
        `;
    const values = [nombre, adquirida, foto, ubicacion, estado];

    try {
        const results = await queryDB(sql, values);
        res.status(201).json({
            message: '¡Terrario guardado con éxito!', 
            id: results.insertId
        });
    } catch (error) {
        console.error('Error al guardar el terrario:', error);
        req.status(500).json({
            message: 'Error al guardar el terrario.',
            error:error.message
        });
    }
});


app.put('/api/cuidados/:id_terrario', async (req, res) => {
    const terrarioId = req.params.id_terrario;

    const { proxima_pulverizacion, ultima_pulverizacion
    } = req.body;

    let setClauses = [];
    let values = [];

    if (ultima_pulverizacion) {
        setClauses.push('ultima_pulverizacion = ?')
        values.push(ultima_pulverizacion);
    }

    if (proxima_pulverizacion) {
        setClauses.push('proxima_pulverizacion = ?')
        values.push(proxima_pulverizacion);
    }
    if (setClauses.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.'});
    }

    const sql = `UPDATE terrarios SET ${setClauses.join(', ')} WHERE id = ?`;
    values.push(terrarioId);

    try {
        const result = await queryDB(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Terrario no encontrada.' });
        }
        res.status(200).json({ message: 'Cuidados actualizados con éxito.' });
    } catch(error) {
        console.error('Error al actualizar Cuidados:', error);
        res.status(500).json({ message: 'Error al actualizar Cuidados.', error: error.message });
    }
});

//endpoint para obntener las plantas que necesitan cuidados
app.get('/api/cuidados/pendientes', async (req, res) => {
    // La función NOW() en MySQL obtiene la fecha y hora actual.
    // Se seleccionan las plantas donde la fecha de 'próximo riego' es anterior o igual a hoy.
    const sql = ` SELECT nombre, proximo_riego, ultima_fertilizacion, proxima_fertilizacion, proximo_cambio_tierra, ultima_pulverizacion, proxima_pulverizacion
        FROM plantas
        WHERE proximo_riego <= NOW() OR proxima_fertilizacion <= NOW() OR proximo_cambio_tierra <= NOW() OR proxima_pulverizacion <= NOW()`;
    try {
        const plantasPendientes = await queryDB(sql);
        res.status(200).json(plantasPendientes); //.json para que la respuesta sea más legible
    } catch(error) {
        console.error('Error al obtener los Cuidados pendientes:', error);
        res.status(500).json({message: 'Error al obtener los Cuidados pendientes.', error: error.message})
    }
});

app.get('/api/cuidados/pendientes/terrarios', async (req, res) => {
    const sql = `
        SELECT nombre, fecha_adquisicion, ultima_pulverizacion, proxima_pulverizacion
        FROM terrarios
        WHERE proxima_pulverizacion <= NOW()
    `;
    try {
        const terrariosPendientes = await queryDB(sql);
        res.status(200).json(terrariosPendientes);
    } catch(error) {
        console.error('Error al obtener los cuidados pendientes de terrarios:', error);
        res.status(500).json({ message: 'Error al obtener los cuidados pendientes de terrarios.', error: error.message });
    }
});

//para iniciar el servidor
//app.listen: Escucha conexiones entrantes en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor de Mi Jardín corriendo en http://localhost:${PORT}`);
    console.log(`Accede a la página principal en http://localhost:${PORT}/public/MisPlantas.html`);
});