# E-Commerce - Backend

¡Bienvenidos a mi entrega final de mi proyecto Node.js del curso Backend I de Coderhouse!

En esta etapa del desarrollo, hemos integrado nuevas tecnologías como MongoDB, Mongoose y Handlebars para potenciar la gestión de productos y carritos. Además, seguimos aplicando el modelo MVC (Modelo-Vista-Controlador) para mantener la escalabilidad y organización del proyecto.

## Características

- Gestión avanzada de productos y carritos con MongoDB.
- Operaciones CRUD (crear, leer, actualizar y eliminar) para productos y carritos.
- **Populate** para obtener información enriquecida en consultas.
- Vistas dinámicas generadas con **Handlebars**.
- Persistencia de datos confiable mediante **MongoDB**.
- Manejo detallado de errores y respuestas para una mejor experiencia del cliente.
- Interfaz web interactiva y funcional para la gestión de productos y carritos.

## Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para manejar rutas y middleware.
- **Mongoose**: ODM (Object Data Modeling) para interactuar con MongoDB.
- **MongoDB**: Base de datos NoSQL para la persistencia de datos.
- **Handlebars**: Motor de plantillas para vistas dinámicas.

### Organización del Código
- **MVC (Modelo-Vista-Controlador)**: Estructura que separa la lógica de negocio, las vistas y el control de la aplicación.
- **Managers**: Clases dedicadas para gestionar la lógica de productos y carritos.

### Frontend
- **HTML, CSS, JavaScript**: Tecnologías básicas para la interfaz de usuario.
- **Handlebars**: Para generar vistas dinámicas en el servidor.

## Funcionalidades

### Productos
- Agregar nuevos productos con datos completos (nombre, precio, descripción, etc.).
- Actualizar propiedades específicas de un producto existente.
- Eliminar productos de la base de datos.
- Visualización paginada de productos con filtros y ordenamiento.

### Carritos
- Crear nuevos carritos vacíos.
- Agregar productos al carrito y gestionar sus cantidades.
- Eliminar productos específicos de un carrito.
- Vaciar completamente un carrito.
- Actualizar la cantidad de un producto dentro de un carrito.
- Obtener información detallada del carrito con datos enriquecidos de los productos.