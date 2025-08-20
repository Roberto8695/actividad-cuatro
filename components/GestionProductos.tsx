import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Producto } from '../types';
import { obtenerProductos, eliminarProducto } from '../services/firebase';

interface GestionProductosProps {
  onEditarProducto: (producto: Producto) => void;
  onCrearProducto: () => void;
}

export default function GestionProductos({ onEditarProducto, onCrearProducto }: GestionProductosProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosData = await obtenerProductos();
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  const onRefresh = () => {
    setRefrescando(true);
    cargarProductos();
  };

  const confirmarEliminar = (producto: Producto) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar "${producto.nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => manejarEliminar(producto.id),
        },
      ]
    );
  };

  const manejarEliminar = async (productoId: string) => {
    try {
      await eliminarProducto(productoId);
      setProductos(productos.filter(p => p.id !== productoId));
      Alert.alert('Éxito', 'Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  const renderProducto = ({ item }: { item: Producto }) => (
    <View style={styles.productoCard}>
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{item.nombre}</Text>
        <Text style={styles.productoDescripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <View style={styles.productoDetalles}>
          <Text style={styles.productoPrecio}>${item.precio.toFixed(2)}</Text>
          <Text style={styles.productoStock}>Stock: {item.stock}</Text>
        </View>
      </View>
      
      <View style={styles.acciones}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEditar]}
          onPress={() => onEditarProducto(item)}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => confirmarEliminar(item)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Gestión de Productos</Text>
        <TouchableOpacity
          style={styles.botonNuevo}
          onPress={onCrearProducto}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.textoBotonNuevo}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productos}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centrado}>
            <Text style={styles.textoVacio}>No hay productos disponibles</Text>
            <TouchableOpacity
              style={styles.botonCrearPrimero}
              onPress={onCrearProducto}
            >
              <Text style={styles.textoBotonCrearPrimero}>Crear primer producto</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={productos.length === 0 ? styles.listaVacia : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  botonNuevo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textoBotonNuevo: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  productoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productoInfo: {
    flex: 1,
    marginRight: 10,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productoDescripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  productoDetalles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productoPrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  productoStock: {
    fontSize: 14,
    color: '#666',
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botonAccion: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
  },
  botonEditar: {
    backgroundColor: '#E3F2FD',
  },
  botonEliminar: {
    backgroundColor: '#FFEBEE',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listaVacia: {
    flex: 1,
  },
  textoVacio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  botonCrearPrimero: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textoBotonCrearPrimero: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
