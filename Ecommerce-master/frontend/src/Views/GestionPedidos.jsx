    import {useEffect } from 'react';
    import { useDispatch, useSelector } from "react-redux"
    import { fetchPedidos, actualizarPedido } from "../redux/pedidosSlice.js";

    
    const GestionPedidos = () => {
    const dispatch = useDispatch()
    const pedidos = useSelector(state => state.pedidos.list)
    const loading = useSelector(state => state.pedidos.loading)

    useEffect(() => {
        dispatch(fetchPedidos())
    }, [dispatch])


    const estadosPosibles = ['PAGADO', 'EN_PREPARACION', 'LISTO_PARA_RECOGER', 'FINALIZADO'];

    const handleEstadoChange = (pedidoId, nuevoEstado) => {
        dispatch(actualizarPedido({ idPedido: pedidoId, nuevoEstado }));
    }

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