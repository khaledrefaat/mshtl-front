export interface Tray {
  _id: string;
  name: string;
  expense?: number;
  income?: number;
  left?: number;
  date?: string;
  notes?: string;
  customerId?: string;
  dailySaleId?: string;
  transactionId?: string;
}

export interface fertilizerData {
  _id: string;
  balance: number;
  income: number;
  units: number;
  expense: number;
  statement?: string;
  date?: string;
  notes?: string;
  customerTransactionId?: string;
  customerId?: string;
  supplierId?: string;
  supplierTransactionId?: string;
  dailySaleId?: string;
}

export interface Fertilizer {
  _id: string;
  name: string;
  balance: number;
  unitPrice: number;
  data: fertilizerData[];
}

export interface DailySale {
  _id: string;
  money?: {
    balance?: number;
    income?: number;
    expense?: number;
  };
  name: string;
  goods?: {
    income?: number;
    expense?: number;
  };
  statement: string;
  date: string;
  notes?: string;
  noteBook: {
    name: string;
    _id: string;
    transactionId?: string;
    subName?: string;
  };
  isConfirmed?: boolean;
}

export interface customerData {
  _id: string;
  balance: number;
  total: number;
  trays: number;
  unitPrice?: number;
  paid: number;
  statement?: string;
  date?: string;
  units?: number;
  itemTransactionId?: string;
  fertilizerTransactionId?: string;
  fertilizerId?: string;
  itemId?: string;
}

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  balance: number;
  trays: number;
  data: customerData[];
}

interface supplierData {
  _id: string;
  balance: number;
  total: number;
  statement?: string;
  date?: string;
  notes?: string;
  unitPrice?: number;
  unit?: number;
  paid?: number;
}

export interface NewNoteBooks {
  _id: string;
  balance: number;
  expense: number;
  statement: string;
  dailySaleId: string;
  date: string;
}

export interface Loan {
  _id: string;
  balance: number;
  expense?: number;
  income?: number;
  statement: string;
  dailySaleId: string;
  date: string;
}

export interface Supplier {
  _id: string;
  name: string;
  balance: number;
  total: number;
  data: supplierData[];
}

export interface User {
  _id: string;
  isAdmin: boolean;
  token: string;
  expirationDate: string;
}

export interface Seeding {
  _id: string;
  itemName: string;
  itemId: string;
  quantity: number;
  unit?: string;
  plantDate?: string;
  lotNumber?: string;
  trays: number;
  total: number;
  dailySaleId: string;
  trayId: string;
}

export interface itemData {
  _id: string;
  balance: number;
  income: number;
  expense: number;
  statement?: string;
  date?: string;
  notes?: string;
  customerTransactionId?: string;
  customerId?: string;
  seedingId?: string;
  dailySaleId?: string;
}

export interface itemOrder {
  _id: string;
  name: string;
  trays: number;
  seedDate?: string;
  landDate?: string;
  notes?: string;
  dailySaleId: string;
  total: number;
}

export interface Item {
  _id: string;
  name: string;
  balance: number;
  unitPrice: number;
  data: itemData[];
  orders: itemOrder[];
}
