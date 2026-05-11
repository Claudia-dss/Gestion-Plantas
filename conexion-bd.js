let mysql = require("mysql");

let conexion = mysql.createConnection({
    host: "localhost",
    database: "plantas_db",
    user:"root",
    password:""
});

conexion.connect(function(err){
    if(err){
        throw err;
    } else {
        console.log("conexion exitosa");
    }
});

module.exports = conexion;