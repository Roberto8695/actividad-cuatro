# App de Gestión de Pedidos Online

Una aplicación móvil híbrida desarrollada con Expo y React Native que permite gestionar productos y pedidos con conexión a Firebase Firestore.

## 🚀 Características

- **Gestión de Productos**: Visualización de productos con nombre, descripción, precio, stock e imagen
- **Carrito de Compras**: Manejo de estado local para agregar/remover productos y modificar cantidades
- **Procesamiento de Pedidos**: Creación y almacenamiento de pedidos en Firebase Firestore
- **Historial de Pedidos**: Visualización del historial de pedidos del usuario
- **Actualización de Stock**: Actualización automática del stock al realizar pedidos
- **Interfaz Multiplataforma**: Compatible con Android, iOS y Web

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Firebase
- Android Studio (para compilar APK) o dispositivo Android con Expo Go

## 🛠️ Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Roberto8695/actividad-cuatro.git
cd AppPedidos
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Instalar Expo CLI (si no lo tienes)

```bash
npm install -g @expo/cli
```

## 🔥 Configuración de Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Firestore Database

### 2. Configurar Firestore Database

1. En Firebase Console, ve a **Firestore Database**
2. Crea la base de datos en modo **Test** (para desarrollo)
3. Ve a **Rules** y configura las reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso completo para desarrollo
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

### 3. Obtener Configuración de Firebase

1. En Firebase Console, ve a **Project Settings** (⚙️)
2. En la pestaña **General**, busca "Your apps"
3. Crea una app Web o selecciona una existente
4. Copia la configuración de Firebase

### 4. Configurar credenciales en la App

El archivo `firebaseConfig.js` ya está configurado con las credenciales del proyecto. Si necesitas usar tu propio proyecto de Firebase, actualiza las credenciales en este archivo:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF1234"
};
```

## 📊 Estructura de la Base de Datos

### Colección: `productos`
```javascript
{
  nombre: String,        // "Laptop Gamer MSI"
  descripcion: String,   // "Potente laptop gaming..."
  precio: Number,        // 1299.99
  stock: Number,         // 15
  imagenUrl: String      // URL de la imagen (opcional)
}
```

### Colección: `pedidos`
```javascript
{
  usuarioId: String,     // "usuario_default"
  fecha: Timestamp,      // Fecha del pedido
  estado: String,        // "pendiente", "procesando", "enviado", "entregado", "cancelado"
  total: Number,         // 1299.99
  productos: Array[{     // Array de productos en el pedido
    productoId: String,
    nombreProducto: String,
    precioUnitario: Number,
    cantidad: Number
  }]
}
```

## 🚀 Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm start
```

Esto iniciará el servidor de desarrollo de Expo. Podrás:

- Escanear el código QR con **Expo Go** (Android/iOS)
- Presionar `w` para abrir en el navegador web
- Presionar `a` para abrir en Android (requiere emulador o dispositivo conectado)

### Poblar Base de Datos con Datos de Ejemplo

1. Ejecuta la aplicación en modo desarrollo
2. Ve a la pestaña **"Productos"**
3. Si no hay productos, verás un botón **"Poblar Base de Datos"**
4. Presiona el botón para agregar productos de ejemplo

## 📱 Uso de la Aplicación

### 1. Visualizar Productos
- La pestaña **"Productos"** muestra todos los productos disponibles
- Cada producto muestra: nombre, descripción, precio, stock disponible
- Usa "Pull to refresh" para actualizar la lista

### 2. Agregar al Carrito
- Presiona **"Agregar al Carrito"** en cualquier producto
- El ícono del carrito mostrará la cantidad de items

### 3. Gestionar Carrito
- Ve a la pestaña **"Carrito"**
- Modifica cantidades con los botones + y -
- Elimina productos con el botón ✕
- Ve el total en tiempo real

### 4. Realizar Pedido
- En el carrito, presiona **"Realizar Pedido"**
- El sistema actualizará automáticamente el stock
- Recibirás confirmación con el ID del pedido

### 5. Ver Historial
- Ve a la pestaña **"Pedidos"**
- Visualiza todos tus pedidos con detalles
- Cada pedido muestra: fecha, estado, productos y total

## 📦 Generar APK

### Configuración Inicial

1. Instala EAS CLI:
```bash
npm install -g eas-cli
```

2. Inicia sesión en Expo:
```bash
eas login
```

### Generar APK

Para generar una APK de desarrollo:

```bash
eas build --platform android --profile preview
```

Para generar una APK de producción:

```bash
eas build --platform android --profile production
```

La configuración de build está en `eas.json`:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web
- `npm test` - Ejecuta las pruebas

## 🏗️ Arquitectura del Proyecto

```
AppPedidos/
├── app/                    # Pantallas de la aplicación (Expo Router)
│   ├── (tabs)/            # Navegación por pestañas
│   │   ├── index.tsx      # Pantalla de productos
│   │   ├── carrito.tsx    # Pantalla del carrito
│   │   └── pedidos.tsx    # Pantalla de pedidos
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── ProductoCard.tsx   # Tarjeta de producto
│   ├── CarritoItem.tsx    # Item del carrito
│   ├── PedidoCard.tsx     # Tarjeta de pedido
│   └── PoblarBaseDatos.tsx # Herramienta para poblar DB
├── context/               # Contextos de React
│   └── CarritoContext.tsx # Estado global del carrito
├── services/              # Servicios de Firebase
│   └── firebase.ts        # Operaciones de Firestore
├── types/                 # Definiciones TypeScript
│   └── index.ts           # Interfaces y tipos
├── firebaseConfig.js      # Configuración de Firebase
└── eas.json              # Configuración de EAS Build
```

## 🐛 Solución de Problemas

### Error: "Unable to resolve module react-native-reanimated"
- Asegúrate de tener todas las dependencias instaladas: `npm install`

### Error: "FirebaseError: Missing or insufficient permissions"
- Verifica que las reglas de Firestore estén configuradas correctamente
- Asegúrate de que la fecha de expiración sea posterior a hoy

### No aparecen productos
- Usa el botón "Poblar Base de Datos" en la pantalla de productos
- Verifica la conexión a internet
- Revisa la consola del navegador para errores

### Los pedidos no aparecen
- Verifica que las reglas de Firestore permitan lectura/escritura
- Revisa la consola para logs de debugging
- Asegúrate de que el `usuarioId` sea consistente

## 📄 Licencia

Este proyecto está desarrollado con fines educativos como parte de una actividad académica.

## 👥 Contribuciones

Este es un proyecto académico. Para sugerencias o mejoras, contacta al desarrollador.

---

**Desarrollado con:** React Native, Expo, TypeScript, Firebase Firestore
