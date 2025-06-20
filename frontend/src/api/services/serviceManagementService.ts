import axios from '../axios';
import { createBaseService, BaseEntity, BaseFilters } from '../../utils/serviceUtils';

export interface Service extends BaseEntity {
  name: string;
  description: string;
  price: number;
  duration: number;
  status: string;
  category: string;
}

export interface ServiceFilters extends BaseFilters {
  category?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
}

export const serviceManagementService = createBaseService<Service, ServiceFilters>('/services');
