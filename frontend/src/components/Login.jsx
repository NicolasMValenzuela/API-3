import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthState } from '../redux/authSlice.js';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Leemos el estado global de Auth
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Si se loguea con éxito, redirigir al Home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    // Limpiamos errores al desmontar o cambiar
    return () => { dispatch(clearAuthState()) };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Disparamos la acción de Redux
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>
        
        {/* Mostrar mensaje de error si existe en Redux */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Deshabilitar si está cargando
            className={`w-full text-white py-3 rounded-md transition ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          ¿No tenés cuenta? <Link to="/registrarse" className="text-blue-600 hover:underline">Registrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;