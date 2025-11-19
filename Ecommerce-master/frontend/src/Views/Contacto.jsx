import React, { useState } from "react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
    financiar: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Gracias por contactarnos. Pronto te responderemos.");
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      mensaje: "",
      financiar: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">
        Contáctanos
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4 border border-gray-200"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            placeholder="Ingresa tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            name="correo"
            placeholder="Ingresa tu correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            placeholder="Ingresa tu número de teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Mensaje
          </label>
          <textarea
            name="mensaje"
            placeholder="Escribe tu mensaje..."
            value={formData.mensaje}
            onChange={handleChange}
            rows="4"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          ></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="financiar"
            checked={formData.financiar}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />
          <label className="text-sm text-gray-700">
            Me gustaría recibir información sobre financiamiento
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Contacto;

