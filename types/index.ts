export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
}

export interface ProductoEnPedido {
  productoId: string;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
}

export interface Pedido {
  id?: string;
  usuarioId: string;
  fecha: Date;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  productos: ProductoEnPedido[];
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}
