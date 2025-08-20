import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pedido } from '../types';

interface PedidoCardProps {
  pedido: Pedido;
}

export const PedidoCard: React.FC<PedidoCardProps> = ({ pedido }) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '#FF9800';
      case 'procesando': return '#2196F3';
      case 'enviado': return '#9C27B0';
      case 'entregado': return '#4CAF50';
      case 'cancelado': return '#f44336';
      default: return '#666';
    }
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.fecha}>{formatearFecha(pedido.fecha)}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(pedido.estado) }]}>
          <Text style={styles.estadoTexto}>{pedido.estado.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.total}>Total: ${pedido.total.toFixed(2)}</Text>
      
      <View style={styles.productos}>
        <Text style={styles.productosHeader}>Productos:</Text>
        {pedido.productos.map((producto, index) => (
          <View key={index} style={styles.productoItem}>
            <Text style={styles.productoNombre}>
              {producto.nombreProducto} x{producto.cantidad}
            </Text>
            <Text style={styles.productoPrecio}>
              ${(producto.precioUnitario * producto.cantidad).toFixed(2)}
            </Text>
          </View>
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fecha: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoTexto: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
  },
  productos: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  productosHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productoNombre: {
    fontSize: 14,
    flex: 1,
  },
  productoPrecio: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
