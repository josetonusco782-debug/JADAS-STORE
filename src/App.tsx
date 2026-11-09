/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadStoredSession,
  saveStoredSession,
  loadStoredProducts,
  saveStoredProducts,
  loadStoredSuppliers,
  saveStoredSuppliers,
  loadStoredPurchaseOrders,
  saveStoredPurchaseOrders,
  loadStoredCustomerOrders,
  saveStoredCustomerOrders,
  resetAllDemoData,
} from './utils/storage';
import {
  Product,
  Supplier,
  PurchaseOrder,
  CustomerOrder,
  UserSession,
  CustomerOrderStatus,
} from './types';
import { LoginView } from './components/LoginView';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { ProcurementView } from './components/ProcurementView';
import { InventoryView } from './components/InventoryView';
import { DistributionView } from './components/DistributionView';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => loadStoredSession());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  const [products, setProducts] = useState<Product[]>(() => loadStoredProducts());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStoredSuppliers());
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() =>
    loadStoredPurchaseOrders()
  );
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() =>
    loadStoredCustomerOrders()
  );

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(
    null
  );

  // Sincronizar cambios en localStorage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    saveStoredPurchaseOrders(purchaseOrders);
  }, [purchaseOrders]);

  useEffect(() => {
    saveStoredCustomerOrders(customerOrders);
  }, [customerOrders]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Manejadores de Sesión
  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    saveStoredSession(newSession);
    showToast(`¡Bienvenido a JADAS STORE, ${newSession.role}!`, 'success');
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar tu sesión como Propietario de JADAS STORE?')) {
      setSession(null);
      saveStoredSession(null);
      showToast('Sesión finalizada correctamente.', 'success');
    }
  };

  // Operaciones de Abastecimiento (Bowersox)
  const handleSaveSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => {
      const idx = prev.findIndex((s) => s.id === supplier.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = supplier;
        showToast(`Proveedor "${supplier.name}" actualizado.`);
        return updated;
      }
      showToast(`Nuevo proveedor "${supplier.name}" registrado.`);
      return [supplier, ...prev];
    });
  };

  const handleSavePurchaseOrder = (order: PurchaseOrder) => {
    setPurchaseOrders((prev) => [order, ...prev]);
    showToast(`Orden de compra ${order.id} emitida con éxito.`);
  };

  // Recepción de Mercancía: incrementa stock automáticamente (Bowersox)
  const handleReceivePurchaseOrder = (orderId: string) => {
    const po = purchaseOrders.find((o) => o.id === orderId);
    if (!po || po.status === 'Recibido') return;

    if (
      window.confirm(
        `¿Confirmas la recepción física del pedido ${po.id}? Se incrementará el stock del inventario general de acuerdo con las unidades recibidas.`
      )
    ) {
      // 1. Actualizar orden
      setPurchaseOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Recibido' as const } : o))
      );

      // 2. Incrementar stock en productos
      po.items.forEach((item) => {
        if (item.productId) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === item.productId ? { ...p, currentStock: p.currentStock + item.quantity } : p
            )
          );
        }
      });

      showToast(
        `Mercancía recibida: Unidades sumadas al inventario de la vivienda.`,
        'success'
      );
    }
  };

  // Operaciones de Almacenamiento e Inventario (Anaya Tejero & Ballou)
  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = product;
        showToast(`Producto "${product.name}" y su ubicación física actualizados.`);
        return updated;
      }
      showToast(`Producto "${product.name}" registrado en ${product.homeLocation}.`);
      return [product, ...prev];
    });
  };

  const handleAdjustStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newQty = Math.max(0, p.currentStock + delta);
          showToast(`Stock de "${p.name}" ajustado a ${newQty} uds.`);
          return { ...p, currentStock: newQty };
        }
        return p;
      })
    );
  };

  // Operaciones de Distribución y Despacho (Ballou)
  const handleSaveCustomerOrder = (order: CustomerOrder) => {
    setCustomerOrders((prev) => [order, ...prev]);
    showToast(`Pedido ${order.id} registrado para ${order.customerName}.`);
  };

  // Cambio de estado de pedido y descuento automático de inventario al entregar (Ballou)
  const handleUpdateOrderStatus = (orderId: string, newStatus: CustomerOrderStatus) => {
    const order = customerOrders.find((o) => o.id === orderId);
    if (!order) return;

    const prevStatus = order.status;
    let shouldDeduct = false;
    let shouldRestore = false;

    if (newStatus === 'Entregado' && !order.inventoryDeducted) {
      shouldDeduct = true;
    } else if (prevStatus === 'Entregado' && newStatus !== 'Entregado' && order.inventoryDeducted) {
      shouldRestore = true;
    }

    // Actualizar estado del pedido
    setCustomerOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            inventoryDeducted: shouldDeduct ? true : shouldRestore ? false : o.inventoryDeducted,
          };
        }
        return o;
      })
    );

    // Ajustar existencias en el inventario
    if (shouldDeduct) {
      setProducts((prev) =>
        prev.map((p) => {
          const item = order.items.find((it) => it.productId === p.id);
          if (item) {
            return { ...p, currentStock: Math.max(0, p.currentStock - item.quantity) };
          }
          return p;
        })
      );
      showToast(`Pedido ${order.id} marcado como Entregado: Unidades descontadas del inventario.`, 'success');
    } else if (shouldRestore) {
      setProducts((prev) =>
        prev.map((p) => {
          const item = order.items.find((it) => it.productId === p.id);
          if (item) {
            return { ...p, currentStock: p.currentStock + item.quantity };
          }
          return p;
        })
      );
      showToast(`Se restablecieron las existencias al cancelar la entrega de ${order.id}.`, 'warning');
    }
  };

  const handleToggleItemPicked = (orderId: string, itemIndex: number) => {
    setCustomerOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newItems = [...o.items];
          if (newItems[itemIndex]) {
            newItems[itemIndex] = {
              ...newItems[itemIndex],
              picked: !newItems[itemIndex].picked,
            };
          }
          return { ...o, items: newItems };
        }
        return o;
      })
    );
  };

  // Restablecer Datos de Demostración
  const handleResetData = () => {
    if (
      window.confirm(
        '¿Deseas restablecer todos los datos de prueba de JADAS STORE a sus valores iniciales?'
      )
    ) {
      resetAllDemoData();
      setProducts(loadStoredProducts());
      setSuppliers(loadStoredSuppliers());
      setPurchaseOrders(loadStoredPurchaseOrders());
      setCustomerOrders(loadStoredCustomerOrders());
      showToast('Datos de demostración restablecidos.', 'success');
    }
  };

  // Cálculo de alertas
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock).length;
  const pendingOrdersCount = customerOrders.filter(
    (o) => o.status === 'Registrado' || o.status === 'En Preparación'
  ).length;

  // Si no hay sesión activa, mostrar Pantalla de Login
  if (!session) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs text-white transition-all transform animate-bounce-subtle ${
            toast.type === 'error'
              ? 'bg-rose-600'
              : toast.type === 'warning'
              ? 'bg-amber-600'
              : 'bg-slate-900'
          }`}
        >
          {toast.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-300 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Menú Lateral (Sidebar) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        session={session}
        lowStockCount={lowStockCount}
        pendingOrdersCount={pendingOrdersCount}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Área Central de Contenido */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <TopBar
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          lowStockCount={lowStockCount}
          onNavigateToInventory={() => setCurrentTab('inventario')}
          onResetData={handleResetData}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {currentTab === 'dashboard' && (
            <DashboardView
              products={products}
              suppliers={suppliers}
              customerOrders={customerOrders}
              purchaseOrders={purchaseOrders}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'abastecimiento' && (
            <ProcurementView
              suppliers={suppliers}
              purchaseOrders={purchaseOrders}
              products={products}
              onSaveSupplier={handleSaveSupplier}
              onSavePurchaseOrder={handleSavePurchaseOrder}
              onReceivePurchaseOrder={handleReceivePurchaseOrder}
            />
          )}

          {currentTab === 'inventario' && (
            <InventoryView
              products={products}
              onSaveProduct={handleSaveProduct}
              onAdjustStock={handleAdjustStock}
            />
          )}

          {currentTab === 'distribucion' && (
            <DistributionView
              customerOrders={customerOrders}
              products={products}
              onSaveCustomerOrder={handleSaveCustomerOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onToggleItemPicked={handleToggleItemPicked}
            />
          )}
        </main>
      </div>

      {/* Modal para descargar index.html autónomo */}
      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
