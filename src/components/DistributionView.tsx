import React, { useState } from 'react';
import {
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  ClipboardList,
  Phone,
  User,
  AlertCircle,
  ArrowRight,
  Printer,
  CheckSquare,
  Square,
  Home
} from 'lucide-react';
import { CustomerOrder, CustomerOrderItem, Product, CustomerOrderStatus } from '../types';
import { formatCurrency } from '../utils/storage';

interface DistributionViewProps {
  customerOrders: CustomerOrder[];
  products: Product[];
  onSaveCustomerOrder: (order: CustomerOrder) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: CustomerOrderStatus) => void;
  onToggleItemPicked: (orderId: string, itemIndex: number) => void;
}

export const DistributionView: React.FC<DistributionViewProps> = ({
  customerOrders,
  products,
  onSaveCustomerOrder,
  onUpdateOrderStatus,
  onToggleItemPicked,
}) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activePickingOrder, setActivePickingOrder] = useState<CustomerOrder | null>(null);

  // Filtros
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Formulario Pedido
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'Domicilio' | 'Punto de Encuentro' | 'Retiro en Casa'>('Domicilio');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Ítem a vender
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemUnitPrice, setItemUnitPrice] = useState(products[0]?.salePrice || 75000);

  const handleOpenOrderModal = () => {
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryMethod('Domicilio');
    setDeliveryAddress('');
    setNotes('');
    if (products.length > 0) {
      setSelectedProductId(products[0].id);
      setItemUnitPrice(products[0].salePrice);
    }
    setItemQuantity(1);
    setIsOrderModalOpen(true);
  };

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setItemUnitPrice(prod.salePrice);
    }
  };

  const handleSaveOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    if (itemQuantity > prod.currentStock) {
      const confirmLow = window.confirm(
        `Alerta de Ballou: El stock en vivienda (${prod.currentStock}) es menor que la cantidad pedida (${itemQuantity}). ¿Deseas registrarlo de todos modos?`
      );
      if (!confirmLow) return;
    }

    const orderNumber = `PED-${1020 + customerOrders.length + 1}`;
    const newOrder: CustomerOrder = {
      id: orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod,
      deliveryAddress: deliveryAddress.trim() || 'Vivienda Principal',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Registrado',
      inventoryDeducted: false,
      totalAmount: itemQuantity * itemUnitPrice,
      notes: notes.trim(),
      items: [
        {
          productId: prod.id,
          productReference: prod.reference,
          productName: prod.name,
          sizeOrVariant: prod.sizeOrVariant,
          category: prod.category,
          homeLocation: prod.homeLocation,
          quantity: Number(itemQuantity),
          unitPrice: Number(itemUnitPrice),
          picked: false,
        },
      ],
    };

    onSaveCustomerOrder(newOrder);
    setIsOrderModalOpen(false);
  };

  const handleOpenPickingModal = (order: CustomerOrder) => {
    setActivePickingOrder(order);
  };

  const handlePrintPicking = () => {
    window.print();
  };

  // Filtrado
  const filteredOrders = customerOrders.filter((o) => {
    const matchesStatus = filterStatus === 'todos' || o.status === filterStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.items.some((it) => it.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const registeredCount = customerOrders.filter((o) => o.status === 'Registrado').length;
  const inPrepCount = customerOrders.filter((o) => o.status === 'En Preparación').length;
  const deliveredCount = customerOrders.filter((o) => o.status === 'Entregado').length;

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Módulo de Distribución y Despacho</h2>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-lg">
              Ronald H. Ballou
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de pedidos de clientes, hoja de preparación (picking) guiada en el hogar y deducción automática de inventario
          </p>
        </div>

        <button
          onClick={handleOpenOrderModal}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Pedido de Cliente</span>
        </button>
      </div>

      {/* Métricas de Flujo de Pedidos (Ballou) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">1. Registrados</span>
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          </div>
          <span className="text-2xl font-extrabold text-slate-800 font-mono tabular-nums block mt-2">
            {registeredCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Pendientes por iniciar picking
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">2. En Preparación (Picking)</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <span className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums block mt-2">
            {inPrepCount}
          </span>
          <span className="text-[11px] text-amber-700 mt-0.5 block">
            Recolectando en estantes / percheros
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">3. Entregados / Despachados</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums block mt-2">
            {deliveredCount}
          </span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">
            Stock descontado del inventario general
          </span>
        </div>
      </div>

      {/* Listado y Tabla de Pedidos */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Listado de Pedidos y Despachos</h3>
            <p className="text-xs text-slate-500">
              Usa la Hoja de Picking para saber exactamente en qué cuarto o mueble está cada producto
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar pedido o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 w-44 sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Registrado">Registrado</option>
              <option value="En Preparación">En Preparación</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">N° Pedido</th>
                <th className="px-5 py-3.5">Cliente & Teléfono</th>
                <th className="px-5 py-3.5">Modalidad & Destino</th>
                <th className="px-5 py-3.5">Artículos Pedidos</th>
                <th className="px-5 py-3.5 text-right">Monto Total</th>
                <th className="px-5 py-3.5 text-center">Estado (Ballou)</th>
                <th className="px-5 py-3.5 text-right">Hoja de Picking / Ruta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusColors: Record<CustomerOrderStatus, string> = {
                    Registrado: 'bg-slate-100 text-slate-700 border-slate-200',
                    'En Preparación': 'bg-amber-50 text-amber-800 border-amber-200',
                    Entregado: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    Cancelado: 'bg-rose-50 text-rose-800 border-rose-200',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-800">{order.id}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">{order.customerName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-800 block truncate max-w-xs">
                          {order.deliveryAddress}
                        </span>
                        <span className="text-[10px] text-sky-700 font-semibold">
                          {order.deliveryMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="leading-tight">
                            <span className="font-medium text-slate-900">{it.productName}</span>
                            <span className="text-slate-500 ml-1">
                              ({it.quantity} ud - {it.sizeOrVariant})
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 text-right">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as CustomerOrderStatus)
                          }
                          className={`text-xs px-2.5 py-1 rounded-xl font-semibold border cursor-pointer ${
                            statusColors[order.status]
                          }`}
                        >
                          <option value="Registrado">Registrado</option>
                          <option value="En Preparación">En Preparación</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenPickingModal(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-xs"
                          title="Ver ubicaciones exactas en la casa para alistar los productos"
                        >
                          <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
                          <span>Hoja de Picking</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: HOJA DE PREPARACIÓN (PICKING SHEET) EN VIVIENDA */}
      {activePickingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header del Modal */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Hoja de Preparación y Picking Doméstico</h3>
                  <p className="text-[11px] text-slate-300">
                    Ruta de recolección en vivienda · Teoría de Distribución (Ballou & Anaya)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePickingOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            {/* Contenido de la Hoja de Picking */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Información del Pedido */}
              <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-900 text-sm">
                      {activePickingOrder.id}
                    </span>
                    <span className="text-slate-500 font-mono">
                      · Fecha: {activePickingOrder.orderDate}
                    </span>
                  </div>
                  <p className="text-sky-900 font-semibold mt-1">
                    Cliente: {activePickingOrder.customerName} ({activePickingOrder.customerPhone})
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-sky-700 block">
                    Modalidad & Destino
                  </span>
                  <span className="font-medium text-slate-800">
                    {activePickingOrder.deliveryMethod} · {activePickingOrder.deliveryAddress}
                  </span>
                </div>
              </div>

              {/* Lista de Ítems y sus Ubicaciones Físicas en la Vivienda */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Ruta de Recolección en la Vivienda (Picking)
                  </span>
                  <span className="text-slate-500">
                    {activePickingOrder.items.filter((it) => it.picked).length} de{' '}
                    {activePickingOrder.items.length} recolectados
                  </span>
                </div>

                <div className="divide-y divide-slate-100 p-2 space-y-1">
                  {activePickingOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onToggleItemPicked(activePickingOrder.id, idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        item.picked
                          ? 'bg-emerald-50/50 border-emerald-200/80'
                          : 'bg-white border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-sky-600">
                          {item.picked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold ${
                              item.picked ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            SKU: {item.productReference} · {item.sizeOrVariant}
                          </p>

                          {/* Etiqueta Destacada de Ubicación en la Casa */}
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/90 rounded-lg text-amber-900 text-xs font-semibold">
                            <Home className="w-3.5 h-3.5 text-amber-700" />
                            <span>Ubicación en casa: {item.homeLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold font-mono text-slate-900 block">
                          {item.quantity} ud(s)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guía Operativa para el Propietario */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  Instrucciones de Despacho (Ronald H. Ballou):
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  1. Sigue la ruta doméstica indicada arriba y marca cada casilla conforme saques el producto de su estante o caja.
                  <br />
                  2. Empaca el pedido con cinta y etiqueta de envío.
                  <br />
                  3. Cambia el estado a <strong>"Entregado"</strong> para que el sistema descuente automáticamente las existencias del inventario general.
                </p>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handlePrintPicking}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Imprimir Hoja de Picking</span>
              </button>

              <div className="flex items-center gap-2">
                {activePickingOrder.status !== 'Entregado' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateOrderStatus(activePickingOrder.id, 'Entregado');
                      setActivePickingOrder(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Marcar como Entregado (-Stock)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActivePickingOrder(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR NUEVO PEDIDO DE CLIENTE */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold">Registrar Pedido de Cliente</h3>
                <p className="text-[11px] text-slate-400">
                  Procesamiento de orden y preparación para despacho
                </p>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveOrderSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ej: Andrea Zapata"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="ej: +57 310 000 0000"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Modalidad de Entrega
                  </label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) =>
                      setDeliveryMethod(
                        e.target.value as 'Domicilio' | 'Punto de Encuentro' | 'Retiro en Casa'
                      )
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Domicilio">Domicilio con Mensajero</option>
                    <option value="Punto de Encuentro">Punto de Encuentro</option>
                    <option value="Retiro en Casa">Retiro Directo en Casa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dirección / Punto
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="ej: Cra 70 # 32-15 Apto 301"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Selección de Producto del Inventario */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Producto a Despachar
                </label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.sizeOrVariant} (Stock: {p.currentStock})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cantidad a Vender
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Precio Unitario (COP)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={itemUnitPrice}
                      onChange={(e) => setItemUnitPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                  </div>
                </div>

                {/* Vista previa de ubicación para el picking */}
                {(() => {
                  const currentProd = products.find((p) => p.id === selectedProductId);
                  if (!currentProd) return null;
                  return (
                    <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200/70">
                      📍 <strong>Ubicación en Vivienda:</strong> {currentProd.homeLocation}
                      <span className="block text-slate-500 mt-0.5">
                        Existencias actuales: {currentProd.currentStock} uds · Stock mínimo: {currentProd.minStock}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monto Total a Cobrar
                </label>
                <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold font-mono text-emerald-800">
                  {formatCurrency(itemQuantity * itemUnitPrice)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas Especiales de Entrega
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ej: Envoltura para regalo, entregar en portería..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs"
                >
                  Registrar Pedido de Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
