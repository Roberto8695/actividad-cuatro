import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CarritoItem, Producto } from '../types';

interface CarritoState {
  items: CarritoItem[];
  total: number;
}

type CarritoAction =
  | { type: 'AGREGAR_PRODUCTO'; payload: Producto }
  | { type: 'REMOVER_PRODUCTO'; payload: string }
  | { type: 'ACTUALIZAR_CANTIDAD'; payload: { productoId: string; cantidad: number } }
  | { type: 'LIMPIAR_CARRITO' };

interface CarritoContextType {
  state: CarritoState;
  agregarProducto: (producto: Producto) => void;
  removerProducto: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  limpiarCarrito: () => void;
  obtenerCantidadItems: () => number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

const carritoReducer = (state: CarritoState, action: CarritoAction): CarritoState => {
  switch (action.type) {
    case 'AGREGAR_PRODUCTO': {
      const existingItem = state.items.find(item => item.producto.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.producto.id === action.payload.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calcularTotal(updatedItems)
        };
      } else {
        const newItems = [...state.items, { producto: action.payload, cantidad: 1 }];
        return {
          ...state,
          items: newItems,
          total: calcularTotal(newItems)
        };
      }
    }
    
    case 'REMOVER_PRODUCTO': {
      const newItems = state.items.filter(item => item.producto.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calcularTotal(newItems)
      };
    }
    
    case 'ACTUALIZAR_CANTIDAD': {
      if (action.payload.cantidad <= 0) {
        const newItems = state.items.filter(item => item.producto.id !== action.payload.productoId);
        return {
          ...state,
          items: newItems,
          total: calcularTotal(newItems)
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.producto.id === action.payload.productoId
          ? { ...item, cantidad: action.payload.cantidad }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calcularTotal(updatedItems)
      };
    }
    
    case 'LIMPIAR_CARRITO':
      return {
        items: [],
        total: 0
      };
    
    default:
      return state;
  }
};

const calcularTotal = (items: CarritoItem[]): number => {
  return items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
};

const initialState: CarritoState = {
  items: [],
  total: 0
};

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(carritoReducer, initialState);

  const agregarProducto = (producto: Producto) => {
    dispatch({ type: 'AGREGAR_PRODUCTO', payload: producto });
  };

  const removerProducto = (productoId: string) => {
    dispatch({ type: 'REMOVER_PRODUCTO', payload: productoId });
  };

  const actualizarCantidad = (productoId: string, cantidad: number) => {
    dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { productoId, cantidad } });
  };

  const limpiarCarrito = () => {
    dispatch({ type: 'LIMPIAR_CARRITO' });
  };

  const obtenerCantidadItems = () => {
    return state.items.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CarritoContext.Provider
      value={{
        state,
        agregarProducto,
        removerProducto,
        actualizarCantidad,
        limpiarCarrito,
        obtenerCantidadItems
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};
