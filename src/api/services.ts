import { createPocketBaseApi } from './baseApi'
import type { Service, CreateServiceData } from '../types'

export const servicesApi = createPocketBaseApi<Service>('services')