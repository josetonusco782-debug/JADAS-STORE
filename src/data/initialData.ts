import { Product, Supplier, PurchaseOrder, CustomerOrder } from '../types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Distribuidora Textil Medellín Moda',
    contactName: 'Carlos Mario Restrepo',
    phone: '+57 312 458 9921',
    city: 'Medellín',
    categories: ['Ropa'],
    deliveryLeadTimeDays: 4,
    notes: 'Proveedor principal de camisetas oversize, bermudas y buzos en algodón pesado.'
  },
  {
    id: 'sup-2',
    name: 'Importaciones Sneaker Lab Bogotá',
    contactName: 'Juliana Vargas',
    phone: '+57 320 891 3340',
    city: 'Bogotá',
    categories: ['Zapatos'],
    deliveryLeadTimeDays: 3,
    notes: 'Calzado deportivo urbano calidad premium (réplicas exactas y calzado nacional).'
  },
  {
    id: 'sup-3',
    name: 'Fragancias del Caribe Mayoristas',
    contactName: 'Andrés Felipe Gómez',
    phone: '+57 301 774 1255',
    city: 'Barranquilla',
    categories: ['Lociones'],
    deliveryLeadTimeDays: 5,
    notes: 'Perfumería 100% original en tester y cajas selladas (Sauvage, One Million, Versace).'
  },
  {
    id: 'sup-4',
    name: 'Caps & Street Culture Cali',
    contactName: 'Marlon Caicedo',
    phone: '+57 315 620 4819',
    city: 'Cali',
    categories: ['Gorras', 'Accesorios'],
    deliveryLeadTimeDays: 3,
    notes: 'Gorras planas, curvas tipo trucker, riñoneras y cadenas en acero inoxidable.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    reference: 'JDS-ROP-001',
    name: 'Camiseta Oversize Heavy Cotton "Urban Shadow"',
    category: 'Ropa',
    sizeOrVariant: 'Talla L / Negro Lavado',
    currentStock: 12,
    minStock: 4,
    homeLocation: 'Estante A (Habitación Principal - Nivel 2)',
    costPrice: 38000,
    salePrice: 75000,
    supplierId: 'sup-1',
    lastUpdated: '2024-11-01'
  },
  {
    id: 'prod-2',
    reference: 'JDS-ROP-002',
    name: 'Buzo Hoodie French Terry con Capucha',
    category: 'Ropa',
    sizeOrVariant: 'Talla M / Gris Jaspe',
    currentStock: 3, // Stock bajo (<= minStock)
    minStock: 4,
    homeLocation: 'Perchero Metálico (Habitación 2 - Zona Derecha)',
    costPrice: 65000,
    salePrice: 125000,
    supplierId: 'sup-1',
    lastUpdated: '2024-11-03'
  },
  {
    id: 'prod-3',
    reference: 'JDS-ROP-003',
    name: 'Bermuda Cargo Dril Spandex con Bolsillos',
    category: 'Ropa',
    sizeOrVariant: 'Talla 32 / Beige Claro',
    currentStock: 8,
    minStock: 3,
    homeLocation: 'Estante A (Habitación Principal - Nivel 1)',
    costPrice: 42000,
    salePrice: 85000,
    supplierId: 'sup-1',
    lastUpdated: '2024-11-02'
  },
  {
    id: 'prod-4',
    reference: 'JDS-ZAP-001',
    name: 'Tenis Retro Sport Low White Edition',
    category: 'Zapatos',
    sizeOrVariant: 'Talla 41 / Blanco con Verde',
    currentStock: 2, // Stock bajo
    minStock: 3,
    homeLocation: 'Caja Organizadora 01 (Debajo de la Cama Principal)',
    costPrice: 110000,
    salePrice: 210000,
    supplierId: 'sup-2',
    lastUpdated: '2024-11-04'
  },
  {
    id: 'prod-5',
    reference: 'JDS-ZAP-002',
    name: 'Tenis Running Air Cushion Black Reflex',
    category: 'Zapatos',
    sizeOrVariant: 'Talla 40 / Negro Total',
    currentStock: 6,
    minStock: 2,
    homeLocation: 'Caja Organizadora 02 (Debajo de la Cama Principal)',
    costPrice: 125000,
    salePrice: 235000,
    supplierId: 'sup-2',
    lastUpdated: '2024-11-02'
  },
  {
    id: 'prod-6',
    reference: 'JDS-LOC-001',
    name: 'Loción Sauvage Eau de Parfum 100ml',
    category: 'Lociones',
    sizeOrVariant: '100 ml / Frasco Sellado',
    currentStock: 1, // Stock crítico
    minStock: 2,
    homeLocation: 'Vitrina de Cristal (Sala de Estar - Zona Segura)',
    costPrice: 290000,
    salePrice: 430000,
    supplierId: 'sup-3',
    lastUpdated: '2024-11-05'
  },
  {
    id: 'prod-7',
    reference: 'JDS-LOC-002',
    name: 'Loción One Million Royal Parfum 100ml',
    category: 'Lociones',
    sizeOrVariant: '100 ml / Edición Gold',
    currentStock: 4,
    minStock: 2,
    homeLocation: 'Vitrina de Cristal (Sala de Estar - Zona Segura)',
    costPrice: 275000,
    salePrice: 410000,
    supplierId: 'sup-3',
    lastUpdated: '2024-11-05'
  },
  {
    id: 'prod-8',
    reference: 'JDS-GOR-001',
    name: 'Gorra New Era NY Yankees 59FIFTY Curva',
    category: 'Gorras',
    sizeOrVariant: 'Ajustable Snapback / Azul Marino',
    currentStock: 9,
    minStock: 4,
    homeLocation: 'Gavetero Plástico 3 (Pasillo Superior - Gaveta 1)',
    costPrice: 35000,
    salePrice: 79000,
    supplierId: 'sup-4',
    lastUpdated: '2024-11-04'
  },
  {
    id: 'prod-9',
    reference: 'JDS-GOR-002',
    name: 'Gorra Trucker Los Angeles Malla Transpirable',
    category: 'Gorras',
    sizeOrVariant: 'Unitalla / Negro y Blanco',
    currentStock: 1, // Stock crítico
    minStock: 3,
    homeLocation: 'Gavetero Plástico 3 (Pasillo Superior - Gaveta 2)',
    costPrice: 28000,
    salePrice: 65000,
    supplierId: 'sup-4',
    lastUpdated: '2024-11-01'
  },
  {
    id: 'prod-10',
    reference: 'JDS-ACC-001',
    name: 'Cadena Acero Quirúrgico Eslabón Cubano 60cm',
    category: 'Accesorios',
    sizeOrVariant: '6mm Grosor / Plateado Brillante',
    currentStock: 7,
    minStock: 3,
    homeLocation: 'Joyero con Clave (Escritorio Habitación 1)',
    costPrice: 22000,
    salePrice: 55000,
    supplierId: 'sup-4',
    lastUpdated: '2024-11-03'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'OC-2024-001',
    supplierId: 'sup-1',
    supplierName: 'Distribuidora Textil Medellín Moda',
    orderDate: '2024-10-25',
    expectedDate: '2024-10-29',
    status: 'Recibido',
    receivedDate: '2024-10-30',
    totalCost: 760000,
    items: [
      {
        productId: 'prod-1',
        productName: 'Camiseta Oversize Heavy Cotton',
        category: 'Ropa',
        quantity: 20,
        unitCost: 38000
      }
    ],
    notes: 'Pedido recibido completo y en perfectas condiciones de costura.'
  },
  {
    id: 'OC-2024-002',
    supplierId: 'sup-3',
    supplierName: 'Fragancias del Caribe Mayoristas',
    orderDate: '2024-11-06',
    expectedDate: '2024-11-11',
    status: 'Pendiente',
    totalCost: 1130000,
    items: [
      {
        productId: 'prod-6',
        productName: 'Loción Sauvage Eau de Parfum 100ml',
        category: 'Lociones',
        quantity: 2,
        unitCost: 290000
      },
      {
        productId: 'prod-7',
        productName: 'Loción One Million Royal Parfum 100ml',
        category: 'Lociones',
        quantity: 2,
        unitCost: 275000
      }
    ],
    notes: 'Reaprovisionamiento urgente por stock bajo en Sauvage. Envío por Servientrega.'
  },
  {
    id: 'OC-2024-003',
    supplierId: 'sup-4',
    supplierName: 'Caps & Street Culture Cali',
    orderDate: '2024-11-07',
    expectedDate: '2024-11-10',
    status: 'Pendiente',
    totalCost: 336000,
    items: [
      {
        productId: 'prod-9',
        productName: 'Gorra Trucker Los Angeles Malla Transpirable',
        category: 'Gorras',
        quantity: 12,
        unitCost: 28000
      }
    ],
    notes: 'Reposición de lote para temporada de fin de año.'
  }
];

