import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const FormularioVehiculo = () => {
  const { id } = useParams(); // Para saber si es edición (id existe) o creación (id no existe)
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    color: '',
    numeroChasis: '',
    numeroMotor: '',
    precioBase: '',
    stock: '',
    anio: '',
    kilometraje: '',
    categoryId: ''
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar categorías al montar
  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadVehicle();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      console.log('🔄 Cargando categorías...');
      const response = await fetch('http://localhost:4002/categories');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📂 Categorías cargadas:', data);
        setCategories(data);
      } else {
        console.error('❌ Error status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error al cargar categorías:', error);
    }
  };

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4002/vehicles/${id}`);
      if (response.ok) {
        const vehicle = await response.json();
        setFormData({
          marca: vehicle.marca || '',
          modelo: vehicle.modelo || '',
          color: vehicle.color || '',
          numeroChasis: vehicle.numeroChasis?.toString() || '',
          numeroMotor: vehicle.numeroMotor?.toString() || '',
          precioBase: vehicle.precioBase?.toString() || '',
          stock: vehicle.stock?.toString() || '',
          anio: vehicle.anio?.toString() || '',
          kilometraje: vehicle.kilometraje?.toString() || '',
          categoryId: vehicle.category?.id?.toString() || ''
        });

        // Cargar imagen actual
        try {
          const imageResponse = await fetch(`http://localhost:4002/vehicles/${id}/image`);
          if (imageResponse.ok) {
            const imageBase64 = await imageResponse.text();
            setCurrentImage(`data:image/jpeg;base64,${imageBase64}`);
          }
        } catch (error) {
          console.error('Error al cargar imagen:', error);
        }
      }
    } catch (error) {
      console.error('Error al cargar vehículo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      setImageFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.marca.trim()) newErrors.marca = 'La marca es requerida';
    if (!formData.modelo.trim()) newErrors.modelo = 'El modelo es requerido';
    if (!formData.color.trim()) newErrors.color = 'El color es requerido';
    if (!formData.numeroChasis.trim()) newErrors.numeroChasis = 'El número de chasis es requerido';
    if (!formData.numeroMotor.trim()) newErrors.numeroMotor = 'El número de motor es requerido';
    if (!formData.precioBase || parseFloat(formData.precioBase) <= 0) {
      newErrors.precioBase = 'El precio debe ser mayor a 0';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }
    if (!formData.anio || parseInt(formData.anio) < 1900 || parseInt(formData.anio) > new Date().getFullYear() + 1) {
      newErrors.anio = 'Ingresa un año válido';
    }
    if (!formData.categoryId) newErrors.categoryId = 'Selecciona una categoría';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Preparar datos del vehículo
      const vehicleData = {
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        color: formData.color.trim(),
        numeroChasis: parseInt(formData.numeroChasis),
        numeroMotor: parseInt(formData.numeroMotor),
        precioBase: parseFloat(formData.precioBase),
        stock: parseInt(formData.stock),
        anio: parseInt(formData.anio),
        kilometraje: parseInt(formData.kilometraje) || 0,
        category: { id: parseInt(formData.categoryId) }
      };

      formDataToSend.append('vehicle', JSON.stringify(vehicleData));
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      if (isEditing) {
        const vehicleData = {
          marca: formData.marca.trim(),
          modelo: formData.modelo.trim(),
          color: formData.color.trim(),
          numeroChasis: parseInt(formData.numeroChasis),
          numeroMotor: parseInt(formData.numeroMotor),
          precioBase: parseFloat(formData.precioBase),
          stock: parseInt(formData.stock),
          anio: parseInt(formData.anio),
          kilometraje: parseInt(formData.kilometraje) || 0,
          category: { id: parseInt(formData.categoryId) }
        };

        response = await fetch(`http://localhost:4002/vehicles/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(vehicleData)
        });
      } else {
        // POST con FormData para incluir imagen
        const formDataToSend = new FormData();
        formDataToSend.append('vehicle', JSON.stringify(vehicleData));
        if (imageFile) formDataToSend.append('image', imageFile);

        response = await fetch('http://localhost:4002/vehicles', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formDataToSend
        });
      }


      if (response.ok) {
        alert(isEditing ? 'Vehículo actualizado exitosamente' : 'Vehículo creado exitosamente');
        navigate('/admin/vehiculos');
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        alert('Error al guardar el vehículo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del vehículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Vehículo' : 'Crear Nuevo Vehículo'}
          </h1>
          <button
            onClick={() => navigate('/admin/vehiculos')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Vehículo
            </label>
            {currentImage && (
              <div className="mb-4">
                <img 
                  src={currentImage} 
                  alt="Imagen actual" 
                  className="h-32 w-32 object-cover rounded-lg border"
                />
                <p className="text-sm text-gray-500 mt-1">Imagen actual</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Marca y Modelo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.marca ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Toyota"
              />
              {errors.marca && <p className="text-red-500 text-sm mt-1">{errors.marca}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.modelo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Corolla"
              />
              {errors.modelo && <p className="text-red-500 text-sm mt-1">{errors.modelo}</p>}
            </div>
          </div>

          {/* Color y Año */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.color ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Blanco"
              />
              {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.anio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 2023"
              />
              {errors.anio && <p className="text-red-500 text-sm mt-1">{errors.anio}</p>}
            </div>
          </div>

          {/* Números de Chasis y Motor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Chasis *
              </label>
              <input
                type="number"
                name="numeroChasis"
                value={formData.numeroChasis}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.numeroChasis ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Número único"
              />
              {errors.numeroChasis && <p className="text-red-500 text-sm mt-1">{errors.numeroChasis}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Motor *
              </label>
              <input
                type="number"
                name="numeroMotor"
                value={formData.numeroMotor}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.numeroMotor ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Número único"
              />
              {errors.numeroMotor && <p className="text-red-500 text-sm mt-1">{errors.numeroMotor}</p>}
            </div>
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Base *
              </label>
              <input
                type="number"
                name="precioBase"
                value={formData.precioBase}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.precioBase ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.precioBase && <p className="text-red-500 text-sm mt-1">{errors.precioBase}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Kilometraje y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilometraje
              </label>
              <input
                type="number"
                name="kilometraje"
                value={formData.kilometraje}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              {console.log('🏷️ Categories state:', categories, 'Length:', categories.length)}
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/vehiculos')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioVehiculo;