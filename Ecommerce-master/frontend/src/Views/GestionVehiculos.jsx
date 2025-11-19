import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchConToken } from '../api/api';

const GestionVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Cargar vehículos al montar el componente
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4002/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehiculos(data);
      } else {
        console.error('Error al cargar vehículos');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar vehículos según búsqueda
  const filteredVehicles = vehiculos.filter(vehicle =>
    vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.numeroChasis?.toString().includes(searchTerm) ||
    vehicle.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Confirmar eliminación
  const confirmDelete = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  // Eliminar vehículo
  const deleteVehicle = async () => {
    if (!vehicleToDelete) return;

    try {
      const response = await fetchConToken(`/vehicles/${vehicleToDelete.idVehiculo}`, 'DELETE');
      if (response) {
        setVehiculos(prev => prev.filter(v => v.idVehiculo !== vehicleToDelete.idVehiculo));
        alert('Vehículo eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      alert('Error al eliminar el vehículo');
    } finally {
      setShowDeleteModal(false);
      setVehicleToDelete(null);
    }
  };

  // Obtener imagen del vehículo
  const getVehicleImage = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:4002/vehicles/${vehicleId}/image`);
      if (response.ok) {
        const imageBase64 = await response.text();
        return `data:image/jpeg;base64,${imageBase64}`;
      }
    } catch (error) {
      console.error('Error al obtener imagen:', error);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
        <Link
          to="/admin/vehiculos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <span className="mr-2">+</span>
          Agregar Vehículo
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por marca, modelo, chasis o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Vehículos</h3>
          <p className="text-3xl font-bold text-blue-900">{vehiculos.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">En Stock</h3>
          <p className="text-3xl font-bold text-green-900">
            {vehiculos.filter(v => v.stock > 0).length}
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Sin Stock</h3>
          <p className="text-3xl font-bold text-yellow-900">
            {vehiculos.filter(v => v.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Tabla de vehículos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio/Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.idVehiculo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">IMG</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {vehicle.marca} {vehicle.modelo}
                    </div>
                    <div className="text-sm text-gray-500">
                      {vehicle.color} • {vehicle.anio}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Chasis: {vehicle.numeroChasis}
                    </div>
                    <div className="text-sm text-gray-500">
                      Motor: {vehicle.numeroMotor}
                    </div>
                    <div className="text-sm text-gray-500">
                      Categoría: {vehicle.category?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${vehicle.precioBase?.toFixed(2) || '0.00'}
                    </div>
                    <div className={`text-sm ${vehicle.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Stock: {vehicle.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/admin/vehiculos/editar/${vehicle.idVehiculo}`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => confirmDelete(vehicle)}
                      className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron vehículos</p>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que deseas eliminar el vehículo:
                </p>
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {vehicleToDelete?.marca} {vehicleToDelete?.modelo}
                </p>
                <p className="text-sm text-gray-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={deleteVehicle}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionVehiculos;