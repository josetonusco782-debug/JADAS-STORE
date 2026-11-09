export type ProductCategory = 'Ropa' | 'Zapatos' | 'Lociones' | 'Gorras' | 'Accesorios';

export interface Product {
  id: string;
  reference: string; // SKU / Referencia ej: JDS-ROP-001
  name: string;
  category: ProductCategory;
  sizeOrVariant: string; // Talla / Color / Presentación ej: "M / Negro", "41 / Blanco", "100ml EDP"
  currentStock: number;
  minStock: number; // Stock mínimo de seguridad (Ballou)
  homeLocation: string; // Ubicación exacta en vivienda (Anaya Tejero) ej: "Estante A - Habitación 1"
  costPrice: number;
  salePrice: number;
  supplierId?: string;
  lastUpdated?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  city: string;
  categories: ProductCategory[];
  deliveryLeadTimeDays: number; // Tiempo estimado de entrega en días
  notes?: string;
}

export type PurchaseOrderStatus = 'Pendiente' | 'Recibido' | 'Cancelado';

export interface PurchaseOrderItem {
  productId?: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string; // ej: OC-2024-001
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalCost: number;
  receivedDate?: string;
  notes?: string;
}

export type CustomerOrderStatus = 'Registrado' | 'En Preparación' | 'Entregado' | 'Cancelado';

export interface CustomerOrderItem {
  productId: string;
  productReference: string;
  productName: string;
  sizeOrVariant: string;
  category: ProductCategory;
  homeLocation: string; // Guardado para picking instantáneo
  quantity: number;
  unitPrice: number;
  picked?: boolean; // Estado de preparación en la vivienda
}

export interface CustomerOrder {
  id: string; // ej: PED-1024
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryMethod: 'Domicilio' | 'Punto de Encuentro' | 'Retiro en Casa';
  orderDate: string;
  status: CustomerOrderStatus;
  items: CustomerOrderItem[];
  totalAmount: number;
  notes?: string;
  inventoryDeducted: boolean;
}

export interface UserSession {
  username: string;
  role: 'Propietario / Administrador';
  loginTime: string;
}
