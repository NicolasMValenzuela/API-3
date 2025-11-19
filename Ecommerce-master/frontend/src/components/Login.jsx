import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // El estado ya existía, ahora lo usaremos
  const { login } = useCarrito();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { username, password };

    fetch('http://localhost:4002/api/v1/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })
    .then(response => {
        if (!response.ok) throw new Error('Usuario o contraseña incorrectos.');
        return response.json();
    })
    .then(data => {
        login(data.access_token);
        alert('¡Bienvenido!');
        navigate('/');
    })
    .catch(error => {
        console.error('Error en el login:', error);
        alert(error.message);
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>
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
          
          {/* CAMPO DE CONTRASEÑA AGREGADO */}
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
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Entrar
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