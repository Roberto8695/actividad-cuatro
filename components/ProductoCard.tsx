import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Producto } from '../types';
import { useCarrito } from '../context/CarritoContext';

interface ProductoCardProps {
  producto: Producto;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  const { agregarProducto } = useCarrito();

  const handleAgregarCarrito = () => {
    if (producto.stock > 0) {
      agregarProducto(producto);
    }
  };

  return (
    <View style={styles.card}>
      {producto.imagenUrl && (
        <Image source={{ uri: producto.imagenUrl }} style={styles.imagen} />
      )}
      <View style={styles.contenido}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.descripcion}>{producto.descripcion}</Text>
        <Text style={styles.precio}>${producto.precio.toFixed(2)}</Text>
        <Text style={styles.stock}>Stock: {producto.stock}</Text>
        
        <TouchableOpacity
          style={[
            styles.boton,
            producto.stock === 0 && styles.botonDeshabilitado
          ]}
          onPress={handleAgregarCarrito}
          disabled={producto.stock === 0}
        >
          <Text style={styles.textoBoton}>
            {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  contenido: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  stock: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  boton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#ccc',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
