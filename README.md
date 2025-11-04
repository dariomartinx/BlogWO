# BlogWO

Frontend en React para administrar los blogs expuestos por la API ASP.NET incluida en el proyecto.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- API ASP.NET en ejecución (por defecto se asume `http://localhost:5000` con CORS habilitado)

## Puesta en marcha del frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación abrirá el panel en `http://localhost:3000`.

### Variables de entorno

La URL base de la API puede personalizarse creando un archivo `.env` en la carpeta `frontend` con la siguiente variable:

```bash
VITE_API_BASE_URL=https://localhost:7080
```

Si no se define, el frontend utilizará `http://localhost:5000` por defecto.

## Características

- Listado de blogs registrados en la API.
- Creación, edición y eliminación de blogs.
- Mensajes de retroalimentación para operaciones correctas o con errores.
- Formulario validado para URL y autor.
- Diseño adaptable listo para usarse como panel administrativo.
