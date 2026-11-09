import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Home,
  Edit2,
  Trash2,
  Tag,
  TrendingDown
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { COMMON_HOME_LOCATIONS } from '../data/initialData';
import { formatCurrency } from '../utils/storage';

interface InventoryViewProps {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onAdjustStock: (productId: string, delta: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onSaveProduct,
  onAdjustStock,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedLocation, setSelectedLocation] = useState<string>('todas');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('todos');

  // Formulario Producto
  const [ref, setRef] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Ropa');
  const [variant, setVariant] = useState('');
  const [location, setLocation] = useState(COMMON_HOME_LOCATIONS[0]);
  const [currentStock, setCurrentStock] = useState(5);
  const [minStock, setMinStock] = useState(3);
  const [costPrice, setCostPrice] = useState(35000);
  const [salePrice, setSalePrice] = useState(70000);

  // Extraer ubicaciones únicas presentes en el catálogo
  const presentLocations = Array.from(new Set(products.map((p) => p.homeLocation))).sort();

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setRef(product.reference);
      setName(product.name);
      setCategory(product.category);
      setVariant(product.sizeOrVariant);
      setLocation(product.homeLocation);
      setCurrentStock(product.currentStock);
      setMinStock(product.minStock);
      setCostPrice(product.costPrice);
      setSalePrice(product.salePrice);
    } else {
      setEditingProduct(null);
      setRef(`JDS-${category.substring(0, 3).toUpperCase()}-${String(products.length + 1).padStart(3, '0')}`);
      setName('');
      setCategory('Ropa');
      setVariant('');
      setLocation(COMMON_HOME_LOCATIONS[0]);
      setCurrentStock(5);
      setMinStock(3);
      setCostPrice(35000);
      setSalePrice(70000);
    }
    setIsModalOpen(true);
  };

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    if (!editingProduct) {
      setRef(`JDS-${newCat.substring(0, 3).toUpperCase()}-${String(products.length + 1).padStart(3, '0')}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      reference: ref.trim(),
      name: name.trim(),
      category,
      sizeOrVariant: variant.trim(),
      homeLocation: location.trim(),
      currentStock: Number(currentStock),
      minStock: Number(minStock),
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    onSaveProduct(productToSave);
    setIsModalOpen(false);
  };

  // Filtrado de productos
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sizeOrVariant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.homeLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'todas' || p.category === selectedCategory;
    const matchesLocation = selectedLocation === 'todas' || p.homeLocation === selectedLocation;

    let matchesStock = true;
    if (selectedStockFilter === 'alerta') {
      matchesStock = p.currentStock <= p.minStock;
    } else if (selectedStockFilter === 'optimo') {
      matchesStock = p.currentStock > p.minStock;
    }

    return matchesSearch && matchesCategory && matchesLocation && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Almacenamiento e Inventario Unificado
            </h2>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
              Anaya Tejero & Ronald Ballou
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zonificación física doméstica (ubicación exacta en casa) y control de stock de seguridad para evitar quiebres
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Producto</span>
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Buscador */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Buscar por referencia, nombre, talla o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filtros Dropdown */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Categoría */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="todas">Todas las Categorías</option>
            <option value="Ropa">Ropa</option>
            <option value="Zapatos">Zapatos</option>
            <option value="Lociones">Lociones</option>
            <option value="Gorras">Gorras</option>
            <option value="Accesorios">Accesorios</option>
          </select>

          {/* Ubicación en Vivienda (Anaya Tejero) */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer max-w-[200px] truncate"
            title="Filtrar por zona de la casa"
          >
            <option value="todas">Todas las Ubicaciones en Casa</option>
            {presentLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Semáforo de Stock (Ballou) */}
          <select
            value={selectedStockFilter}
            onChange={(e) => setSelectedStockFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="todos">Todos los Niveles de Stock</option>
            <option value="alerta">En Alerta / Stock Bajo (≤ Mín)</option>
            <option value="optimo">Nivel Óptimo (&gt; Mín)</option>
          </select>
        </div>
      </div>

      {/* Tabla de Productos e Inventario */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Ref. / SKU</th>
                <th className="px-5 py-3.5">Producto & Categoría</th>
                <th className="px-5 py-3.5">Talla / Variante</th>
                <th className="px-5 py-3.5 bg-amber-50/50 text-amber-900">
                  Ubicación en Vivienda (Anaya)
                </th>
                <th className="px-5 py-3.5 text-center">Stock Actual</th>
                <th className="px-5 py-3.5 text-center">Stock Mínimo</th>
                <th className="px-5 py-3.5 text-center">Nivel (Ballou)</th>
                <th className="px-5 py-3.5 text-right">Precio Venta</th>
                <th className="px-5 py-3.5 text-right">Ajuste & Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-slate-400">
                    No se encontraron productos con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isCritical = p.currentStock <= 1;
                  const isLow = p.currentStock <= p.minStock;

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isLow ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-800">{p.reference}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block leading-tight">{p.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">{p.sizeOrVariant}</td>
                      <td className="px-5 py-3.5 bg-amber-50/40 font-semibold text-amber-900">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{p.homeLocation}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono text-sm">
                        <span
                          className={`font-extrabold ${
                            isCritical
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {p.currentStock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono text-slate-500 font-medium">
                        {p.minStock}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                            Crítico
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                            Stock Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Óptimo
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 text-right">
                        {formatCurrency(p.salePrice)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Botones de Ajuste Rápido de Stock (+ / -) */}
                          <button
                            onClick={() => onAdjustStock(p.id, 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition-colors cursor-pointer text-xs"
                            title="Sumar 1 unidad"
                          >
                            +
                          </button>
                          <button
                            onClick={() => onAdjustStock(p.id, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition-colors cursor-pointer text-xs"
                            title="Restar 1 unidad"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleOpenModal(p)}
                            className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                            title="Editar ficha técnica y ubicación"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: REGISTRAR / EDITAR PRODUCTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold">
                  {editingProduct ? 'Editar Producto & Ubicación' : 'Registrar Nuevo Producto'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Fundamento Anaya Tejero (Espacio) & Ballou (Stock)
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Referencia / SKU
                  </label>
                  <input
                    type="text"
                    required
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="ej: JDS-ROP-005"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Ropa">Ropa</option>
                    <option value="Zapatos">Zapatos</option>
                    <option value="Lociones">Lociones</option>
                    <option value="Gorras">Gorras</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo del Producto
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej: Camiseta Oversize Heavy Cotton 'Urban Shadow'"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Talla / Color / Presentación
                </label>
                <input
                  type="text"
                  required
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="ej: Talla M / Negro, 41 / Blanco, 100ml EDP"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Ubicación en Vivienda (Anaya Tejero) */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-amber-800" />
                  <label className="block text-xs font-bold text-amber-900">
                    Ubicación Exacta en la Vivienda (Anaya Tejero)
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej: Estante A (Habitación 1), Caja 02, Vitrina (Sala)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />

                {/* Sugerencias Rápidas de Ubicación */}
                <div className="pt-1">
                  <span className="text-[10px] text-amber-800 font-semibold block mb-1">
                    Sugerencias de zonas del hogar:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {COMMON_HOME_LOCATIONS.map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className="text-[10px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cantidad Actual en Casa
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stock Mínimo de Seguridad (Ballou)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Costo Unitario (COP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Precio Venta (COP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
