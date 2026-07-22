# Patagonix Tech — AI Driven E-Commerce

SPA de e-commerce desarrollada para Patagonix Tech, con dos roles de usuario (customer y admin), catálogo de productos, carrito de compras, checkout simulado y panel de administración.

**🔗 Demo en producción:** https://proyecto-m5-rodriguez-melina.vercel.app/
**📦 Repositorio:** https://github.com/melinarodriguez03-source/ProyectoM5_RodriguezMelina


Tecnologías utilizadas
React 18 + TypeScript + Vite — base del frontend, con tipado estricto en toda la aplicación.
React Router — enrutamiento y protección de rutas por rol.
Tailwind CSS — estilos, con diseño mobile-first.
Context API + useReducer — manejo de estado global (autenticación y carrito).
Firebase Authentication — registro/login con email-password y Google, persistencia de sesión.
Firestore — base de datos de productos, órdenes y perfiles de usuario.
AWS S3 — almacenamiento de imágenes de productos.
Vercel Serverless Functions — intermediario seguro entre el frontend y AWS.
Vitest + React Testing Library — testing unitario y de hooks.
Vercel — hosting y despliegue continuo desde GitHub.
Arquitectura

El código se organiza por capas dentro de src/:

src/
├── components/   # UI reutilizable
├── contexts/     # Estado global (Auth, Cart) + reducers puros
├── hooks/        # useAuth, useCart, useDebounce, useTheme
├── pages/        # Rutas de la aplicación (incluye pages/admin)
├── router/       # Definición de rutas y protección por rol
├── services/     # Única capa que habla con Firebase/AWS
├── types/        # Interfaces y tipos compartidos
└── test/         # Configuración y utilidades de testing

Principio central: los componentes de página nunca llaman directo a Firebase — siempre pasan por un archivo en services/. Esto mantiene la lógica de negocio separada de la UI y hace que los servicios se puedan mockear en los tests sin renderizar componentes reales.

Instalación
bash
git clone <https://github.com/melinarodriguez03-source/ProyectoM5_RodriguezMelina>
cd patagonix-ecommerce
npm install
Variables de entorno

Crear un archivo .env en la raíz (usando .env.example como base) con:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Las credenciales de AWS (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME) no llevan el prefijo VITE_ y se configuran únicamente como variables de entorno del proyecto en Vercel — nunca en el .env del frontend, para que no terminen expuestas en el bundle del navegador.

.env está incluido en .gitignore.

Flujo de AWS S3 (subida de imágenes)
El admin selecciona una imagen en el formulario de producto.
El frontend llama a una Vercel Serverless Function (/api/get-upload-url), enviando nombre y tipo de archivo.
La función, ejecutándose del lado del servidor con las credenciales de AWS como variables de entorno privadas, genera una Presigned URL — una URL temporal (60 segundos de validez) con permiso de escritura sobre un objeto específico del bucket.
El frontend recibe esa URL y sube el archivo directamente a S3 con un PUT, sin que pase por ningún backend propio.
La URL pública final del objeto se guarda en Firestore, en el campo image del producto.

Este diseño garantiza que las credenciales de AWS nunca se expongan en el frontend — si estuvieran embebidas en el código del navegador, cualquiera podría extraerlas inspeccionando el bundle de JavaScript.

Deploy

El proyecto se despliega en Vercel, con integración continua desde GitHub: cada push a la rama principal dispara un build y deploy automático. Las variables de entorno se configuran en el dashboard de Vercel (Settings → Environment Variables), separando las públicas (VITE_*, usadas en el build del cliente) de las privadas (usadas solo por las Serverless Functions).

Decisiones técnicas

Context API + useReducer, en vez de una librería externa de estado global: el proyecto tiene solo dos dominios de estado global bien acotados (sesión y carrito), sin necesidad de middleware ni manejo de cientos de acciones. useReducer obliga a expresar cada cambio como una acción explícita, lo que hace el comportamiento predecible y fácil de testear de forma aislada — en particular, el reducer del carrito es una función pura sin dependencias de React, lo que permite testearlo con inputs/outputs directos, sin renderizar componentes.

AWS S3 con flujo de Presigned URLs, en vez de subir imágenes directo a Firestore o exponer credenciales en el cliente: separa el almacenamiento de archivos binarios (S3) de los datos estructurados (Firestore), y evita el riesgo de seguridad de manejar credenciales de un proveedor cloud en código que corre en el navegador de cualquier usuario.

Roles guardados en Firestore, no en Firebase Auth: Firebase Authentication no tiene concepto nativo de roles — solo maneja identidad. El rol se modela como un campo en un documento users/{uid}, lo que además permite que las Firestore Security Rules lo validen del lado del servidor, en vez de depender únicamente de que el frontend oculte o muestre ciertas rutas.

Desnormalización de datos de producto dentro de cada orden: al crear una orden, se copian los datos del producto (nombre, imagen, precio, stock) en vez de solo guardar una referencia (productId). Esto asegura que una orden refleje el precio real pagado en el momento de la compra, incluso si el precio del producto cambia después, y evita tener que hacer consultas adicionales a products cada vez que se muestra el historial de compras.

Uso de IA
Toda la asistencia de IA para este proyecto se realizó en una única conversación con Claude, usada como par de planificación, revisión de arquitectura y resolución de errores durante el desarrollo.
Se adjuntan 5 ejemplos de prompts que utilicé para realizar el proyecto
![prompt1](src/assets/claude%201.png)
![prompt2](src/assets/claude%202.png)
![prompt2](src/assets/claude%203.png)
![prompt2](src/assets/claude%204.png)
![prompt2](src/assets/claude%205.png)
