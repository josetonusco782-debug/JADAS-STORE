import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Edit2,
  PackageCheck
} from 'lucide-react';
import { Supplier, PurchaseOrder, Product, ProductCategory } from '../types';
import { formatCurrency } from '../utils/storage';

interface ProcurementViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  products: Product[];
  onSaveSupplier: (supplier: Supplier) => void;
  onSavePurchaseOrder: (order: PurchaseOrder) => void;
  onReceivePurchaseOrder: (orderId: string) => void;
}

export const ProcurementView: React.FC<ProcurementViewProps> = ({
  suppliers,
  purchaseOrders,
  products,
  onSaveSupplier,
  onSavePurchaseOrder,
  onReceivePurchaseOrder,
}) => {
  // Estados para modales y filtros
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Formulario Proveedor
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supCity, setSupCity] = useState('');
  const [supLeadTime, setSupLeadTime] = useState(3);
  const [supCategories, setSupCategories] = useState<ProductCategory[]>(['Ropa']);
  const [supNotes, setSupNotes] = useState('');

  // Formulario Orden de Compra
  const [poSupplierId, setPoSupplierId] = useState(suppliers[0]?.id || '');
  const [poProductId, setPoProductId] = useState(products[0]?.id || '');
  const [poQuantity, setPoQuantity] = useState(10);
  const [poUnitCost, setPoUnitCost] = useState(
    products[0]?.costPrice || 35000
  );
  const [poExpectedDate, setPoExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [poNotes, setPoNotes] = useState('');

  // Abrir modal proveedor
  const handleOpenSupplierModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setSupName(supplier.name);
      setSupContact(supplier.contactName);
      setSupPhone(supplier.phone);
      setSupCity(supplier.city);
      setSupLeadTime(supplier.deliveryLeadTimeDays);
      setSupCategories(supplier.categories);
      setSupNotes(supplier.notes || '');
    } else {
      setEditingSupplier(null);
      setSupName('');
      setSupContact('');
      setSupPhone('');
      setSupCity('');
      setSupLeadTime(3);
      setSupCategories(['Ropa']);
      setSupNotes('');
    }
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      id: editingSupplier ? editingSupplier.id : `sup-${Date.now()}`,
      name: supName.trim(),
      contactName: supContact.trim(),
      phone: supPhone.trim(),
      city: supCity.trim(),
      deliveryLeadTimeDays: Number(supLeadTime),
      categories: supCategories.length > 0 ? supCategories : ['Ropa'],
      notes: supNotes.trim(),
    };
    onSaveSupplier(newSupplier);
    setIsSupplierModalOpen(false);
  };

  const toggleCategory = (cat: ProductCategory) => {
    if (supCategories.includes(cat)) {
      setSupCategories(supCategories.filter((c) => c !== cat));
    } else {
      setSupCategories([...supCategories, cat]);
    }
  };

  // Abrir modal Orden de Compra
  const handleOpenOrderModal = () => {
    if (suppliers.length > 0) setPoSupplierId(suppliers[0].id);
    if (products.length > 0) {
      setPoProductId(products[0].id);
      setPoUnitCost(products[0].costPrice);
    }
    setPoQuantity(10);
    const d = new Date();
    d.setDate(d.getDate() + 4);
    setPoExpectedDate(d.toISOString().split('T')[0]);
    setPoNotes('');
    setIsOrderModalOpen(true);
  };

  const handleProductSelectChange = (productId: string) => {
    setPoProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setPoUnitCost(prod.costPrice);
    }
  };

  const handleSaveOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSupplier = suppliers.find((s) => s.id === poSupplierId);
    const selectedProduct = products.find((p) => p.id === poProductId);

    const orderNumber = `OC-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
    const newOrder: PurchaseOrder = {
      id: orderNumber,
      supplierId: poSupplierId,
      supplierName: selectedSupplier ? selectedSupplier.name : 'Proveedor Mayorista',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: poExpectedDate,
      status: 'Pendiente',
      totalCost: poQuantity * poUnitCost,
      notes: poNotes.trim(),
      items: [
        {
          productId: selectedProduct?.id,
          productName: selectedProduct ? selectedProduct.name : 'Producto Surtido',
          category: selectedProduct ? selectedProduct.category : 'Ropa',
          quantity: Number(poQuantity),
          unitCost: Number(poUnitCost),
        },
      ],
    };

    onSavePurchaseOrder(newOrder);
    setIsOrderModalOpen(false);
  };

  // Filtrado de órdenes
  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesStatus = filterStatus === 'todos' || po.status === filterStatus;
    const matchesSearch =
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.items.some((it) => it.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Módulo de Abastecimiento</h2>
            <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-lg">
              Bowersox, Closs y Cooper
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión estratégica de compras y alianzas con proveedores mayoristas para garantizar la disponibilidad
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenSupplierModal()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proveedor</span>
          </button>
          <button
            onClick={handleOpenOrderModal}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Truck className="w-4 h-4" />
            <span>Emitir Orden de Compra</span>
          </button>
        </div>
      </div>

      {/* Directorio de Proveedores */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Directorio de Proveedores</h3>
            <p className="text-xs text-slate-500">
              Socios comerciales de textiles, calzado y perfumería para JADAS STORE
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {suppliers.length} proveedores registrados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-5">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">{sup.name}</h4>
                  <button
                    onClick={() => handleOpenSupplierModal(sup)}
                    className="text-slate-400 hover:text-sky-600 p-1"
                    title="Editar proveedor"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">{sup.contactName}</p>

                <div className="mt-3 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{sup.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Tiempo de entrega: {sup.deliveryLeadTimeDays} días</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap gap-1">
                  {sup.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] font-medium bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md border border-sky-100"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {sup.notes && (
                <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 italic line-clamp-2">
                  "{sup.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Historial de Órdenes de Compra (Reabastecimiento) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Historial de Órdenes de Compra (Reaprovisionamiento)
            </h3>
            <p className="text-xs text-slate-500">
              Trazabilidad del ciclo de compras. Al recibir mercancía, el stock se actualiza en el inventario.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar compra o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 w-48 sm:w-60"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente (En tránsito)</option>
              <option value="Recibido">Recibido (Ingresado)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">N° Orden</th>
                <th className="px-5 py-3.5">Proveedor</th>
                <th className="px-5 py-3.5">Fecha Emisión</th>
                <th className="px-5 py-3.5">Llegada Estimada</th>
                <th className="px-5 py-3.5">Detalle de Ítems</th>
                <th className="px-5 py-3.5 text-right">Costo Total</th>
                <th className="px-5 py-3.5 text-center">Estado</th>
                <th className="px-5 py-3.5 text-right">Acción Operativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No se encontraron órdenes de compra con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isReceived = order.status === 'Recibido';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-800">{order.id}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-800 block">{order.supplierName}</span>
                        {order.notes && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                            {order.notes}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{order.orderDate}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">
                        {order.expectedDate}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="leading-tight">
                            <span className="font-medium text-slate-800">{it.productName}</span>
                            <span className="text-slate-500 ml-1">
                              ({it.quantity} uds @ {formatCurrency(it.unitCost)})
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 text-right">
                        {formatCurrency(order.totalCost)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isReceived
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {!isReceived ? (
                          <button
                            onClick={() => onReceivePurchaseOrder(order.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                            title="Confirmar llegada física e ingresar cantidades al inventario general"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Recibir (+Stock)</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span>Ingresado</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREAR / EDITAR PROVEEDOR */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  {editingSupplier ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Teoría de Abastecimiento de Bowersox, Closs y Cooper
                </p>
              </div>
              <button
                onClick={() => setIsSupplierModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSupplierSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Comercial / Empresa
                </label>
                <input
                  type="text"
                  required
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  placeholder="ej: Mayoristas Urban Jeans Medellín"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contacto Directo
                  </label>
                  <input
                    type="text"
                    required
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    placeholder="ej: Carlos Mario"
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
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    placeholder="ej: +57 312 000 0000"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    required
                    value={supCity}
                    onChange={(e) => setSupCity(e.target.value)}
                    placeholder="ej: Medellín, Bogotá, Cali"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Time (Días Entrega)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={supLeadTime}
                    onChange={(e) => setSupLeadTime(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categorías que Surte
                </label>
                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  {(['Ropa', 'Zapatos', 'Lociones', 'Gorras', 'Accesorios'] as ProductCategory[]).map(
                    (cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                          supCategories.includes(cat)
                            ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Condiciones / Términos Comerciales
                </label>
                <textarea
                  rows={2}
                  value={supNotes}
                  onChange={(e) => setSupNotes(e.target.value)}
                  placeholder="Catálogo PDF, pago contra entrega o 50% anticipo..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EMITIR ORDEN DE COMPRA A PROVEEDOR */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold">Emitir Orden de Compra (Abastecimiento)</h3>
                <p className="text-[11px] text-slate-400">
                  Reposición de existencias para JADAS STORE
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proveedor Mayorista
                </label>
                <select
                  required
                  value={poSupplierId}
                  onChange={(e) => setPoSupplierId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}) — Lead time: {s.deliveryLeadTimeDays} días
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Producto a Reaprovisionar
                </label>
                <select
                  required
                  value={poProductId}
                  onChange={(e) => handleProductSelectChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.sizeOrVariant} (Stock actual en casa: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cantidad a Comprar
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Costo Unitario (COP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={poUnitCost}
                    onChange={(e) => setPoUnitCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha Estimada de Llegada
                  </label>
                  <input
                    type="date"
                    required
                    value={poExpectedDate}
                    onChange={(e) => setPoExpectedDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Costo Total Estimado
                  </label>
                  <div className="px-3.5 py-2 bg-slate-100 rounded-xl text-xs font-bold font-mono text-slate-900">
                    {formatCurrency(poQuantity * poUnitCost)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas de Despacho / Guía Transportadora
                </label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  placeholder="Envío por Inter Rapidísimo, número de guía, empaque sellado..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl text-[11px] text-sky-800 leading-relaxed">
                📦 <strong>Ciclo Bowersox:</strong> La orden se crea con estado "Pendiente". En cuanto
                recibas el paquete en tu vivienda, haz clic en "Recibir (+Stock)" para incorporar de
                inmediato las unidades al inventario.
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
                  Confirmar Orden de Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
