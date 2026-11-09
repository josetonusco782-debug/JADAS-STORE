import React, { useState } from 'react';
import { FileCode2, Download, Copy, Check, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFile = async () => {
    try {
      const response = await fetch('/jadas_store_standalone.html');
      const htmlText = await response.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jadas_store_index.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error al descargar archivo standalone', e);
      window.open('/jadas_store_standalone.html', '_blank');
    }
  };

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/jadas_store_standalone.html');
      const htmlText = await response.text();
      await navigator.clipboard.writeText(htmlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Error al copiar código', e);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Descargar index.html Autónomo (SPA)</h3>
              <p className="text-[11px] text-slate-300">
                Archivo único listo para abrir en cualquier navegador sin servidor
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            &times;
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <p className="leading-relaxed">
            Hemos compilado la solución completa en un archivo <strong>HTML5 autónomo con Tailwind CSS CDN y Vanilla JS plano</strong> conforme a la solicitud:
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Contenido del archivo index.html integrado:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
              <li><strong>Pantalla de Login:</strong> Propietario único con persistencia en localStorage y botón mostrar/ocultar contraseña.</li>
              <li><strong>Dashboard Central:</strong> KPIs en tiempo real y alertas de existencias.</li>
              <li><strong>Abastecimiento (Bowersox):</strong> Proveedores y órdenes de compra con recepción automática al inventario.</li>
              <li><strong>Almacenamiento e Inventario (Anaya & Ballou):</strong> Zonificación en vivienda, semáforo de stock y stock mínimo.</li>
              <li><strong>Distribución (Ballou):</strong> Registro de ventas, Hoja de Picking en la casa y descuento automático de stock.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={handleDownloadFile}
              className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar jadas_store_index.html</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center">
            <a
              href="/jadas_store_standalone.html"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:text-sky-800 text-[11px] font-medium inline-flex items-center gap-1"
            >
              <span>Abrir vista previa del HTML independiente en nueva pestaña</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
