    import React, { useState, useEffect } from 'react';
    import { fetchConToken } from '../api/api';

    const GestionPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const estadosPosibles = ['PAGADO', 'EN_PREPARACION', 'LISTO_PARA_RECOGER', 'FINALIZADO'];

    useEffect(() => {
        fetchConToken('/pedidos')
        .then(data => {
            setPedidos(data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error al cargar pedidos:", error);
            setLoading(false);
        });
    }, []);

    const handleEstadoChange = (pedidoId, nuevoEstado) => {
        fetchConToken(`/pedidos/${pedidoId}/estado`, 'PATCH', { estado: nuevoEstado })
        .then(pedidoActualizado => {
            setPedidos(prev => 
            prev.map(p => p.idPedido === pedidoId ? pedidoActualizado : p)
            );
        })
        .catch(error => console.error('Error al actualizar estado:', error));
    };

    if (loading) return <p className="mt-20 text-center">Cargando pedidos...</p>;

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-6">Gestión de Pedidos</h1>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">ID Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {pedidos.map(pedido => (
                <tr key={pedido.idPedido}>
                    <td className="px-6 py-4">{pedido.idPedido}</td>
                    <td className="px-6 py-4">{pedido.cliente.username} (ID: {pedido.cliente.idCliente})</td>
                    <td className="px-6 py-4">{new Date(pedido.fechaDeCreacion).toLocaleString()}</td>
                    <td className="px-6 py-4">${pedido.costoTotal.toFixed(2)}</td>
                    <td className="px-6 py-4">
                    <select
                        value={pedido.estado}
                        onChange={(e) => handleEstadoChange(pedido.idPedido, e.target.value)}
                        className="p-2 border rounded-md bg-gray-100"
                    >
                        {estadosPosibles.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    };

    export default GestionPedidos;