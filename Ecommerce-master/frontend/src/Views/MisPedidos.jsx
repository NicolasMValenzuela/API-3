    import React, { useState, useEffect } from 'react';
    import { fetchConToken } from '../api/api';
    import { Link } from 'react-router-dom';

    const ProgressBar = ({ estado }) => {
    const estados = ['PAGADO', 'EN_PREPARACION', 'LISTO_PARA_RECOGER', 'FINALIZADO'];
    const currentIndex = estados.indexOf(estado);

    return (
        <div className="w-full my-4">
        <div className="flex justify-between text-xs text-gray-500">
            {estados.map((paso, index) => (
            <div key={paso} className="flex-1 text-center">
                <div
                className={`h-2 rounded-full mx-auto mb-1 transition-colors duration-300 ${
                    index <= currentIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
                />
                <p className={index <= currentIndex ? 'font-semibold text-green-700' : ''}>
                {paso.replace('_', ' ')}
                </p>
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConToken('/pedidos/mis-pedidos')
        .then(data => {
            setPedidos(data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error al cargar mis pedidos:", error);
            setLoading(false);
        });
    }, []);

    if (loading) return <p className="mt-20 text-center">Cargando tus pedidos...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-20 p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Mis Pedidos</h2>
        {pedidos.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aún no has realizado ningún pedido.</p>
            <Link to="/catalogo" className="mt-4 inline-block text-blue-600 hover:underline">
                Ir al catálogo
            </Link>
            </div>
        ) : (
            <ul className="space-y-6">
            {pedidos.map(pedido => (
                <li key={pedido.idPedido} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="font-semibold text-lg">Pedido #{pedido.idPedido}</h3>
                    <p className="text-sm text-gray-500">
                        Fecha: {new Date(pedido.fechaDeCreacion).toLocaleDateString()}
                    </p>
                    </div>
                    <div className="text-right">
                    <p className="font-bold text-xl">${pedido.costoTotal.toLocaleString('es-AR')}</p>
                    <p className="text-sm text-gray-500">
                        {pedido.formaDePago.formaDePago}
                    </p>
                    </div>
                </div>
                <ProgressBar estado={pedido.estado} />
                </li>
            ))}
            </ul>
        )}
        </div>
    );
    }