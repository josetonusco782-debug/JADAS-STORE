import { Product, Supplier, PurchaseOrder, CustomerOrder, UserSession } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_CUSTOMER_ORDERS
} from '../data/initialData';

const STORAGE_KEYS = {
  SESSION: 'jadas_store_session',
  PRODUCTS: 'jadas_store_products',
  SUPPLIERS: 'jadas_store_suppliers',
  PURCHASE_ORDERS: 'jadas_store_purchase_orders',
  CUSTOMER_ORDERS: 'jadas_store_customer_orders',
};

export const loadStoredSession = (): UserSession | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error loading session from localStorage', e);
    return null;
  }
};

export const saveStoredSession = (session: UserSession | null): void => {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  } catch (e) {
    console.error('Error saving session', e);
  }
};

export const loadStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  } catch (e) {
    console.error('Error loading products from localStorage', e);
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products', e);
  }
};

export const loadStoredSuppliers = (): Supplier[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return data ? JSON.parse(data) : INITIAL_SUPPLIERS;
  } catch (e) {
    console.error('Error loading suppliers from localStorage', e);
    return INITIAL_SUPPLIERS;
  }
};

export const saveStoredSuppliers = (suppliers: Supplier[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  } catch (e) {
    console.error('Error saving suppliers', e);
  }
};

export const loadStoredPurchaseOrders = (): PurchaseOrder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
    return data ? JSON.parse(data) : INITIAL_PURCHASE_ORDERS;
  } catch (e) {
    console.error('Error loading purchase orders from localStorage', e);
    return INITIAL_PURCHASE_ORDERS;
  }
};

export const saveStoredPurchaseOrders = (orders: PurchaseOrder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving purchase orders', e);
  }
};

export const loadStoredCustomerOrders = (): CustomerOrder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ORDERS);
    return data ? JSON.parse(data) : INITIAL_CUSTOMER_ORDERS;
  } catch (e) {
    console.error('Error loading customer orders from localStorage', e);
    return INITIAL_CUSTOMER_ORDERS;
  }
};

export const saveStoredCustomerOrders = (orders: CustomerOrder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving customer orders', e);
  }
};

export const resetAllDemoData = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(INITIAL_PURCHASE_ORDERS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_ORDERS, JSON.stringify(INITIAL_CUSTOMER_ORDERS));
  } catch (e) {
    console.error('Error resetting demo data', e);
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
};
