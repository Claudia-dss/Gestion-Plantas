function buscarPlanta() {
    const termino = document.getElementById("buscador").value.toLowerCase().trim();
    const tabla = document.getElementById("miTabla");
    const filas = tabla.querySelectorAll("tbody tr");

    //recorremos cada fila
    filas.forEach(function(fila){
        const nombreCelda = fila.querySelector("td:first-child input");

        if (!nombreCelda) return; 

        const nombrePlanta = nombreCelda.value.toLowerCase();

        //Comparamos si el nombre contiene el termino buscado, sino ocultamos.
        if (nombrePlanta.includes(termino)){
            fila.computedStyleMap.display = ""; //muestra la fila
        } else {
            fila.computedStyleMap.display = "none"; //la oculta
        }
    });

    document.getElementById("buscador").addEventListener("input", buscarPlanta);
}
