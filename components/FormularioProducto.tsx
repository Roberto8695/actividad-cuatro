import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Producto } from '../types';
import { crearProducto, actualizarProducto } from '../services/firebase';

interface FormularioProductoProps {
  producto?: Producto | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

export default function FormularioProducto({ producto, onGuardado, onCancelar }: FormularioProductoProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio.toString());
      setStock(producto.stock.toString());
      setImagenUrl(producto.imagenUrl || '');
    } else {
      // Limpiar formulario para nuevo producto
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      setImagenUrl('');
    }
  }, [producto]);

  const validarFormulario = (): boolean => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del producto es requerido');
      return false;
    }
    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción del producto es requerida');
      return false;
    }
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número mayor a 0');
      return false;
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      Alert.alert('Error', 'El stock debe ser un número mayor o igual a 0');
      return false;
    }
    return true;
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) return;

    setCargando(true);
    try {
      const datosProducto = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        stock: Number(stock),
        imagenUrl: imagenUrl.trim() || undefined
      };

      if (producto) {
        // Actualizar producto existente
        await actualizarProducto(producto.id, datosProducto);
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        await crearProducto(datosProducto);
        Alert.alert('Éxito', 'Producto creado correctamente');
      }

      onGuardado();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      Alert.alert('Error', 'No se pudo guardar el producto');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formulario}>
        <Text style={styles.titulo}>
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </Text>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del producto"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción del producto"
            multiline
            numberOfLines={3}
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>Precio *</Text>
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            placeholder="0.00"
            keyboardType="numeric"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>Stock *</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="0"
            keyboardType="numeric"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>URL de Imagen</Text>
          <TextInput
            style={styles.input}
            value={imagenUrl}
            onChangeText={setImagenUrl}
            placeholder="https://ejemplo.com/imagen.jpg"
            editable={!cargando}
          />
        </View>

        <View style={styles.botones}>
          <TouchableOpacity
            style={[styles.boton, styles.botonCancelar]}
            onPress={onCancelar}
            disabled={cargando}
          >
            <Text style={styles.textoBotonCancelar}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonGuardar, cargando && styles.botonDeshabilitado]}
            onPress={manejarGuardar}
            disabled={cargando}
          >
            <Text style={styles.textoBotonGuardar}>
              {cargando ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formulario: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  campo: {
    marginBottom: 15,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputMultilinea: {
    height: 80,
    textAlignVertical: 'top',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  boton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  botonCancelar: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
  },
  botonDeshabilitado: {
    backgroundColor: '#ccc',
  },
  textoBotonCancelar: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  textoBotonGuardar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
