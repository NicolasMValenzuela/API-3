import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Obtenemos los nuevos valores del contexto incluyendo user
  const { carrito, user, isAuthenticated, logout } = useCarrito(); 
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    navigate('/login'); // Redirige al login
    setIsMenuOpen(false); // Cerrar menú móvil al hacer logout
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/Inicio" className="text-white text-xl font-bold hover:text-blue-400 transition-colors">
              NewCar
            </Link>
          </div>

          {/* Menú de Escritorio */}
          <ul className="hidden md:flex items-baseline space-x-4">
            <li><Link to="/Inicio" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inicio</Link></li>
            <li><Link to="/catalogo" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Catálogo</Link></li>
            <li><Link to="/nosotros" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Nosotros</Link></li>
            <li><Link to="/contacto" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contacto</Link></li>
            
            {isAuthenticated ? (
              <>
                {/* Información del usuario y dropdown para ADMIN */}
                {user && (
                  <li className="flex items-center space-x-3">
                    <span className="text-gray-300 text-sm">
                      Hola, {user.firstName}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'ADMIN' ? 'VENDEDOR' : 'CLIENTE'}
                    </span>
                    
                    {/* Botón de gestión solo para ADMIN */}
                    {user.role === 'ADMIN' && (
                      <Link 
                        to="/admin/vehiculos" 
                        className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        Gestionar Vehículos
                      </Link>
                    )}
                  </li>
                )}
                
                <li>
                  <button onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </li>
                <li>
                  <Link to="/carrito" className="relative text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Carrito
                    {/* VERIFICACIÓN SEGURA: Chequeamos que carrito y carrito.items existan */}
                    {carrito && carrito.items && carrito.items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                        {carrito.items.length}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
              </li>
            )}
            {isAuthenticated && user && user.role === 'USER' && (
              <li>
                <Link to="/mis-pedidos" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Mis Pedidos
                </Link>
              </li>
            )}
            {isAuthenticated && user && user.role === 'ADMIN' && (
              <li>
                <Link to="/admin/pedidos" className="bg-yellow-500 text-black px-3 py-1 rounded text-sm hover:bg-yellow-400 transition-colors">
                  Gestionar Pedidos
                </Link>
              </li>
            )}
          </ul>

          {/* Botón Hamburguesa para Móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  // Icono X para cerrar
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // Icono hamburguesa
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-b-lg">
            <Link
              to="/Inicio"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Inicio
            </Link>
            <Link
              to="/catalogo"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Catálogo
            </Link>
            <Link
              to="/nosotros"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Nosotros
            </Link>
            <Link
              to="/contacto"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Contacto
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* Información del usuario en móvil */}
                {user && (
                  <div className="px-3 py-2 border-b border-gray-700 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        Hola, {user.firstName}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'ADMIN' ? 'VENDEDOR' : 'CLIENTE'}
                      </span>
                    </div>
                    
                    {/* Gestión para ADMIN en móvil */}
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin/vehiculos"
                        onClick={closeMenu}
                        className="mt-2 block bg-gray-700 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        Gestionar Vehículos
                      </Link>
                    )}
                  </div>
                )}
                
                <Link
                  to="/carrito"
                  onClick={closeMenu}
                  className="relative text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Carrito
                  {carrito && carrito.items && carrito.items.length > 0 && (
                    <span className="inline-block ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {carrito.items.length}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
            )}

            {isAuthenticated && user && user.role === 'USER' && (
              <Link to="/mis-pedidos" onClick={closeMenu} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Mis Pedidos
              </Link>
            )}
            {isAuthenticated && user && user.role === 'ADMIN' && (
              <Link to="/admin/pedidos" onClick={closeMenu} className="text-yellow-400 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Gestionar Pedidos
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;