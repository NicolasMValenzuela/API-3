import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles, fetchVehicleImages } from '../redux/vehiclesSlice';

export const useVehicles = () => {
  const dispatch = useDispatch();
  const { items: vehicles = [], loading = false, error = null, fetched = false, imagesLoaded = false } = useSelector(state => state.vehicles || {});

  useEffect(() => {
    if (!loading && !fetched) {
      dispatch(fetchVehicles());
    }
  }, [dispatch, loading, fetched]);

  useEffect(() => {
    if (vehicles.length > 0 && fetched && !imagesLoaded) {
      const vehicleIds = vehicles.map(v => v.idVehiculo || v.id).filter(Boolean);
      if (vehicleIds.length > 0) {
        dispatch(fetchVehicleImages(vehicleIds));
      }
    }
  }, [vehicles, fetched, imagesLoaded, dispatch]);

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