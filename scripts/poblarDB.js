const { addDoc, collection } = require('firebase/firestore');
const { db } = require('../firebaseConfig.js');

const productosEjemplo = [
  {
    nombre: "Laptop Gamer MSI",
    descripcion: "Potente laptop gaming con RTX 3080, 16GB RAM, SSD 1TB",
    precio: 1299.99,
    stock: 5,
    imagenUrl: "https://via.placeholder.com/300x200?text=Laptop+Gamer"
  },
  {
    nombre: "Smartphone Samsung Galaxy",
    descripcion: "Último modelo Galaxy con cámara de 108MP y 128GB almacenamiento",
    precio: 699.99,
    stock: 10,
    imagenUrl: "https://via.placeholder.com/300x200?text=Samsung+Galaxy"
  },
  {
    nombre: "Auriculares Bluetooth Sony",
    descripcion: "Auriculares inalámbricos con cancelación de ruido activa",
    precio: 199.99,
    stock: 15,
    imagenUrl: "https://via.placeholder.com/300x200?text=Auriculares+Sony"
  },
  {
    nombre: "Tablet iPad Air",
    descripcion: "iPad Air de 10.9 pulgadas con chip M1 y 256GB",
    precio: 749.99,
    stock: 8,
    imagenUrl: "https://via.placeholder.com/300x200?text=iPad+Air"
  },
  {
    nombre: "Monitor Gaming 27\"",
    descripcion: "Monitor 4K 144Hz con HDR para gaming profesional",
    precio: 449.99,
    stock: 12,
    imagenUrl: "https://via.placeholder.com/300x200?text=Monitor+Gaming"
  },
  {
    nombre: "Teclado Mecánico RGB",
    descripcion: "Teclado mecánico con switches Cherry MX e iluminación RGB",
    precio: 129.99,
    stock: 20,
    imagenUrl: "https://via.placeholder.com/300x200?text=Teclado+RGB"
  }
];

const poblarBaseDatos = async () => {
  try {
    console.log('Iniciando poblado de base de datos...');
    
    for (const producto of productosEjemplo) {
      const docRef = await addDoc(collection(db, 'productos'), producto);
      console.log(`Producto agregado con ID: ${docRef.id} - ${producto.nombre}`);
    }
    
    console.log('Base de datos poblada exitosamente!');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  }
};

// Ejecutar el script
poblarBaseDatos();
