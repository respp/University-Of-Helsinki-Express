Desglosando el funcionamiento de la app:

1. index.js: Este archivo es el punto de entrada de la aplicación. Aquí se inicializa la aplicación Express y se la configura para escuchar las solicitudes en un puerto específico. También se importan los módulos necesarios para la configuración del puerto y se utiliza un logger para registrar mensajes sobre el estado de la aplicación a través de consoles.

2. app.js: Aquí se define la lógica principal de la aplicación Express. Se importan los módulos necesarios, como express, mongoose, y los controladores de las rutas (blogsRouter). Se establecen las configuraciones iniciales, como la conexión a la base de datos MongoDB y la configuración de middleware, como cors y el análisis de JSON. Luego, se define la ruta /api/blogs y se asocia con el router de blogs (blogsRouter). Finalmente, se exporta la aplicación Express para que pueda ser utilizada por otros módulos.

3. utils: Esta carpeta contiene archivos de utilidad que se utilizan en la aplicación.
En este caso están:
- config.js contiene la configuración de la aplicación, como el puerto y la URL de la base de datos MongoDB
- logger.js contiene funciones para registrar mensajes de registro
- list_helper.js contiene funciones auxiliares para realizar cálculos relacionados con los blogs, como calcular el total de likes y encontrar el blog favorito.

