import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from '@/components/Themed';
import { PedidoCard } from '@/components/PedidoCard';
import { obtenerPedidosUsuario } from '@/services/firebase';
import { Pedido } from '@/types';

const USUARIO_ID = 'usuario_default'; // En una app real, esto vendría de la autenticación

export default function PedidosScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarPedidos = async () => {
    try {
      console.log('Cargando pedidos...');
      const pedidosData = await obtenerPedidosUsuario(USUARIO_ID);
      console.log('Pedidos cargados:', pedidosData);
      setPedidos(pedidosData);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Recargar pedidos cuando la pantalla esté en foco
  useFocusEffect(
    React.useCallback(() => {
      cargarPedidos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarPedidos();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => <PedidoCard pedido={item} />}
        contentContainerStyle={pedidos.length === 0 ? styles.emptyContainer : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes pedidos aún</Text>
            <Text style={styles.emptySubtext}>Realiza tu primer pedido desde la tienda</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
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
});
