import React from 'react';
import {
  Boxes,
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Package,
  Home,
  CheckCircle2,
  Truck,
  Send
} from 'lucide-react';
import { Product, Supplier, CustomerOrder, PurchaseOrder } from '../types';
import { formatCurrency } from '../utils/storage';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  products: Product[];
  suppliers: Supplier[];
  customerOrders: CustomerOrder[];
  purchaseOrders: PurchaseOrder[];
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  suppliers,
  customerOrders,
  purchaseOrders,
  onNavigate,
}) => {
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStock);
  const pendingOrders = customerOrders.filter(
    (o) => o.status === 'Registrado' || o.status === 'En Preparación'
  );

  const totalInventoryCost = products.reduce(
    (acc, p) => acc + p.currentStock * p.costPrice,
    0
  );
  const totalInventorySalesValue = products.reduce(
    (acc, p) => acc + p.currentStock * p.salePrice,
    0
  );
  const projectedGrossMargin = totalInventorySalesValue - totalInventoryCost;

  return (
    <div className="space-y-6">
      {/* Banner de Advertencia si hay Stock Bajo (Ronald H. Ballou) */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 md:p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Alerta de Existencias en Vivienda (Ronald H. Ballou)
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Hay <strong>{lowStockProducts.length} producto(s)</strong> con existencias en o por debajo
                del stock mínimo de seguridad. Se recomienda iniciar compras de reposición.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('abastecimiento')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Comprar a Proveedores
            </button>
            <button
              onClick={() => onNavigate('inventario')}
              className="px-3 py-2 bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Ver Inventario
            </button>
          </div>
        </div>
      )}

      {/* Grid de KPIs Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Productos */}
        <div
          onClick={() => onNavigate('inventario')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Productos
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {products.length}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              {products.reduce((acc, p) => acc + p.currentStock, 0)} unidades físicas totales
            </span>
          </div>
        </div>

        {/* KPI 2: Stock Bajo */}
        <div
          onClick={() => onNavigate('inventario')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stock Bajo / Crítico
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-3xl font-extrabold font-mono tabular-nums ${
                lowStockProducts.length > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {lowStockProducts.length}
            </span>
            <span className="text-xs text-rose-500 block mt-1 font-medium">
              {lowStockProducts.length > 0 ? '≤ Stock de seguridad' : 'Existencias saludables'}
            </span>
          </div>
        </div>

        {/* KPI 3: Pedidos de Clientes Pendientes */}
        <div
          onClick={() => onNavigate('distribucion')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pedidos Pendientes
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {pendingOrders.length}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Por preparar o despachar
            </span>
          </div>
        </div>

        {/* KPI 4: Proveedores Registrados */}
        <div
          onClick={() => onNavigate('abastecimiento')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Proveedores
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {suppliers.length}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              {purchaseOrders.filter((po) => po.status === 'Pendiente').length} compras en tránsito
            </span>
          </div>
        </div>
      </div>

      {/* Valorización Financiera de Inventario */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Valorización del Inventario Doméstico
            </h3>
            <p className="text-xs text-slate-500">
              Cálculo de capital inmovilizado en mercancía y valor comercial proyectado
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Margen Bruto Proyectado: {formatCurrency(projectedGrossMargin)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Costo Total en Inventario</span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums block mt-1">
              {formatCurrency(totalInventoryCost)}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Capital invertido en compras</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Valor Venta Estimado</span>
            <span className="text-xl font-bold text-sky-700 font-mono tabular-nums block mt-1">
              {formatCurrency(totalInventorySalesValue)}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Precio público total</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Órdenes de Compra a Proveedor</span>
            <span className="text-xl font-bold text-purple-700 font-mono tabular-nums block mt-1">
              {purchaseOrders.length} órdenes
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {purchaseOrders.filter((po) => po.status === 'Recibido').length} recibidas históricamente
            </span>
          </div>
        </div>
      </div>

      {/* Marcos Teóricos Logísticos para JADAS STORE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Fundamentos Teóricos de Logística Operativa para JADAS STORE
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Arquitectura de procesos diseñada para la microempresa unipersonal operada desde la vivienda:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Abastecimiento */}
          <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Truck className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-800">1. Abastecimiento</span>
              </div>
              <p className="text-xs font-semibold text-sky-700">Bowersox, Closs y Cooper</p>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Gestión de compras, consolidación de pedidos a proveedores mayoristas de Medellín, Cali y Bogotá,
                y cálculo de tiempos de entrega (lead times).
              </p>
            </div>
            <button
              onClick={() => onNavigate('abastecimiento')}
              className="mt-3 text-xs text-sky-700 hover:text-sky-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Proveedores</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Almacenamiento */}
          <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Home className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">2. Almacenamiento</span>
              </div>
              <p className="text-xs font-semibold text-amber-700">Julio Juan Anaya Tejero</p>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Zonificación doméstica del espacio: asignación de ubicaciones físicas específicas en la casa
                (estantes, cajas plásticas, vitrinas y percheros) para evitar desorden.
              </p>
            </div>
            <button
              onClick={() => onNavigate('inventario')}
              className="mt-3 text-xs text-amber-700 hover:text-amber-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Ubicaciones</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Inventario */}
          <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Boxes className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">3. Control de Inventario</span>
              </div>
              <p className="text-xs font-semibold text-emerald-700">Ronald H. Ballou</p>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Control continuo de existencias, cálculo de stock mínimo de seguridad para no perder ventas
                y alertas visuales en semáforo (crítico, bajo y óptimo).
              </p>
            </div>
            <button
              onClick={() => onNavigate('inventario')}
              className="mt-3 text-xs text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Stock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4. Distribución */}
          <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Send className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800">4. Distribución & Picking</span>
              </div>
              <p className="text-xs font-semibold text-purple-700">Ronald H. Ballou</p>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Hoja de preparación (picking) guiada en el hogar, ciclo de entrega al cliente
                y descarga automática de unidades vendidas al confirmar la entrega.
              </p>
            </div>
            <button
              onClick={() => onNavigate('distribucion')}
              className="mt-3 text-xs text-purple-700 hover:text-purple-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Despachos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tablas Inferiores: Pedidos Recientes & Alertas de Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos de Clientes Recientes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Últimos Pedidos de Clientes</h4>
              <p className="text-xs text-slate-500">Salidas y compromisos de despacho</p>
            </div>
            <button
              onClick={() => onNavigate('distribucion')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {customerOrders.slice(0, 4).map((order) => {
              const statusStyles = {
                Registrado: 'bg-slate-100 text-slate-700',
                'En Preparación': 'bg-amber-100 text-amber-800 font-semibold',
                Entregado: 'bg-emerald-100 text-emerald-800 font-semibold',
                Cancelado: 'bg-rose-100 text-rose-800',
              };

              return (
                <div
                  key={order.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{order.id}</span>
                      <span className="font-semibold text-slate-900">{order.customerName}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {order.items.length} producto(s) · {order.deliveryMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800 block">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] mt-0.5 ${
                        statusStyles[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Productos con Stock Bajo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Prioridad: Productos en Stock Bajo</h4>
              <p className="text-xs text-slate-500">Artículos que requieren orden de compra</p>
            </div>
            <button
              onClick={() => onNavigate('abastecimiento')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Generar Pedido</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-slate-700">Inventario en Nivel Óptimo</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Todas las referencias superan su stock de seguridad en vivienda.
                </p>
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{prod.reference}</span>
                      <span className="font-bold text-slate-900">{prod.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600">
                      <span>{prod.sizeOrVariant}</span>
                      <span className="text-amber-800 font-medium">📍 {prod.homeLocation}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-mono font-extrabold text-rose-600 block">
                      {prod.currentStock} ud(s)
                    </span>
                    <span className="text-[10px] text-slate-500">Mín: {prod.minStock}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
