import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const Card = ({ vehiculo }) => {
  const { agregarAlCarrito } = useCarrito();

  // --- LÓGICA DE PROTECCIÓN AÑADIDA ---
  // Si el stock es nulo o indefinido, lo consideramos 0.
  const stock = vehiculo.stock ?? 0;
  const sinStock = stock <= 0;

  // Si el precio o el kilometraje son nulos, les asignamos 0 por defecto.
  const precioBase = vehiculo.precioBase ?? 0;
  const kilometraje = vehiculo.kilometraje ?? 0;

  return (
    <div className="relative group">
      {/* Etiqueta de Agotado */}
      {sinStock && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
          AGOTADO
        </div>
      )}

      <div className={`bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition ${sinStock ? 'opacity-50' : ''}`}>
        {vehiculo.imageUrl ? (
          <img className="w-full h-48 object-cover" src={vehiculo.imageUrl} alt={`${vehiculo.marca} ${vehiculo.modelo}`} />
        ) : (
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            {/* ... SVG de imagen no encontrada ... */}
          </div>
        )}
        <div className="p-4">
            <h3 className="text-white font-semibold text-lg">{`${vehiculo.marca} ${vehiculo.modelo}`}</h3>
            
            {/* Ahora usamos las variables seguras */}
            <h3 className="text-white font-semibold text-lg">{`$${precioBase.toLocaleString()}`}</h3>
            <p className="text-gray-400 text-sm">{`${vehiculo.anio}, ${kilometraje.toLocaleString()} km`}</p>
            
            <Link to={`/catalogo/${vehiculo.idVehiculo}`}>
              <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded ease-in delay-100 transition-colors cursor-pointer">
                Ver más
              </button>
            </Link>
        </div>
      </div>

      {!sinStock && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            agregarAlCarrito(vehiculo);
          }}
          className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Agregar al carrito"
        >
          {/* ... SVG del carrito ... */}
        </button>
      )}
    </div>
  );
};

export default React.memo(Card);