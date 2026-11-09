import React from 'react';
import { Menu, RotateCcw, AlertTriangle, FileCode2, Home } from 'lucide-react';
import { NavTab } from './Sidebar';

interface TopBarProps {
  currentTab: NavTab;
  onOpenMobileSidebar: () => void;
  lowStockCount: number;
  onNavigateToInventory: () => void;
  onResetData: () => void;
  onOpenExportModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onOpenMobileSidebar,
  lowStockCount,
  onNavigateToInventory,
  onResetData,
  onOpenExportModal,
}) => {
  const titles: Record<NavTab, { title: string; subtitle: string; tag: string }> = {
    dashboard: {
      title: 'Panel Principal (Dashboard)',
      subtitle: 'Indicadores clave y control operativo integral de JADAS STORE',
      tag: 'Visión General',
    },
    abastecimiento: {
      title: 'Módulo de Abastecimiento',
      subtitle: 'Gestión de compras, catálogo de proveedores y órdenes de abastecimiento',
      tag: 'Bowersox, Closs y Cooper',
    },
    inventario: {
      title: 'Almacenamiento e Inventario',
      subtitle: 'Clasificación física en vivienda y control de existencias con stock de seguridad',
      tag: 'Anaya Tejero & Ronald Ballou',
    },
    distribucion: {
      title: 'Distribución y Despacho',
      subtitle: 'Registro de ventas, hoja de picking en vivienda y descuento automático de stock',
      tag: 'Ronald H. Ballou',
    },
  };

  const currentInfo = titles[currentTab];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Botón menú móvil */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
              {currentInfo.title}
            </h2>
            <span className="hidden sm:inline-block text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200/80 rounded-md px-2 py-0.5">
              {currentInfo.tag}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Alerta de Stock Mínimo Rápida */}
        {lowStockCount > 0 && (
          <button
            onClick={onNavigateToInventory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Ver productos con existencias por debajo del mínimo"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="tabular-nums font-mono font-bold">{lowStockCount}</span>
            <span className="hidden lg:inline text-[11px]">stock bajo</span>
          </button>
        )}

        {/* Botón Descargar index.html Autónomo */}
        <button
          onClick={onOpenExportModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl font-medium transition-colors cursor-pointer"
          title="Descargar archivo index.html para abrir sin internet"
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>index.html Offline</span>
        </button>

        {/* Botón Restablecer Datos de Demostración */}
        <button
          onClick={onResetData}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          title="Restablecer datos iniciales de prueba"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restablecer Demo</span>
        </button>
      </div>
    </header>
  );
};
