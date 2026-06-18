let mysql = require("mysql");

let conexion = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});

conexion.connect(function(err){
    if(err){
        throw err;
    } else {
        console.log("conexion exitosa");
    }
});

module.exports = conexion;