import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles, fetchVehicleImages } from '../redux/vehiclesSlice';

// Hook de compatibilidad: expone vehicles, loading, error y getVehicleById
export const useVehicles = () => {
  const dispatch = useDispatch();
  const { items: vehicles = [], loading = false, error = null, fetched = false } = useSelector(state => state.vehicles || {});

  useEffect(() => {
    if (!loading && !fetched) {
      dispatch(fetchVehicles());
    }
  }, [dispatch, loading, fetched]);

  // Cargar imágenes cuando los vehículos estén disponibles
  useEffect(() => {
    if (vehicles.length > 0 && fetched) {
      const vehicleIds = vehicles.map(v => v.idVehiculo || v.id).filter(Boolean);
      if (vehicleIds.length > 0) {
        dispatch(fetchVehicleImages(vehicleIds));
      }
    }
  }, [vehicles, fetched, dispatch]);

  const getVehicleById = (id) => {
    if (!vehicles) return null;
    const n = Number(id);
    return vehicles.find(v => v.id === n || v.idVehiculo === n || String(v.id) === String(id));
  };

  return { vehicles, loading, error, getVehicleById };
};

export const VehiclesProvider = ({ children }) => {
  return <>{children}</>;
};