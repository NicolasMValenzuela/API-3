import React, { useState, useMemo } from "react";
import Card from "../components/Card";
import { useVehicles } from "../context/Vehicles";

const Catalogo = () => {
  const { vehicles: autos, loading, error } = useVehicles();
  
  const [orden, setOrden] = useState(""); 
  const [busqueda, setBusqueda] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [añoSeleccionado, setAñoSeleccionado] = useState("");
  const [precioRango, setPrecioRango] = useState(""); 
  const [kilometrajeRango, setKilometrajeRango] = useState("");

  const marcas = useMemo(() => {
    if (!autos.length) return [];
    return Array.from(new Set(autos.map((a) => a.marca))).sort();
  }, [autos]);
  
  const modelos = useMemo(() => {
    if (!autos.length) return [];
    return Array.from(new Set(autos.map((a) => a.modelo))).sort();
  }, [autos]);
  
  const años = useMemo(() => {
    if (!autos.length) return [];
    return Array.from(new Set(autos.map((a) => a.anio))).sort((a, b) => b - a);
  }, [autos]);

  const autosFiltrados = useMemo(() => {
    if (!autos.length) return [];
    
    let filtered = autos.filter((auto) => {
      // ... (toda tu lógica de filtrado se mantiene igual)
      const coincideBusqueda =
        auto.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        auto.modelo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideMarca = marcaSeleccionada ? auto.marca === marcaSeleccionada : true;
      const coincideModelo = modeloSeleccionado ? auto.modelo === modeloSeleccionado : true;
      const coincideAño = añoSeleccionado ? auto.anio === parseInt(añoSeleccionado, 10) : true;
      
      const coincideKm = (() => {
        if (!kilometrajeRango) return true;
        const [minStr, maxStr] = kilometrajeRango.split("-");
        const min = parseInt(minStr, 10) || 0;
        const max = maxStr === "*" ? Number.POSITIVE_INFINITY : parseInt(maxStr, 10);
        return auto.kilometraje >= min && auto.kilometraje <= max;
      })();

      const coincidePrecio = (() => {
        if (!precioRango) return true;
        const [minStr, maxStr] = precioRango.split("-");
        const min = parseInt(minStr, 10) || 0;
        const max = maxStr === "*" ? Number.POSITIVE_INFINITY : parseInt(maxStr, 10);
        if (typeof auto.precioBase !== "number") return false;
        return auto.precioBase >= min && auto.precioBase <= max;
      })();

      return coincideBusqueda && coincideMarca && coincideKm && coincidePrecio && coincideModelo && coincideAño;
    });

    // --- NUEVA LÓGICA DE ORDENAMIENTO MULTI-CRITERIO ---
    filtered.sort((a, b) => {
      const stockA = a.stock > 0;
      const stockB = b.stock > 0;

      // Criterio 1: Disponibilidad de stock (los que tienen stock van primero)
      if (stockA && !stockB) return -1; // 'a' va antes que 'b'
      if (!stockA && stockB) return 1;  // 'b' va antes que 'a'

      // Criterio 2: Orden seleccionado por el usuario (solo si ambos tienen o no tienen stock)
      if (orden === "precio") {
        return (a.precioBase ?? 0) - (b.precioBase ?? 0);
      }
      if (orden === "km") {
        return (a.kilometraje ?? 0) - (b.kilometraje ?? 0);
      }
      
      // Si no hay orden seleccionado, no se cambia el orden relativo
      return 0;
    });

    return filtered;

  }, [autos, busqueda, marcaSeleccionada, modeloSeleccionado, añoSeleccionado, kilometrajeRango, precioRango, orden]);

  if (loading) {
    return (
      <div className="w-full mx-auto mt-20 p-4 flex justify-center">
        <p className="text-xl">Cargando vehículos...</p>
      </div>
    );
  }
  
  // ... (el resto del componente se mantiene exactamente igual)
  const format = (n) => Number(n).toLocaleString();
  
  const priceRanges = [
    { label: `$0 - $${format(50000)}`, value: "0-50000" },
    { label: `$${format(50001)} - $${format(100000)}`, value: "50001-100000" },
    { label: `$${format(100001)} - $${format(200000)}`, value: "100001-200000" },
    { label: `$${format(200001)}+`, value: "200001-*" },
  ];
  
  const kmRangos = [
    { label: `0 - ${format(10000)} km`, value: "0-10000" },
    { label: `${format(10001)} - ${format(20000)} km`, value: "10001-20000" },
    { label: `${format(20001)} - ${format(50000)} km`, value: "20001-50000" },
    { label: `${format(50001)}+ km`, value: "50001-*" },
  ];

  return (
    <div className="w-full mx-auto mt-20 p-4 flex flex-col min-h-screen">
        <h2 className="flex justify-center font-bold text-2xl">Catálogo de autos en stock</h2>
        <h3 className="flex justify-center text-md mb-6">Encuentra el auto perfecto para ti</h3>
        <div>
            <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            className="mb-6 p-2 border border-gray-300 rounded w-full md:w-1/2 mx-auto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            />
        </div>
        
        <section className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md w-full">
            {/* Marca (dinámica desde el array) */}
            <select
              className="p-2 border border-gray-300 rounded bg-white"
              value={marcaSeleccionada}
              onChange={(e) => setMarcaSeleccionada(e.target.value)}
            >
                <option value="">Marca</option>
                {marcas.map((m, index) => (
                  <option key={`marca-${m}-${index}`} value={m}>{m}</option>
                ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded bg-white"
              value={modeloSeleccionado}
              onChange={(e) => setModeloSeleccionado(e.target.value)}
            >
                <option value="">Modelo</option>
                {modelos.map((m, index) => (
                  <option key={`modelo-${m}-${index}`} value={m}>{m}</option>
                ))}
            </select>
            <select className="p-2 border border-gray-300 rounded bg-white"
                value={añoSeleccionado}
                onChange={(e) => setAñoSeleccionado(e.target.value)}
            >
                <option value="">Año</option>
                {años.map((a, index) => (
                  <option key={`año-${a}-${index}`} value={a}>{a}</option>
                ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded bg-white"
              value={precioRango}
              onChange={(e) => setPrecioRango(e.target.value)}
            >
              <option value="">Precio</option>
              {priceRanges.map((r, index) => (
                <option key={`precio-${r.value}-${index}`} value={r.value}>{r.label}</option>
              ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded bg-white font-bold"
              value={kilometrajeRango}
              onChange={(e) => setKilometrajeRango(e.target.value)}
            >
              <option value="">Kilometraje</option>
              {kmRangos.map((r, index) => (
                <option key={`km-${r.value}-${index}`} value={r.value}>{r.label}</option>
              ))}
            </select>
        </section>
        <h3 className="mt-3">Ordenar por</h3>
        <div className="flex row justify-evenly gap-2 m-4">
                
      <button
        className={`px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer ${orden === "precio" ? "bg-blue-200 font-bold" : ""}`}
        onClick={() => setOrden("precio")}
      >
        Menor precio
      </button>
      <button
        className={`px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer ${orden === "km" ? "bg-blue-200 font-bold" : ""}`}
        onClick={() => setOrden("km")}
      >
        Menor KM
      </button>
            </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {autosFiltrados.map((vehiculo) => (
          <Card key={vehiculo.idVehiculo} vehiculo={vehiculo} />
        ))}
      </div>
    </div>
  );
};

export default Catalogo;