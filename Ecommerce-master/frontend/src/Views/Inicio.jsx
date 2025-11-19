import React from 'react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../context/Vehicles';

const Inicio = () => {
  const { vehicles, loading, error } = useVehicles();

  // --- LÍNEA CORREGIDA ---
  // Primero filtramos los vehículos que tienen stock y luego tomamos los 3 primeros.
  const featuredCars = vehicles.filter(v => v.stock > 0).slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white text-gray-900 min-h-screen pt-24 flex justify-center items-center">
        <div className="text-xl">Cargando vehículos destacados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-gray-900 min-h-screen pt-24 flex justify-center items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen pt-24">
      <div className="flex flex-col justify-center items-center h-[350px] bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center drop-shadow">
          Experimenta el Futuro de la Conducción
        </h1>
        <p className="text-lg max-w-xl text-gray-700 text-center">
          Descubre una selección de vehículos premium, meticulosamente diseñados para rendimiento y lujo. En NewCar, redefinimos la experiencia automotriz, ofreciendo un servicio inigualable y un proceso de compra en línea sin problemas.
        </p>
      </div>

      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6">Autos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredCars.map((car, index) => (
            <div key={`featured-car-${car.idVehiculo || car.id || index}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              {car.imageUrl ? (
                <img 
                  src={car.imageUrl} 
                  alt={`${car.marca} ${car.modelo}`} 
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  {/* ... SVG ... */}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{car.marca} {car.modelo} {car.anio}</h3>
                <p className="text-gray-500 mb-4">KM: {car.kilometraje.toLocaleString()}</p>
                <Link
                  to={`/catalogo/${car.idVehiculo || car.id}`}
                  className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Ver Más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;