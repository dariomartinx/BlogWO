# BlogWO

Aplicación completa para administrar blogs, compuesta por una API ASP.NET Core (carpeta `backend`) y un frontend en React (carpeta `frontend`).

## Requisitos previos

- .NET 7 SDK o superior para ejecutar la API.
- SQL Server accesible según la cadena de conexión definida en `backend/appsettings.json`.
- Node.js 18 o superior y npm 9 o superior para el frontend.

## Estructura del proyecto

```
backend/   # API ASP.NET Core (proporcionada por el usuario)
frontend/  # Panel administrativo en React
```

Ambas aplicaciones pueden convivir sin conflicto en este repositorio siempre que se ejecuten desde sus carpetas correspondientes.

## Puesta en marcha del backend

1. Abre una terminal y sitúate en la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Restaura dependencias y aplica migraciones (si aún no lo hiciste):
   ```bash
   dotnet restore
   dotnet ef database update
   ```
3. Ejecuta la API:
   ```bash
   dotnet run
   ```

> **Nota:** la API está configurada para aceptar solicitudes desde `http://localhost:3000` mediante la directiva CORS `AllowReactApp`. Si decides cambiar el puerto del frontend, actualiza también la política en `Program.cs`.

Por defecto la API expone HTTP en `http://localhost:5000` y HTTPS en `https://localhost:5001`. Asegúrate de que estos endpoints coincidan con la URL configurada en el frontend.

## Puesta en marcha del frontend

1. Abre otra terminal y sitúate en la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala dependencias y ejecuta el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```

La aplicación abrirá el panel en `http://localhost:3000`.

### Variables de entorno

La URL base de la API puede personalizarse creando un archivo `.env` en la carpeta `frontend` con la siguiente variable:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

Si no se define, el frontend utilizará `http://localhost:5000` por defecto. En caso de que la API se ejecute en HTTPS, actualiza la variable para reflejar la URL segura (`https://localhost:5001`).

## Características del frontend

- Listado de blogs registrados en la API.
- Creación, edición y eliminación de blogs.
- Mensajes de retroalimentación para operaciones correctas o con errores.
- Formulario validado para URL y autor.
- Diseño adaptable listo para usarse como panel administrativo.
