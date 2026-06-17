let streamCamara = null;
let imagenBase64 = null;

// Al cargar la página, pedimos permiso y encendemos la cámara
window.addEventListener('DOMContentLoaded', iniciarCamara);

async function iniciarCamara() {
    try {
    // Pedimos la cámara trasera en móvil o tablet y cualquiera en escritorio
    streamCamara = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
    });
        document.getElementById('visor-camara').srcObject = streamCamara;
    } catch (error) {
        alert('No se pudo acceder a la cámara. Comprueba los permisos del navegador.');
        console.error(error);
    }
}

function capturarFoto() {
    const video  = document.getElementById('visor-camara');
    const canvas = document.getElementById('canvas-captura');
    const preview = document.getElementById('preview-captura');

  // Ajustamos tamaño
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;

  // "Dibujamos" el fotograma actual del vídeo en el canvas
    canvas.getContext('2d').drawImage(video, 0, 0);

  // Convertimos el canvas a base64 (formato JPEG, calidad 90%)
    imagenBase64 = canvas.toDataURL('image/jpeg', 0.9);

  // Mostramos la previsualización y ocultamos el vídeo
    preview.src = imagenBase64;
    preview.style.display = 'block';
    video.style.display = 'none';

  // Cambiamos los botones visibles
    document.getElementById('btn-capturar').style.display = 'none';
    document.getElementById('btn-repetir').style.display  = 'inline-flex';
    document.getElementById('btn-analizar').style.display = 'inline-flex';

  // Limpiamos el resultado anterior si lo hubiera
    document.getElementById('panel-resultado').style.display = 'none';
    document.getElementById('panel-resultado').textContent  = '';
}

function repetirFoto() {
  // Volvemos al estado inicial: vídeo activo, sin previsualización
    imagenBase64 = null;
    document.getElementById('preview-captura').style.display = 'none';
    document.getElementById('visor-camara').style.display = 'block';
    document.getElementById('btn-capturar').style.display = 'inline-flex';
    document.getElementById('btn-repetir').style.display  = 'none';
    document.getElementById('btn-analizar').style.display = 'none';
}

async function analizarPlanta() {
    if (!imagenBase64) return;

    const estadoIA  = document.getElementById('estado-ia');
    const panel     = document.getElementById('panel-resultado');
    const btnAnalizar = document.getElementById('btn-analizar');

  // Mostramos el indicador de carga
    estadoIA.style.display = 'block';
    btnAnalizar.disabled = true;
    panel.style.display = 'none';

    try {
    const respuesta = await fetch('http://localhost:3000/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen: imagenBase64 })
    });

    const datos = await respuesta.json();

    estadoIA.style.display = 'none';
    btnAnalizar.disabled = false;

    if (respuesta.ok) {
        panel.textContent = datos.diagnostico;
        panel.style.display = 'block';
    } else {
        panel.textContent = 'Error: ' + datos.message;
        panel.style.display = 'block';
    }

    } catch (error) {
        estadoIA.style.display = 'none';
        btnAnalizar.disabled = false;
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor.');
    }
}