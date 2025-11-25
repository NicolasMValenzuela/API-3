// Función para obtener todos los vehículos
const fetchVehicles = async () => {
  try {
    const response = await fetch('http://localhost:4002/vehicles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const vehicles = await response.json();
    console.log('Vehículos obtenidos:', vehicles);
    return vehicles;
    
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return [];
  }
};

// Función para obtener la imagen de un vehículo específico
const getVehicleImage = async (vehicleId) => {
  try {
    const response = await fetch(`http://localhost:4002/vehicles/${vehicleId}/image`, {
      headers: {
        
      }
    });
    
    if (response.ok) {
      const imageBase64 = await response.text();
      return `data:image/jpeg;base64,${imageBase64}`;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    return null;
  }
};

// Función principal que carga vehículos con sus imágenes
const loadVehiclesWithImages = async () => {
  try {
    console.log('🚀 Iniciando carga de vehículos...');
    
    // PASO 1: Obtener vehículos
    const vehicles = await fetchVehicles();
    console.log(`📋 Obtenidos ${vehicles.length} vehículos`);
    
    // PASO 2: Obtener imágenes en paralelo
    console.log('🖼️ Cargando imágenes...');
    const vehiclesWithImages = await Promise.all(
      vehicles.map(async (vehicle, index) => {
        console.log(`   Cargando imagen ${index + 1}/${vehicles.length}...`);
        
        const image = await getVehicleImage(vehicle.idVehiculo);
        
        return {
          ...vehicle,              // Copia todos los campos originales
          imageUrl: image,         // Agrega la URL de la imagen
          hasImage: !!image        // Boolean helper
        };
      })
    );
    
    console.log('✅ Vehículos con imágenes cargados:', vehiclesWithImages);
    return vehiclesWithImages;
    
  } catch (error) {
    console.error('❌ Error en flujo completo:', error);
    return [];
  }
};

export default loadVehiclesWithImages;
