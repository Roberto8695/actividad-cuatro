import React, { useState } from 'react';
import { View, StyleSheet, Modal, SafeAreaView } from 'react-native';
import GestionProductos from '../../components/GestionProductos';
import FormularioProducto from '../../components/FormularioProducto';
import { Producto } from '../../types';

export default function AdminScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [refrescar, setRefrescar] = useState(0);

  const abrirFormularioNuevo = () => {
    setProductoEditando(null);
    setModalVisible(true);
  };

  const abrirFormularioEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setModalVisible(true);
  };

  const cerrarFormulario = () => {
    setModalVisible(false);
    setProductoEditando(null);
  };

  const onProductoGuardado = () => {
    cerrarFormulario();
    // Forzar recarga de la lista de productos
    setRefrescar(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestionProductos
        key={refrescar} // Esto fuerza la recarga del componente
        onCrearProducto={abrirFormularioNuevo}
        onEditarProducto={abrirFormularioEditar}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={cerrarFormulario}
      >
        <SafeAreaView style={styles.modalContainer}>
          <FormularioProducto
            producto={productoEditando}
            onGuardado={onProductoGuardado}
            onCancelar={cerrarFormulario}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
