🌱Gestión Inteligente de Plantas.
Aplicación web diseñada para amantes de la botánica que buscan llevar un control riguroso de sus compañeras verdes. Desde el seguimiento de riegos hasta la planificación de fertilización, esta herramienta te asegura que ninguna planta se quede en el olvido.

✨ Características Principales.
-Inventario Detallado: Registra el nombre, la foto y la fecha de adquisición de cada planta.
-Panel de Cuidados Dinámico: El sistema detecta automáticamente cuándo se ha pasado la fecha programada de riego, fertilización o trasplante, moviendo la planta a una Tabla de Cuidados   prioritarios.
-Historial Completo: Registro de la última vez que realizaste cada acción esencial.

🛠️ Tecnologías Utilizadas.
-Frontend: HTML5, CSS3 (Diseño responsivo) y JavaScript (Lógica de interfaz).
-Backend: Node.js para la comunicación con el servidor. 
-Base de Datos: MySQL para el almacenamiento persistente de las plantas y sus ciclos.

📋 Estructura de la Base de Datos.
Para que el sistema de alertas funcione, la base de datos sigue una lógica de intervalos:CampoTipoDescripciónnombre_plantaVARCHARNombre común o científico.fecha_adquisicionDATECuándo llegó a casa.ultimo_riegoDATEFecha de la última hidratación.frecuencia_riegoINTDías recomendados entre riegos.estado_saludBOOLEANIndica si la planta está sana (True/False).

🚀 Roadmap (Próximas Mejoras).
El proyecto está en constante evolución. Los próximos pasos incluyen:
-Integración de IA: Implementación de un modelo de visión por computadora para identificar enfermedades, plagas o carencias nutricionales mediante fotos.
-Sistema de Notificaciones: Alertas push para recordarte que es hora de regar.
-Comunidad: Diccionario de cuidados por especie integrado.

⚙️ Instalación.
1. Clona el repositorio.
2. Importa el archivo database.sql en tu servidor MySQL.
3. Configura tus credenciales en el archivo de conexión.
4. ¡Abre index.html y empieza a cuidar tus plantas!
  

Desarrollado con ❤️ por [Clart] - 2024
