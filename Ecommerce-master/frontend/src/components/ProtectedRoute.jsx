import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const ProtectedRoute = ({ children, requiredRole = 'ADMIN' }) => {
  const { user, isAuthenticated } = useCarrito();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay datos del usuario aún (cargando), mostrar loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si el usuario no tiene el rol requerido, mostrar acceso denegado
  if (user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
            <p className="mb-4">
              No tienes permisos para acceder a esta página.
            </p>
            <p className="text-sm">
              Se requiere rol: <strong>{requiredRole}</strong>
            </p>
            <p className="text-sm">
              Tu rol actual: <strong>{user.role}</strong>
            </p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el componente
  return children;
};

export default ProtectedRoute;