export const INITIAL_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'PED-1021',
    customerName: 'Santiago Morales Henao',
    customerPhone: '+57 318 902 4410',
    deliveryAddress: 'Calle 45 # 12 - 28, Apto 402, Barrio Laureles',
    deliveryMethod: 'Domicilio',
    orderDate: '2024-11-06',
    status: 'Entregado',
    inventoryDeducted: true,
    totalAmount: 160000,
    notes: 'Cliente frecuente. Entregado por mensajería motorizada.',
    items: [
      {
        productId: 'prod-1',
        productReference: 'JDS-ROP-001',
        productName: 'Camiseta Oversize Heavy Cotton "Urban Shadow"',
        sizeOrVariant: 'Talla L / Negro Lavado',
        category: 'Ropa',
        homeLocation: 'Estante A (Habitación Principal - Nivel 2)',
        quantity: 1,
        unitPrice: 75000,
        picked: true
      },
      {
        productId: 'prod-3',
        productReference: 'JDS-ROP-003',
        productName: 'Bermuda Cargo Dril Spandex con Bolsillos',
        sizeOrVariant: 'Talla 32 / Beige Claro',
        category: 'Ropa',
        homeLocation: 'Estante A (Habitación Principal - Nivel 1)',
        quantity: 1,
        unitPrice: 85000,
        picked: true
      }
    ]
  },
  {
    id: 'PED-1022',
    customerName: 'Valentina Restrepo Gil',
    customerPhone: '+57 314 552 1198',
    deliveryAddress: 'Centro Comercial Santa Fe (Punto de Encuentro Entrada Principal)',
    deliveryMethod: 'Punto de Encuentro',
    orderDate: '2024-11-07',
    status: 'En Preparación',
    inventoryDeducted: false,
    totalAmount: 509000,
    notes: 'Envoltura de regalo para el perfume. Cita a las 5:00 PM.',
    items: [
      {
        productId: 'prod-6',
        productReference: 'JDS-LOC-001',
        productName: 'Loción Sauvage Eau de Parfum 100ml',
        sizeOrVariant: '100 ml / Frasco Sellado',
        category: 'Lociones',
        homeLocation: 'Vitrina de Cristal (Sala de Estar - Zona Segura)',
        quantity: 1,
        unitPrice: 430000,
        picked: true
      },
      {
        productId: 'prod-8',
        productReference: 'JDS-GOR-001',
        productName: 'Gorra New Era NY Yankees 59FIFTY Curva',
        sizeOrVariant: 'Ajustable Snapback / Azul Marino',
        category: 'Gorras',
        homeLocation: 'Gavetero Plástico 3 (Pasillo Superior - Gaveta 1)',
        quantity: 1,
        unitPrice: 79000,
        picked: false
      }
    ]
  },
  {
    id: 'PED-1023',
    customerName: 'Mateo Osorio',
    customerPhone: '+57 302 443 6589',
    deliveryAddress: 'Retiro directo en vivienda del propietario',
    deliveryMethod: 'Retiro en Casa',
    orderDate: '2024-11-08',
    status: 'Registrado',
    inventoryDeducted: false,
    totalAmount: 210000,
    notes: 'Viene a probarse los tenis a las 3:30 PM.',
    items: [
      {
        productId: 'prod-4',
        productReference: 'JDS-ZAP-001',
        productName: 'Tenis Retro Sport Low White Edition',
        sizeOrVariant: 'Talla 41 / Blanco con Verde',
        category: 'Zapatos',
        homeLocation: 'Caja Organizadora 01 (Debajo de la Cama Principal)',
        quantity: 1,
        unitPrice: 210000,
        picked: false
      }
    ]
  }
];

export const COMMON_HOME_LOCATIONS = [
  'Estante A (Habitación Principal - Nivel 1)',
  'Estante A (Habitación Principal - Nivel 2)',
  'Estante A (Habitación Principal - Nivel 3)',
  'Caja Organizadora 01 (Debajo de la Cama Principal)',
  'Caja Organizadora 02 (Debajo de la Cama Principal)',
  'Vitrina de Cristal (Sala de Estar - Zona Segura)',
  'Perchero Metálico (Habitación 2 - Zona Derecha)',
  'Gavetero Plástico 3 (Pasillo Superior - Gaveta 1)',
  'Gavetero Plástico 3 (Pasillo Superior - Gaveta 2)',
  'Joyero con Clave (Escritorio Habitación 1)',
  'Closet Principal (Balda Superior)',
  'Caja Plástica 03 (Estudio / Bodega Temporal)'
];
