export interface Project {
  id: string;
  title: string;
  location: string;
  mainImg: string;
  tag: string;
  description: string;
  video_url?: string;
  detailImages: string[];
  order: number;
}

export interface Booking {
  id: string;
  client_name: string;
  whatsapp: string;
  email: string;
  instagram: string;
  event_type: string;
  event_date: string;
  city: string;
  address: string;
  package_id: string;
  addons: string;
  promo_code: string;
  total_price: number;
  dp_amount: number;
  final_payment_amount: number;
  final_payment_proof_url: string;
  bank_ref: string;
  proof_url: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: string;
  category?: string;
  features: string[];
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  location: string;
  image_url: string;
  order: number;
}

export interface SiteService {
  id: string;
  num: string;
  title: string;
  description: string;
  order: number;
}

export interface ShowcaseItem {
  id: string;
  image_url: string;
  title: string;
  order: number;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
