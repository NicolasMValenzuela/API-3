import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Views/Navbar";
import Catalogo from "./Views/Catalogo";
import Login from "./components/Login";
import Contacto from "./Views/Contacto";
import Inicio from './Views/Inicio';
import AboutUs from './Views/AboutUs';
import Registrarse from "./Views/Registrarse";
import AutoDetalle from "./Views/AutoDetalle";
import Carrito from "./Views/Carrito";
import GestionVehiculos from "./Views/GestionVehiculos";
import FormularioVehiculo from "./Views/FormularioVehiculo";
import ProtectedRoute from "./components/ProtectedRoute";
import { CarritoProvider } from "./context/CarritoContext";
import { VehiclesProvider } from "./context/Vehicles";
import MisPedidos from "./Views/MisPedidos";
import GestionPedidos from "./Views/GestionPedidos";

function App() {
  return (
    <VehiclesProvider>
      <CarritoProvider>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Nosotros" element={<AboutUs />} />
          <Route path="/registrarse" element={<Registrarse />} />
          <Route path="/catalogo/:id" element={<AutoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          
          {/* Rutas protegidas para ADMIN */}
          <Route 
            path="/admin/vehiculos" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <GestionVehiculos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/vehiculos/nuevo" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <FormularioVehiculo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/vehiculos/editar/:id" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <FormularioVehiculo />
              </ProtectedRoute>
            } 
          />
          {/* Rutas de Pedidos */}
          <Route 
            path="/mis-pedidos"
            element={
              <ProtectedRoute requiredRole="USER">
                <MisPedidos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/pedidos"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <GestionPedidos />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </CarritoProvider>
    </VehiclesProvider>
  );
}

export default App;
