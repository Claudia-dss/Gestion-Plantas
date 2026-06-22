# 🌿 Mi Jardín

Aplicación web para gestionar tus plantas y terrarios en casa. Registra tus plantas, lleva el control de sus cuidados y diagnostica sus problemas con inteligencia artificial.

---

## ✨ Funcionalidades

- **Mis Plantas** — Registra tus plantas con nombre, fecha de adquisición, foto, tipo, ubicación y estado.
- **Mis Terrarios** — Gestiona tus terrarios con la misma información.
- **Cuidados** — Lleva el seguimiento de riegos, fertilizaciones, cambios de tierra y pulverizaciones. Alerta visual cuando un cuidado está vencido.
- **Escáner IA** — Fotografía tu planta con la cámara del dispositivo y obtén un diagnóstico automático usando Google Gemini: tipo de planta, problemas detectados, causas y soluciones.
- **Buscador** — Filtra tus plantas en tiempo real por nombre.

---

## 🛠️ Tecnologías utilizadas

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [Google Fonts — Phudu](https://fonts.google.com/specimen/Phudu)

**Backend**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer) — subida de imágenes
- [mysql](https://www.npmjs.com/package/mysql) — conexión a base de datos
- [dotenv](https://www.npmjs.com/package/dotenv) — variables de entorno

**Base de datos**
- MySQL

**Inteligencia Artificial**
- [Google Gemini API](https://aistudio.google.com/) — diagnóstico visual de plantas (`gemini-1.5-flash`)

---

## 📁 Estructura del proyecto

```
mi-jardin/
├── public/
│   ├── plantas.html          # Página de inicio
│   ├── MisPlantas.html       # Gestión de plantas
│   ├── MisTerrarios.html     # Gestión de terrarios
│   ├── Cuidados.html         # Control de cuidados
│   ├── escaner.html          # Escáner con IA
│   └── estilos.css           # Estilos globales
├── js/
│   ├── referenciasplantitas.js
│   ├── referenciasterrarios.js
│   ├── cuidados.js
|   ├── conexion-bd.js            # Configuración de la base de datos
|   ├── server.js                 # Servidor Express y endpoints de la API
│   └── escaner.js
├── uploads/                  # Fotos subidas por el usuario (generada automáticamente)
├── .env                      # Variables de entorno (no subir a GitHub)
├── .gitignore
└── README.md
```

---

## ⚙️ Instalación y puesta en marcha

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://www.mysql.com/) en ejecución local
- Una API Key de [Google AI Studio](https://aistudio.google.com/) (gratuita)

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/mi-jardin.git
cd mi-jardin
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura la base de datos

Crea una base de datos en MySQL llamada `plantas_db` y ejecuta el siguiente script para crear las tablas:

```sql
CREATE DATABASE plantas_db;
USE plantas_db;

CREATE TABLE plantas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  adquirida DATE,
  foto VARCHAR(255),
  tipo VARCHAR(50),
  ubicacion VARCHAR(50),
  estado VARCHAR(20),
  ultimo_riego DATE,
  ultimo_fertilizante DATE,
  ultimo_cambio_tierra DATE,
  proximo_riego DATE,
  proxima_fertilizacion DATE,
  proximo_cambio_tierra DATE
);

CREATE TABLE terrarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  adquirida DATE,
  foto VARCHAR(255),
  ubicacion VARCHAR(50),
  estado VARCHAR(20),
  ultima_pulverizacion DATE,
  proxima_pulverizacion DATE
);
```

### 4. Crea el archivo .env

En la raíz del proyecto crea un archivo `.env` con el siguiente contenido:

```
GEMINI_API_KEY=tu_api_key_de_google_aqui
```

Obtén tu API Key gratuita en [aistudio.google.com](https://aistudio.google.com/).

### 5. Arranca el servidor

```bash
node server.js
```

Abre el navegador en [http://localhost:3000/plantas.html](http://localhost:3000/plantas.html).

---

## 🔒 Variables de entorno

| Variable | Descripción |
|---|---|
| `GEMINI_API_KEY` | API Key de Google Gemini para el diagnóstico de plantas |

La conexión a la base de datos se configura directamente en `conexion-bd.js`. Recuerda no subir credenciales reales a GitHub.

---

## 🚫 .gitignore recomendado

Asegúrate de tener un archivo `.gitignore` que excluya lo siguiente:

```
node_modules/
.env
uploads/
```

## 📄 Licencia

Este proyecto es de uso personal.

Librerías de terceros utilizadas bajo sus respectivas licencias:
- Bootstrap — [MIT License](https://github.com/twbs/bootstrap/blob/main/LICENSE)
- Google Fonts (Phudu) — [Open Font License](https://openfontlicense.org/)
- Google Gemini API — sujeta a los [Términos de Servicio de Google](https://ai.google.dev/gemini-api/terms)

---

## 👤 Autor

Desarrollado con ❤️ por [Clart] - 2024
