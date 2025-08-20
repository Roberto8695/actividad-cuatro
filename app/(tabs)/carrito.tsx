import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { CarritoItemComponent } from '@/components/CarritoItem';
import { useCarrito } from '@/context/CarritoContext';
import { procesarPedido } from '@/services/firebase';
import { ProductoEnPedido } from '@/types';

export default function CarritoScreen() {
  const { state, limpiarCarrito } = useCarrito();
  const [procesando, setProcesando] = useState(false);
  const router = useRouter();

  const realizarPedido = async () => {
    if (state.items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos al carrito antes de realizar un pedido');
      return;
    }

    setProcesando(true);
    try {
      const productosParaPedido: ProductoEnPedido[] = state.items.map(item => ({
        productoId: item.producto.id,
        nombreProducto: item.producto.nombre,
        precioUnitario: item.producto.precio,
        cantidad: item.cantidad
      }));

      console.log('Enviando pedido con productos:', productosParaPedido);
      const pedidoId = await procesarPedido(productosParaPedido);
      
      Alert.alert(
        'Pedido realizado',
        `Tu pedido #${pedidoId.substring(0, 8)} ha sido procesado exitosamente`,
        [
          {
            text: 'Ver Pedidos',
            onPress: () => {
              limpiarCarrito();
              router.push('/pedidos');
            }
          },
          {
            text: 'OK',
            onPress: () => limpiarCarrito()
          }
        ]
      );
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      Alert.alert('Error', 'No se pudo procesar el pedido. Intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtext}>Agrega productos para comenzar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.items}
        keyExtractor={(item) => item.producto.id}
        renderItem={({ item }) => <CarritoItemComponent item={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${state.total.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.pedidoButton, procesando && styles.pedidoButtonDisabled]}
          onPress={realizarPedido}
          disabled={procesando}
        >
          <Text style={styles.pedidoButtonText}>
            {procesando ? 'Procesando...' : 'Realizar Pedido'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  pedidoButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  pedidoButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pedidoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
