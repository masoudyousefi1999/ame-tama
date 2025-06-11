// Centralized API type definitions matching the new backend schemas

// Base interface for all API entities
export interface BaseEntity {
  createdAt: string // ISO8601 datetime string
  updatedAt: string // ISO8601 datetime string
  uuid: string
}

// Category interfaces
export interface ApiCategory extends BaseEntity {
  id: number
  name: string
  slug: string
  description: string
  image: string
  children: ApiCategory[]
}

// Product interfaces
export interface ProductMedia {
  order: number
  isDefault: boolean
  url: string
}

export interface ProductDetail {
  series: string
  character: string
  description: string
  specifications?: {
    material?: string
    height?: string
    weight?: string
    packageContents?: string[]
    careInstructions?: string[]
    sizes?: string[]
    size?: string
  } | null
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface ApiProduct extends BaseEntity {
  name: string
  slug: string
  price: number
  quantity: number
  rating: number
  detail: ProductDetail
  category: ProductCategory
  productMedia: ProductMedia[]
}

// User interfaces
export interface ApiUser extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
}

export interface ApiUserAddress extends BaseEntity {
  province: string
  city: string
  address: string
  postalCode: string
  houseNumber: string
  floorNumber: string
}

export interface ApiUserBalance extends BaseEntity {
  balance: number
  user: {
    uuid: string
    firstName: string
    lastName: string
    role: string
    email: string
    phone: string
  }
}

// Order interfaces
export interface ApiOrderItem extends BaseEntity {
  quantity: number
  price: number | null
  product: {
    uuid: string
    name: string
    slug: string
    price: number
    detail: {
      series: string
      character: string
      description: string
    }
    category: {
      id: number
      name: string
      slug: string
    }
    productMedia: {
      order: number
      isDefault: boolean
      url: string
    }[]
  }
}

export interface ApiOrder extends BaseEntity {
  totalPrice: number | null
  finalPrice: number | null
  status: string
  items: ApiOrderItem[]
}

// Response wrapper interfaces
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// Request interfaces
export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  phone?: string
}

export interface CreateAddressRequest {
  province: string
  city: string
  address: string
  postalCode: string
  houseNumber: string
  floorNumber: string
}

export interface CreateOrderRequest {
  items: {
    productUuid: string
    quantity: number
  }[]
  addressUuid: string
}

// Filter and search interfaces
export interface ProductFilters {
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  sortBy?: "price" | "rating" | "createdAt" | "name"
  sortOrder?: "asc" | "desc"
}

export interface CategoryFilters {
  parentUuid?: string
  level?: number
}

// Validation schemas (for use with zod or similar)
export interface ValidationError {
  field: string
  message: string
}

// Status enums
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

// Utility types
export type EntityUuid = string
export type EntityId = number
export type ISODateString = string

// Legacy compatibility types (for gradual migration)
export interface LegacyProduct {
  id: number
  name: string
  price: number
  images: { id: number; url: string; alt: string }[]
  rating: number
  reviewCount: number
  availability: "in-stock" | "out-of-stock" | "low-stock"
  isNew: boolean
  isLimited: boolean
  categories: string[]
  series: string
  character: string
  manufacturer: string
  releaseDate: string
  scale?: string
  material?: string
  height?: string
  weight?: string
  description: string
  specifications: any
  reviews: any[]
}

export interface LegacyCategory {
  id: string
  slug: string
  name: string
  description: string
  image: string
  parentId?: string | null
  level: number
  filterTitle?: string
  filters?: { id: string; name: string }[]
}

export interface LegacyUser {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string
  phone?: string
  avatar?: string
  addresses?: any[]
  createdAt: string
}
