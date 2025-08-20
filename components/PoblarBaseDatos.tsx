import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { crearProducto, obtenerProductos } from '../services/firebase';

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

export const PoblarBaseDatos: React.FC = () => {
  const [poblando, setPoblando] = useState(false);

  const verificarProductosExistentes = async (): Promise<boolean> => {
    try {
      const productos = await obtenerProductos();
      return productos.length > 0;
    } catch (error) {
      console.error('Error al verificar productos:', error);
      return false;
    }
  };

  const poblarBaseDatos = async () => {
    setPoblando(true);
    try {
      console.log('Verificando productos existentes...');
      const hayProductos = await verificarProductosExistentes();
      
      if (hayProductos) {
        Alert.alert(
          'Productos existentes',
          'Ya hay productos en la base de datos. ¿Quieres agregar más productos de ejemplo?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Agregar', onPress: () => agregarProductos() }
          ]
        );
        setPoblando(false);
        return;
      }

      await agregarProductos();
    } catch (error) {
      console.error('Error al poblar la base de datos:', error);
      Alert.alert('Error', 'No se pudo poblar la base de datos');
    } finally {
      setPoblando(false);
    }
  };

  const agregarProductos = async () => {
    try {
      console.log('Iniciando poblado de base de datos...');
      
      for (const producto of productosEjemplo) {
        const productoId = await crearProducto(producto);
        console.log(`Producto agregado con ID: ${productoId} - ${producto.nombre}`);
      }
      
      Alert.alert('Éxito', 'Productos agregados exitosamente!');
      console.log('Base de datos poblada exitosamente!');
    } catch (error) {
      console.error('Error al agregar productos:', error);
      Alert.alert('Error', 'No se pudieron agregar los productos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Herramientas de Desarrollo</Text>
      <TouchableOpacity
        style={[styles.boton, poblando && styles.botonDeshabilitado]}
        onPress={poblarBaseDatos}
        disabled={poblando}
      >
        <Text style={styles.textoBoton}>
          {poblando ? 'Poblando...' : 'Poblar Base de Datos'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.descripcion}>
        Presiona este botón para agregar productos de ejemplo a la base de datos
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginBottom: 12,
  },
  botonDeshabilitado: {
    backgroundColor: '#ccc',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descripcion: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});
