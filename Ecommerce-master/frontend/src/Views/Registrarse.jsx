import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registrarse() {
  // 1. ACTUALIZAMOS EL ESTADO INICIAL
  const [formData, setFormData] = useState({
    username: "",
    firstName: "", // Antes era 'nombre'
    lastName: "",  // Nuevo campo
    email: "",
    password: "",
    repetirPassword: "",
    telefono: "",
    documento: "",
  });
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validamos que las contraseñas coincidan
    if (formData.password !== formData.repetirPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // 2. SIMPLIFICAMOS EL ENVÍO DE DATOS
    const { repetirPassword, ...dataParaApi } = formData;

    const payload = {
      ...dataParaApi,
      telefono: parseInt(dataParaApi.telefono),
      documento: parseInt(dataParaApi.documento),
      role: 'USER'
    };

    fetch("http://localhost:4002/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    .then((res) => {
        if (!res.ok) {
            return res.text().then(text => { throw new Error('Error en el registro: ' + (text || 'El usuario, email o documento ya pueden existir.')) });
        }
        return res.json();
    })
    .then(() => {
      alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      navigate('/login');
    })
    .catch((err) => {
      console.error("Error al registrarse:", err);
      alert(err.message);
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 pt-20">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          
          {/* 3. SEPARAMOS LOS INPUTS DE NOMBRE Y APELLIDO */}
          <input type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="password" name="repetirPassword" placeholder="Repetir contraseña" value={formData.repetirPassword} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="number" name="documento" placeholder="Documento" value={formData.documento} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="number" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}