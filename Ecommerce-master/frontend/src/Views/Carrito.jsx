import React, { useState, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchConToken } from "../api/api";

export default function Carrito() {
  const { carrito, quitarDelCarrito, isAuthenticated } = useCarrito();
  const navigate = useNavigate();
  const [formaDePago, setFormaDePago] = useState("TARJETA");

  const { subtotal, descuento, total } = useMemo(() => {
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      return { subtotal: 0, descuento: 0, total: 0 };
    }

    const sub = carrito.items.reduce((acc, item) => acc + (item.valor || 0), 0);
    
    let desc = 0;
    if (formaDePago === 'EFECTIVO') {
      desc = sub * 0.10; // 10% de descuento
    } else if (formaDePago === 'TRANSFERENCIA') {
      desc = sub * 0.05; // 5% de descuento
    }
    
    const tot = sub - desc;

    return { subtotal: sub, descuento: desc, total: tot };
  }, [carrito, formaDePago]);

  const handleCheckout = () => {
    if (!carrito || !carrito.idCarrito) return;
    
    const datosCheckout = { formaDePago }; 

    fetchConToken(`/carritos/${carrito.idCarrito}/checkout`, 'POST', datosCheckout)
      .then(pedidoGenerado => {
        alert("¡Compra realizada con éxito! Tu pedido ha sido generado.");
        navigate('/');
        window.location.reload(); 
      })
      .catch(error => {
        console.error("Error en el checkout:", error);
        alert("Hubo un problema al procesar tu compra. Es posible que no haya stock suficiente.");
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Inicia sesión</h2>
        <p className="text-gray-600 mb-6">Debes iniciar sesión para ver tu carrito de compras.</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Ir a Login
        </Link>
      </div>
    );
  }

  if (!carrito || !carrito.items) {
    return <p className="mt-20">Cargando carrito...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-gray-50 p-8 rounded-lg shadow-sm min-h-[400px]">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Carrito de Compras</h2>
      
      {carrito.items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">El carrito está vacío.</p>
          <Link to="/catalogo" className="mt-4 inline-block text-blue-600 hover:underline">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna de Items y Forma de Pago */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Productos</h3>
            <ul className="space-y-4">
            {carrito.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div>
                  <span className="font-semibold text-gray-800">Vehículo ID: {item.vehiculoId}</span>
                  <p className="text-sm text-gray-500">Valor: ${item.valor?.toLocaleString('es-AR') || '0,00'}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 font-medium"
                  onClick={() => quitarDelCarrito(item.id)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Forma de Pago</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <label className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input type="radio" name="formaDePago" value="TARJETA" checked={formaDePago === "TARJETA"} onChange={(e) => setFormaDePago(e.target.value)} className="h-4 w-4 text-blue-600"/>
                  <span className="ml-3 text-gray-700">Tarjeta de Crédito / Débito (Precio de lista)</span>
                </label>
                <label className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input type="radio" name="formaDePago" value="TRANSFERENCIA" checked={formaDePago === "TRANSFERENCIA"} onChange={(e) => setFormaDePago(e.target.value)} className="h-4 w-4 text-blue-600"/>
                  <span className="ml-3 text-gray-700">Transferencia Bancaria <span className="font-bold text-green-600">(5% OFF)</span></span>
                </label>
                <label className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input type="radio" name="formaDePago" value="EFECTIVO" checked={formaDePago === "EFECTIVO"} onChange={(e) => setFormaDePago(e.target.value)} className="h-4 w-4 text-blue-600"/>
                  <span className="ml-3 text-gray-700">Efectivo <span className="font-bold text-green-600">(10% OFF)</span></span>
                </label>
              </div>
            </div>
          </div>

          {/* Columna de Resumen de Compra */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-xl font-semibold mb-6 border-b pb-3">Resumen</h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-${descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <button
              className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={handleCheckout}
            >
              Comprar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}