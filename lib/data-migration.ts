// Data migration utilities to convert legacy data to new API schemas

import type { ApiUser, ApiProduct, ApiCategory, LegacyUser, LegacyProduct, LegacyCategory } from "./api-types"

// Generate UUID v4
function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Generate ISO8601 datetime string
function generateISODate(date?: Date): string {
  return (date || new Date()).toISOString()
}

// Migrate legacy user to API user
export function migrateLegacyUser(legacyUser: LegacyUser): ApiUser {
  return {
    createdAt: legacyUser.createdAt || generateISODate(),
    updatedAt: generateISODate(),
    uuid: `user-${generateUuid()}`,
    firstName: legacyUser.firstName,
    lastName: legacyUser.lastName,
    email: legacyUser.email,
    phone: legacyUser.phone,
    role: "customer",
  }
}

// Migrate legacy product to API product
export function migrateLegacyProduct(legacyProduct: LegacyProduct): ApiProduct {
  // Convert legacy images to product media
  const productMedia = legacyProduct.images.map((image, index) => ({
    order: index + 1,
    isDefault: index === 0,
    url: image.url,
  }))

  // Extract specifications
  const specifications = legacyProduct.specifications
    ? {
        material: legacyProduct.material,
        height: legacyProduct.height,
        weight: legacyProduct.weight,
        packageContents: legacyProduct.specifications.packageContents,
        careInstructions: legacyProduct.specifications.careInstructions,
        sizes: legacyProduct.specifications.sizes,
      }
    : null

  // Determine category from legacy categories array
  const primaryCategory = legacyProduct.categories[0] || "figures"
  const categoryMap: { [key: string]: { id: number; name: string; slug: string } } = {
    figures: { id: 1, name: "مجسمه‌ها", slug: "figures" },
    "one-piece": { id: 2, name: "وان پیس", slug: "one-piece" },
    naruto: { id: 3, name: "ناروتو", slug: "naruto" },
    "demon-slayer": { id: 4, name: "شیطان کش", slug: "demon-slayer" },
    "jujutsu-kaisen": { id: 5, name: "جوجوتسو کایزن", slug: "jujutsu-kaisen" },
    "attack-on-titan": { id: 6, name: "حمله به تایتان", slug: "attack-on-titan" },
    clothing: { id: 9, name: "پوشاک", slug: "clothing" },
    "t-shirts": { id: 10, name: "تی‌شرت‌ها", slug: "t-shirts" },
    hoodies: { id: 11, name: "هودی‌ها", slug: "hoodies" },
    accessories: { id: 13, name: "لوازم جانبی", slug: "accessories" },
    keychains: { id: 14, name: "جاکلیدی‌ها", slug: "keychains" },
  }

  const category = categoryMap[primaryCategory] || categoryMap["figures"]

  return {
    createdAt: generateISODate(),
    updatedAt: generateISODate(),
    uuid: `prod-${generateUuid()}`,
    name: legacyProduct.name,
    slug: legacyProduct.name
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, ""),
    price: legacyProduct.price,
    quantity: legacyProduct.availability === "out-of-stock" ? 0 : legacyProduct.availability === "low-stock" ? 10 : 50,
    rating: legacyProduct.rating,
    detail: {
      series: legacyProduct.series,
      character: legacyProduct.character,
      description: legacyProduct.description,
      specifications,
    },
    category,
    productMedia,
  }
}

// Migrate legacy category to API category
export function migrateLegacyCategory(legacyCategory: LegacyCategory): ApiCategory {
  return {
    createdAt: generateISODate(),
    updatedAt: generateISODate(),
    uuid: `cat-${generateUuid()}`,
    id: Number.parseInt(legacyCategory.id) || Math.floor(Math.random() * 1000),
    name: legacyCategory.name,
    slug: legacyCategory.slug,
    description: legacyCategory.description,
    image: legacyCategory.image,
    children: [], // Will be populated separately
  }
}

// Build category hierarchy from flat legacy categories
export function buildCategoryHierarchy(legacyCategories: LegacyCategory[]): ApiCategory[] {
  const categoryMap = new Map<string, ApiCategory>()
  const rootCategories: ApiCategory[] = []

  // First pass: create all categories
  legacyCategories.forEach((legacyCategory) => {
    const apiCategory = migrateLegacyCategory(legacyCategory)
    categoryMap.set(legacyCategory.id, apiCategory)
  })

  // Second pass: build hierarchy
  legacyCategories.forEach((legacyCategory) => {
    const apiCategory = categoryMap.get(legacyCategory.id)
    if (!apiCategory) return

    if (legacyCategory.parentId) {
      const parent = categoryMap.get(legacyCategory.parentId)
      if (parent) {
        parent.children.push(apiCategory)
      } else {
        rootCategories.push(apiCategory)
      }
    } else {
      rootCategories.push(apiCategory)
    }
  })

  return rootCategories
}

// Batch migration functions
export function migrateAllUsers(legacyUsers: LegacyUser[]): ApiUser[] {
  return legacyUsers.map(migrateLegacyUser)
}

export function migrateAllProducts(legacyProducts: LegacyProduct[]): ApiProduct[] {
  return legacyProducts.map(migrateLegacyProduct)
}

export function migrateAllCategories(legacyCategories: LegacyCategory[]): ApiCategory[] {
  return buildCategoryHierarchy(legacyCategories)
}

// Validation after migration
export function validateMigratedData(data: {
  users: ApiUser[]
  products: ApiProduct[]
  categories: ApiCategory[]
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for duplicate UUIDs
  const allUuids = [
    ...data.users.map((u) => u.uuid),
    ...data.products.map((p) => p.uuid),
    ...data.categories.map((c) => c.uuid),
  ]

  const duplicateUuids = allUuids.filter((uuid, index) => allUuids.indexOf(uuid) !== index)
  if (duplicateUuids.length > 0) {
    errors.push(`Duplicate UUIDs found: ${duplicateUuids.join(", ")}`)
  }

  // Check for missing required fields
  data.users.forEach((user) => {
    if (!user.firstName || !user.lastName || !user.email) {
      errors.push(`User ${user.uuid} is missing required fields`)
    }
  })

  data.products.forEach((product) => {
    if (!product.name || !product.slug || product.price <= 0) {
      errors.push(`Product ${product.uuid} is missing required fields or has invalid price`)
    }
  })

  data.categories.forEach((category) => {
    if (!category.name || !category.slug) {
      errors.push(`Category ${category.uuid} is missing required fields`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Export migrated data as JSON
export function exportMigratedData(data: {
  users: ApiUser[]
  products: ApiProduct[]
  categories: ApiCategory[]
}): string {
  return JSON.stringify(data, null, 2)
}

// Import and validate JSON data
export function importMigratedData(jsonString: string): {
  users: ApiUser[]
  products: ApiProduct[]
  categories: ApiCategory[]
} {
  try {
    const data = JSON.parse(jsonString)

    if (!data.users || !data.products || !data.categories) {
      throw new Error("Invalid data structure: missing required arrays")
    }

    return {
      users: data.users,
      products: data.products,
      categories: data.categories,
    }
  } catch (error) {
    throw new Error(`Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
