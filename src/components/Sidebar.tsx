import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Boxes,
  Send,
  LogOut,
  Package,
  Home,
  AlertTriangle,
  X,
  FileCode2
} from 'lucide-react';
import { UserSession } from '../types';

export type NavTab = 'dashboard' | 'abastecimiento' | 'inventario' | 'distribucion';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  session: UserSession;
  lowStockCount: number;
  pendingOrdersCount: number;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenExportModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  session,
  lowStockCount,
  pendingOrdersCount,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  onOpenExportModal,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard (Inicio)',
      sublabel: 'Visión general & KPIs',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'abastecimiento' as NavTab,
      label: 'Abastecimiento',
      sublabel: 'Bowersox (Compras & Proveedores)',
      icon: Truck,
      badge: null,
    },
    {
      id: 'inventario' as NavTab,
      label: 'Almacén e Inventario',
      sublabel: 'Anaya Tejero & Ballou (Ubicación)',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'distribucion' as NavTab,
      label: 'Distribución y Despacho',
      sublabel: 'Ballou (Picking en Vivienda)',
      icon: Send,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} activos` : null,
      badgeColor: 'bg-emerald-500 text-white',
    },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Barra Lateral */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-white shrink-0 flex flex-col justify-between border-r border-slate-800 z-50 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Cabecera / Identidad */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-wide text-white">JADAS STORE</h1>
                <p className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                  Logística Operativa
                </p>
              </div>
            </div>
            {/* Cerrar móvil */}
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-white p-1"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Perfil del Propietario */}
          <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-800/40 text-sky-400 flex items-center justify-center text-xs font-bold font-mono">
              PRO
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {session.role}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Home className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-slate-400 truncate">Vivienda Principal</span>
              </div>
            </div>
          </div>

          {/* Enlaces de Navegación */}
          <nav className="px-3 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <div>
                      <span className="block leading-tight">{item.label}</span>
                      <span className={`block text-[10px] mt-0.5 ${isActive ? 'text-sky-100' : 'text-slate-500'}`}>
                        {item.sublabel}
                      </span>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.badgeColor || 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Botón para exportar index.html individual offline */}
          <div className="px-3 py-2">
            <button
              onClick={onOpenExportModal}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-sky-400 border border-sky-800/30 transition-colors cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 shrink-0 text-sky-400" />
              <div className="text-left">
                <span className="block font-semibold">Descargar index.html</span>
                <span className="block text-[10px] text-slate-400">Archivo autónomo (SPA)</span>
              </div>
            </button>
          </div>

          {/* Pie del Menú con Cerrar Sesión */}
          <div className="p-3 border-t border-slate-800 space-y-2 mt-auto">
            {lowStockCount > 0 && (
              <div className="px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-900/50 flex items-center gap-2 text-rose-300 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">
                  {lowStockCount} ítems en o bajo stock mínimo
                </span>
              </div>
            )}

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
