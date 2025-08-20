import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CarritoItem } from '../types';
import { useCarrito } from '../context/CarritoContext';

interface CarritoItemComponentProps {
  item: CarritoItem;
}

export const CarritoItemComponent: React.FC<CarritoItemComponentProps> = ({ item }) => {
  const { actualizarCantidad, removerProducto } = useCarrito();

  const incrementarCantidad = () => {
    if (item.cantidad < item.producto.stock) {
      actualizarCantidad(item.producto.id, item.cantidad + 1);
    }
  };

  const decrementarCantidad = () => {
    if (item.cantidad > 1) {
      actualizarCantidad(item.producto.id, item.cantidad - 1);
    } else {
      removerProducto(item.producto.id);
    }
  };

  const subtotal = item.producto.precio * item.cantidad;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.producto.nombre}</Text>
        <Text style={styles.precio}>${item.producto.precio.toFixed(2)} c/u</Text>
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.controles}>
        <TouchableOpacity style={styles.botonCantidad} onPress={decrementarCantidad}>
          <Text style={styles.textoBoton}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.cantidad}>{item.cantidad}</Text>
        
        <TouchableOpacity 
          style={[
            styles.botonCantidad,
            item.cantidad >= item.producto.stock && styles.botonDeshabilitado
          ]} 
          onPress={incrementarCantidad}
          disabled={item.cantidad >= item.producto.stock}
        >
          <Text style={styles.textoBoton}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.botonEliminar}
        onPress={() => removerProducto(item.producto.id)}
      >
        <Text style={styles.textoEliminar}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  precio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  botonCantidad: {
    backgroundColor: '#2196F3',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#ccc',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cantidad: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonEliminar: {
    backgroundColor: '#f44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoEliminar: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
