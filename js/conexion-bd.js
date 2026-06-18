let mysql = require("mysql");

let conexion = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD
});

conexion.connect(function(err){
    if(err){
        throw err;
    } else {
        console.log("conexion exitosa");
    }
});

module.exports = conexion;