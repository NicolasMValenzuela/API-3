import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthState } from "../redux/authSlice";

export default function Registrarse() {
  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    email: "",
    password: "",
    repetirPassword: "",
    telefono: "",
    documento: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Obtenemos estado de Redux
  const { loading, error, registerSuccess } = useSelector((state) => state.auth);

  // Efecto: Si el registro fue exitoso, redirigir al login
  useEffect(() => {
    if (registerSuccess) {
      alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      dispatch(clearAuthState()); // Reiniciamos el estado para la próxima
      navigate('/login');
    }
  }, [registerSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.repetirPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const { repetirPassword, nombre, ...restoData } = formData;
    
    const dataParaApi = {
      ...restoData,
      firstName: nombre.split(' ')[0] || '',
      lastName: nombre.split(' ').slice(1).join(' ') || '',
      telefono: parseInt(formData.telefono),
      documento: parseInt(formData.documento),
      role: 'USER'
    };

    // Acción Redux
    dispatch(registerUser(dataParaApi));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 pt-20">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear cuenta</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {typeof error === 'object' ? 'Error en el registro' : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... Tus inputs siguen igual ... */}
          <input type="text" name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="text" name="nombre" placeholder="Nombre y Apellido" value={formData.nombre} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="password" name="repetirPassword" placeholder="Repetir contraseña" value={formData.repetirPassword} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="number" name="documento" placeholder="Documento" value={formData.documento} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="number" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white py-3 rounded-md transition ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}