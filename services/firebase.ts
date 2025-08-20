import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Producto, Pedido, ProductoEnPedido } from '../types';

// Servicios para Productos
export const obtenerProductos = async (): Promise<Producto[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'productos'));
    const productos: Producto[] = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() } as Producto);
    });
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

export const actualizarStockProducto = async (productoId: string, nuevoStock: number): Promise<void> => {
  try {
    const productoRef = doc(db, 'productos', productoId);
    await updateDoc(productoRef, { stock: nuevoStock });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    throw error;
  }
};

// Servicios para Pedidos
export const crearPedido = async (pedido: Omit<Pedido, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'pedidos'), {
      ...pedido,
      fecha: Timestamp.fromDate(pedido.fecha)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

export const obtenerPedidosUsuario = async (usuarioId: string): Promise<Pedido[]> => {
  try {
    console.log('Obteniendo pedidos para usuario:', usuarioId);
    
    // Primero intentamos obtener todos los pedidos sin filtro para debugging
    const allPedidosQuery = collection(db, 'pedidos');
    const allSnapshot = await getDocs(allPedidosQuery);
    console.log('Total de pedidos en la base:', allSnapshot.size);
    
    // Simplificamos la consulta sin orderBy para evitar problemas de índices
    const q = query(
      collection(db, 'pedidos'), 
      where('usuarioId', '==', usuarioId)
    );
    const querySnapshot = await getDocs(q);
    console.log('Pedidos encontrados para el usuario:', querySnapshot.size);
    
    const pedidos: Pedido[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Datos del pedido:', data);
      pedidos.push({ 
        id: doc.id, 
        ...data,
        fecha: data.fecha.toDate()
      } as Pedido);
    });
    
    // Ordenamos en el cliente por fecha descendente
    pedidos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    
    console.log('Pedidos procesados:', pedidos);
    return pedidos;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

export const procesarPedido = async (productos: ProductoEnPedido[], usuarioId: string = 'usuario_default'): Promise<string> => {
  try {
    console.log('Procesando pedido para usuario:', usuarioId);
    console.log('Productos del pedido:', productos);
    
    // Calcular total
    const total = productos.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    console.log('Total calculado:', total);
    
    // Crear el pedido
    const nuevoPedido: Omit<Pedido, 'id'> = {
      usuarioId,
      fecha: new Date(),
      estado: 'pendiente',
      total,
      productos
    };
    
    console.log('Datos del nuevo pedido:', nuevoPedido);
    
    const pedidoId = await crearPedido(nuevoPedido);
    console.log('Pedido creado con ID:', pedidoId);
    
    // Actualizar stock de productos
    for (const item of productos) {
      const productosSnapshot = await getDocs(collection(db, 'productos'));
      const producto = productosSnapshot.docs.find(doc => doc.id === item.productoId);
      if (producto) {
        const stockActual = producto.data().stock;
        await actualizarStockProducto(item.productoId, stockActual - item.cantidad);
        console.log(`Stock actualizado para producto ${item.productoId}: ${stockActual} -> ${stockActual - item.cantidad}`);
      }
    }
    
    return pedidoId;
  } catch (error) {
    console.error('Error al procesar pedido:', error);
    throw error;
  }
};
