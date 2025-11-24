import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles } from '../redux/vehiclesSlice';

// Hook de compatibilidad: expone vehicles, loading, error y getVehicleById
export const useVehicles = () => {
  const dispatch = useDispatch();
  const { items: vehicles = [], loading = false, error = null, fetched = false } = useSelector(state => state.vehicles || {});

  useEffect(() => {
    if (!loading && !fetched) {
      dispatch(fetchVehicles());
    }
  }, [dispatch, loading, fetched]);

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