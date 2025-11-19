import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchConToken } from '../api/api';

const CarritoContext = createContext();

export function useCarrito() {
  return useContext(CarritoContext);
}

// Función para decodificar JWT (solo el payload, sin verificación)
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState({ items: [], isLoading: true });
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  // Función para obtener datos del usuario desde el JWT y backend
  const fetchUserData = async (token) => {
    try {
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.sub) {
        // Usar el username del JWT para buscar el usuario
        const response = await fetch(`http://localhost:4002/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const users = await response.json();
          const currentUser = users.find(u => u.username === decodedToken.sub);
          if (currentUser) {
            setUser({
              id: currentUser.idCliente,
              username: currentUser.username,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              email: currentUser.email,
              role: currentUser.role
            });
          }
        }
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (isAuthenticated && token) {
      // Obtener datos del usuario
      fetchUserData(token);
      
      // Obtener carrito
      fetchConToken('/carritos/mine')
        .then(data => {
          console.log('Respuesta del carrito:', data);
          const items = data?.items || [];
          const itemsMapeados = items.map(item => ({
              ...item,
              id: item.id || item.vehiculoId, // Usar id primero, luego vehiculoId como fallback
          }));
          setCarrito({ 
            ...data, 
            items: itemsMapeados,
            isLoading: false,
            error: null
          });
        })
        .catch(error => {
          console.error("Error al cargar el carrito:", error);
          
          // Manejo específico de errores
          if (error.message.includes('No se pudo conectar')) {
            console.warn('Backend no disponible, creando carrito temporal');
            setCarrito({ 
              items: [], 
              isLoading: false,
              error: 'backend_offline' 
            });
          } else if (error.message.includes('No autorizado')) {
            console.warn('Token inválido, redirigiendo a login');
            setIsAuthenticated(false);
            localStorage.removeItem('accessToken');
            setCarrito({ 
              items: [], 
              isLoading: false,
              error: 'unauthorized' 
            });
          } else {
            // Error general, carrito vacío pero funcional
            setCarrito({ 
              items: [], 
              isLoading: false,
              error: error.message 
            });
          }
        });
    } else {
      // Usuario no autenticado
      setCarrito({ 
        items: [], 
        isLoading: false,
        error: null 
      });
      setUser(null);
    }
  }, [isAuthenticated]);

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    fetchUserData(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
    setCarrito({ items: [], isLoading: false, error: null });
  };

  const agregarAlCarrito = (auto) => {
    if (!isAuthenticated || !carrito || !carrito.idCarrito) {
      console.warn('No se puede agregar al carrito: usuario no autenticado o carrito no disponible');
      return;
    }

    const itemParaApi = {
      vehiculo: { idVehiculo: auto.idVehiculo },
      valor: auto.precioBase,
      cantidad: 1,
    };

    fetchConToken(`/carritos/${carrito.idCarrito}/items`, 'POST', itemParaApi)
      .then(carritoActualizado => {
        const items = carritoActualizado?.items || [];
        const itemsMapeados = items.map(item => ({
            ...item,
            id: item.id || item.vehiculoId,
        }));
        setCarrito({ 
          ...carritoActualizado, 
          items: itemsMapeados,
          isLoading: false,
          error: null
        });
        alert(`${auto.marca} ${auto.modelo} agregado al carrito!`);
      })
      .catch(error => {
        console.error("Error al agregar al carrito:", error);
        alert(`Error al agregar al carrito: ${error.message}`);
      });
  };

  const quitarDelCarrito = (itemId) => {
    if (!isAuthenticated || !carrito) {
      console.warn('No se puede quitar del carrito: usuario no autenticado o carrito no disponible');
      return;
    }

    fetchConToken(`/carritos/items/${itemId}`, 'DELETE')
      .then(() => {
        setCarrito(prev => ({
          ...prev,
          items: prev.items.filter(item => item.id !== itemId)
        }));
      })
      .catch(error => {
        console.error("Error al quitar del carrito:", error);
        alert(`Error al quitar del carrito: ${error.message}`);
      });
  };

  const vaciarCarrito = () => {
    console.log("Funcionalidad de vaciar carrito pendiente de implementación en backend.");
  };

  const value = {
    carrito,
    user,
    isAuthenticated,
    login,
    logout,
    agregarAlCarrito,
    quitarDelCarrito,
    vaciarCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}