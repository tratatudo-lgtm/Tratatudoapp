
import React from 'react';

export enum ProcessStatus {
  NOT_STARTED = 'Não Iniciado',
  IN_PROGRESS = 'Em Processing',
  WAITING_DOCS = 'Aguardando Documentos',
  SCHEDULED = 'Agendado',
  COMPLETED = 'Concluído',
  REJECTED = 'Recusado'
}

export type UserRole = 'client' | 'admin';
export type PlanLevel = 'lite' | 'gold' | 'elite';
export type DifficultyLevel = 'Baixa' | 'Média' | 'Alta';

export interface BlockchainTx {
  hash: string;
  blockNumber: number;
  timestamp: string;
  network: 'Polygon Mainnet' | 'Ethereum' | 'TrataTudo Ledger';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'pending_verification';
  plan: PlanLevel;
}

export interface UserProcess {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  status: ProcessStatus;
  progress: number;
  lastUpdate: string;
  nextStep: string;
  requiresPOA?: boolean;
  blockchainTxs?: BlockchainTx[];
}

export type FormFieldType = 'text' | 'number' | 'date' | 'select' | 'boolean';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[]; // For select type fields
  value?: string; // Current value if being filled
}

export interface FormDefinition {
  id: string;
  name: string;
  category: string; // e.g., 'Segurança Social'
  serviceId: string; // Links to a ServiceDetail
  fields: FormField[];
}

export interface Document {
  id: string;
  name: string;
  category: string;
  status: 'valid' | 'pending' | 'expired';
  expiryDate?: string;
  clientId?: string;
  isPOA?: boolean;
  signedAt?: string;
  blockchainCert?: BlockchainTx;
  content?: string;
  filledFormId?: string; // If this document is a filled form
  formData?: Record<string, string>; // Stored form data
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'consultant' | 'admin';
  text: string;
  timestamp: Date;
  clientId?: string;
  attachments?: Document[]; // Supporting AI doc identification
  serviceOffer?: {
    id: string;
    type: 'CV' | 'LETTER' | 'CLAIM';
    price: string;
    preview: string;
    isPaid: boolean;
  };
}

export interface ServiceDetail {
  id: string;
  name: string;
  price: string; // The standard/base price
  originalPrice?: string; // Used for displaying a "crossed-out" price if there's a current campaign
  hasCampaign?: boolean; // Flag to indicate if a campaign is active
  icon: React.ReactNode;
  desc: string; // Short description
  category: string;
  requiredDocs: string[];
  fullDesc: string; // Detailed description of the service process
  difficulty: DifficultyLevel;
  painPoints: string[]; // Problems the service solves
  faq?: { question: string; answer: string }[];
  requiresPOA?: boolean; // If a Power of Attorney is needed
  
  // New properties for tiered pricing logic
  goldDiscount?: number; // Percentage discount for Gold plan members (e.g., 20 for 20%)
  isFreeForGold?: boolean; // If the service is entirely free for Gold plan members
  isEliteExcluded?: boolean; // If the service is NOT free for Elite plan members (Elite pays Gold price)
}

export interface CartItem extends ServiceDetail {
  addedAt: Date;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending';
  method: 'MB WAY' | 'Revolut' | 'Bank Transfer' | 'Cartão / Viva';
  invoiceNumber: string;
}

export type PaymentContext = {
  type: 'plan';
  planLevel: PlanLevel;
  amount: string;
} | {
  type: 'cart';
  items: CartItem[];
  totalAmount: string;
};

export type AppView = 'home' | 'dashboard' | 'documents' | 'chat' | 'profile' | 'admin_dashboard' | 'admin_clients' | 'admin_chat' | 'billing' | 'service_details' | 'cart';
