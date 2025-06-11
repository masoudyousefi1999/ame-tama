// Data validation utilities for API schemas

import { z } from "zod"
import type {
  ApiUser,
  ApiProduct,
  ApiCategory,
  ApiUserAddress,
  ApiOrder,
  CreateUserRequest,
  CreateAddressRequest,
  ProductFilters,
} from "./api-types"

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// ISO8601 datetime validation
const ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

// Base entity schema
const baseEntitySchema = z.object({
  createdAt: z.string().regex(ISO8601_REGEX, "Invalid ISO8601 datetime format"),
  updatedAt: z.string().regex(ISO8601_REGEX, "Invalid ISO8601 datetime format"),
  uuid: z.string().regex(UUID_REGEX, "Invalid UUID format"),
})

// User validation schemas
export const userSchema = baseEntitySchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "Invalid phone number format")
    .optional(),
  role: z.enum(["customer", "admin", "moderator"]),
})

export const createUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "Invalid phone number format")
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Address validation schemas
export const addressSchema = baseEntitySchema.extend({
  province: z.string().min(2, "Province is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  postalCode: z.string().regex(/^\d{10}$/, "Postal code must be 10 digits"),
  houseNumber: z.string().min(1, "House number is required"),
  floorNumber: z.string().min(1, "Floor number is required"),
})

export const createAddressSchema = z.object({
  province: z.string().min(2, "Province is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  postalCode: z.string().regex(/^\d{10}$/, "Postal code must be 10 digits"),
  houseNumber: z.string().min(1, "House number is required"),
  floorNumber: z.string().min(1, "Floor number is required"),
})

// Product validation schemas
export const productMediaSchema = z.object({
  order: z.number().min(1),
  isDefault: z.boolean(),
  url: z.string().url("Invalid URL format"),
})

export const productDetailSchema = z.object({
  series: z.string().min(1, "Series is required"),
  character: z.string().min(1, "Character is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  specifications: z
    .object({
      material: z.string().optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      packageContents: z.array(z.string()).optional(),
      careInstructions: z.array(z.string()).optional(),
      sizes: z.array(z.string()).optional(),
      size: z.string().optional(),
    })
    .nullable()
    .optional(),
})

export const productCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
})

export const productSchema = baseEntitySchema.extend({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Product slug must be at least 2 characters"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  detail: productDetailSchema,
  category: productCategorySchema,
  productMedia: z.array(productMediaSchema).min(1, "At least one image is required"),
})

// Category validation schemas
export const categorySchema = baseEntitySchema.extend({
  id: z.number(),
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Category slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Invalid image URL"),
  children: z.array(z.lazy(() => categorySchema)),
})

// Order validation schemas
export const orderItemSchema = baseEntitySchema.extend({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().positive("Price must be positive").nullable(),
  product: z.object({
    uuid: z.string().regex(UUID_REGEX, "Invalid product UUID"),
    name: z.string().min(1, "Product name is required"),
    slug: z.string().min(1, "Product slug is required"),
    price: z.number().positive("Product price must be positive"),
    detail: z.object({
      series: z.string(),
      character: z.string(),
      description: z.string(),
    }),
    category: productCategorySchema,
    productMedia: z.array(productMediaSchema),
  }),
})

export const orderSchema = baseEntitySchema.extend({
  totalPrice: z.number().positive("Total price must be positive").nullable(),
  finalPrice: z.number().positive("Final price must be positive").nullable(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
})

// Filter validation schemas
export const productFiltersSchema = z.object({
  categorySlug: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["price", "rating", "createdAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

// Validation helper functions
export function validateUser(data: unknown): ApiUser {
  return userSchema.parse(data)
}

export function validateCreateUser(data: unknown): CreateUserRequest {
  return createUserSchema.parse(data)
}

export function validateAddress(data: unknown): ApiUserAddress {
  return addressSchema.parse(data)
}

export function validateCreateAddress(data: unknown): CreateAddressRequest {
  return createAddressSchema.parse(data)
}

export function validateProduct(data: unknown): ApiProduct {
  return productSchema.parse(data)
}

export function validateCategory(data: unknown): ApiCategory {
  return categorySchema.parse(data)
}

export function validateOrder(data: unknown): ApiOrder {
  return orderSchema.parse(data)
}

export function validateProductFilters(data: unknown): ProductFilters {
  return productFiltersSchema.parse(data)
}

// Data consistency validation
export function validateDataConsistency(data: {
  users: ApiUser[]
  products: ApiProduct[]
  categories: ApiCategory[]
  addresses: ApiUserAddress[]
  orders: ApiOrder[]
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check if all product categories exist
  const categoryIds = new Set<number>()
  const collectCategoryIds = (categories: ApiCategory[]) => {
    categories.forEach((cat) => {
      categoryIds.add(cat.id)
      collectCategoryIds(cat.children)
    })
  }
  collectCategoryIds(data.categories)

  data.products.forEach((product) => {
    if (!categoryIds.has(product.category.id)) {
      errors.push(`Product ${product.name} references non-existent category ID ${product.category.id}`)
    }
  })

  // Check if all order items reference valid products
  const productUuids = new Set(data.products.map((p) => p.uuid))
  data.orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productUuids.has(item.product.uuid)) {
        errors.push(`Order ${order.uuid} references non-existent product ${item.product.uuid}`)
      }
    })
  })

  // Check datetime consistency (updatedAt >= createdAt)
  const allEntities = [...data.users, ...data.products, ...data.categories, ...data.addresses, ...data.orders]

  allEntities.forEach((entity) => {
    const created = new Date(entity.createdAt)
    const updated = new Date(entity.updatedAt)
    if (updated < created) {
      errors.push(`Entity ${entity.uuid} has updatedAt before createdAt`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Type guards
export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}

export function isValidISODate(value: string): boolean {
  return ISO8601_REGEX.test(value)
}

export function isApiUser(value: unknown): value is ApiUser {
  try {
    userSchema.parse(value)
    return true
  } catch {
    return false
  }
}

export function isApiProduct(value: unknown): value is ApiProduct {
  try {
    productSchema.parse(value)
    return true
  } catch {
    return false
  }
}

export function isApiCategory(value: unknown): value is ApiCategory {
  try {
    categorySchema.parse(value)
    return true
  } catch {
    return false
  }
}
