<<<<<<< HEAD
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

Por defecto la API expone HTTP en `http://localhost:5000` y HTTPS en `https://localhost:5001`. El frontend rastrea automáticamente cualquier archivo `launchSettings.json` dentro de la carpeta `backend/` (sin importar el nivel de anidación) para detectar los puertos configurados por ASP.NET, priorizando HTTPS y, si no existe, usando HTTP. Además, probará varias URL típicas de ASP.NET (5000/5001, 7050 y 7262), recordando la primera que funcione. Si utilizas otros puertos o dominios, configura manualmente la URL como se describe más adelante.

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

La aplicación abrirá el panel en `http://localhost:3000`. Todas las llamadas a `/api/*` se proxyarán automáticamente hacia la API en `http://localhost:5000`, por lo que no tendrás que preocuparte por CORS durante el desarrollo local. Si tu API corre en otra dirección, crea un archivo `.env` en `frontend/` con la variable `VITE_DEV_PROXY_TARGET` para indicarla (por ejemplo `VITE_DEV_PROXY_TARGET=https://localhost:7050`).

### Configurar la URL de la API

Tienes dos opciones para indicar la dirección de tu API:

1. **Desde el panel:** pulsa el botón **Configurar API** (esquina superior del panel) y escribe la URL base que necesites. El valor se guardará en el navegador y puedes volver a la detección automática en cualquier momento.
2. **Mediante variable de entorno:** crea un archivo `.env` en la carpeta `frontend` con la siguiente variable:

   ```bash
   VITE_API_BASE_URL=https://localhost:5001
   ```

   Esta opción es útil cuando quieres compartir una configuración fija con el equipo.

Si ninguna de las opciones anteriores está definida, el frontend probará primero el mismo origen desde el que se sirve (ideal cuando publicas el frontend junto a la API o usas el proxy de desarrollo) y, si falla, recorrerá automáticamente las URL por defecto mencionadas arriba.

## Características del frontend

- Listado de blogs registrados en la API.
- Creación, edición y eliminación de blogs.
- Mensajes de retroalimentación para operaciones correctas o con errores.
- Formulario validado para URL y autor.
- Diseño adaptable listo para usarse como panel administrativo.
=======
# Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
>>>>>>> 677b7b9bec7f086e6291ae738b71e3a949c4399b
