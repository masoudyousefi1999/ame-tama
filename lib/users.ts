// تعریف نوع کاربر
// import myImage from "@/public/photo_2025-05-14_11-44-03.jpg";
export interface User {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: string;
}

// تعریف نوع آدرس کاربر
export interface UserAddress {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  houseNumber: string;
  floorNumber: string;
}

// تعریف نوع موجودی کاربر
export interface UserBalance {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  balance: number;
  user: {
    uuid: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
  };
}

// تعریف نوع آیتم سفارش
export interface OrderItem {
  createdAt: string;
  updatedAt: string;
  quantity: number;
  price: number | null;
  product: {
    uuid: string;
    name: string;
    slug: string;
    price: number;
    detail: {
      series: string;
      character: string;
      description: string;
    };
    category: {
      id: number;
      name: string;
      slug: string;
    };
    productMedia: {
      order: number;
      isDefault: boolean;
      url: string;
    }[];
  };
}

// تعریف نوع سفارش
export interface Order {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  totalPrice: number | null;
  finalPrice: number | null;
  status: string;
  items: OrderItem[];
}

// داده‌های نمونه برای کاربران
const users: User[] = [
  {
    createdAt: "2023-01-15T10:30:00.000Z",
    updatedAt: "2025-05-30T02:00:00.000Z",
    uuid: "user-58b1f289-be86-4344-8d07-3a55a01badbe",
    firstName: "مسعود",
    lastName: "یوسفی",
    email: "masoudyousefi1999@gmail.com",
    password: "MASOUDyo1378",
    phone: "09375116262",
    avatar: "/placeholder.svg?height=200&width=200",
    role: "customer",
  },
  {
    createdAt: "2023-02-20T14:45:00.000Z",
    updatedAt: "2025-05-30T02:05:00.000Z",
    uuid: "user-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066",
    firstName: "مریم",
    lastName: "حسینی",
    email: "maryam@example.com",
    password: "password456",
    phone: "09198765432",
    avatar: "/placeholder.svg?height=200&width=200",
    role: "customer",
  },
];

// داده‌های نمونه برای آدرس‌های کاربران
const userAddresses: { [userUuid: string]: UserAddress[] } = {
  "user-58b1f289-be86-4344-8d07-3a55a01badbe": [
    {
      createdAt: "2023-01-15T10:35:00.000Z",
      updatedAt: "2025-05-30T02:10:00.000Z",
      uuid: "addr-58b1f289-be86-4344-8d07-3a55a01badbe",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر، کوچه بهار",
      postalCode: "1234567890",
      houseNumber: "12",
      floorNumber: "3",
    },
  ],
  "user-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066": [
    {
      createdAt: "2023-02-20T14:50:00.000Z",
      updatedAt: "2025-05-30T02:15:00.000Z",
      uuid: "addr-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066",
      province: "تهران",
      city: "تهران",
      address: "خیابان شریعتی، خیابان ملک",
      postalCode: "9876543210",
      houseNumber: "45",
      floorNumber: "2",
    },
  ],
};

// داده‌های نمونه برای موجودی کاربران
const userBalances: { [userUuid: string]: UserBalance } = {
  "user-58b1f289-be86-4344-8d07-3a55a01badbe": {
    createdAt: "2023-01-15T10:40:00.000Z",
    updatedAt: "2025-05-30T02:20:00.000Z",
    uuid: "balance-58b1f289-be86-4344-8d07-3a55a01badbe",
    balance: 150000,
    user: {
      uuid: "user-58b1f289-be86-4344-8d07-3a55a01badbe",
      firstName: "مسعود",
      lastName: "یوسفی",
      role: "customer",
      email: "masoudyousefi1999@gmail.com",
      phone: "09375116262",
    },
  },
  "user-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066": {
    createdAt: "2023-02-20T14:55:00.000Z",
    updatedAt: "2025-05-30T02:25:00.000Z",
    uuid: "balance-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066",
    balance: 75000,
    user: {
      uuid: "user-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066",
      firstName: "مریم",
      lastName: "حسینی",
      role: "customer",
      email: "maryam@example.com",
      phone: "09198765432",
    },
  },
};

// داده‌های نمونه برای سفارش‌ها
const userOrders: { [userUuid: string]: Order[] } = {
  "user-58b1f289-be86-4344-8d07-3a55a01badbe": [
    {
      createdAt: "2025-05-15T08:30:00.000Z",
      updatedAt: "2025-05-18T15:45:00.000Z",
      uuid: "order-58b1f289-be86-4344-8d07-3a55a01badbe",
      totalPrice: 1250000,
      finalPrice: 1125000,
      status: "delivered",
      items: [
        {
          createdAt: "2025-05-15T08:30:00.000Z",
          updatedAt: "2025-05-15T08:30:00.000Z",
          quantity: 1,
          price: 850000,
          product: {
            uuid: "prod-58b1f289-be86-4344-8d07-3a55a01badbe",
            name: "مجسمه لوفی گیر ۵",
            slug: "luffy-gear-5-figure",
            price: 299.99,
            detail: {
              series: "وان پیس",
              character: "مانکی دی. لوفی",
              description:
                "مجسمه لوفی گیر ۵ یکی از شاهکارهای مجموعه AME-TAMA است",
            },
            category: {
              id: 2,
              name: "وان پیس",
              slug: "one-piece",
            },
            productMedia: [
              {
                order: 1,
                isDefault: true,
                url: "https://figar.ir/wp-content/uploads/2023/08/one-piec-gear-five-figure-1.jpg",
              },
            ],
          },
        },
        {
          createdAt: "2025-05-15T08:30:00.000Z",
          updatedAt: "2025-05-15T08:30:00.000Z",
          quantity: 1,
          price: 400000,
          product: {
            uuid: "prod-di43dk46-hii6-akj2-ej1j-ekjfke1k0102",
            name: "جاکلیدی گوجو ساتورو",
            slug: "gojo-satoru-keychain",
            price: 12.99,
            detail: {
              series: "جوجوتسو کایزن",
              character: "گوجو ساتورو",
              description: "جاکلیدی کوچک و زیبا با طرح گوجو ساتورو",
            },
            category: {
              id: 14,
              name: "جاکلیدی‌ها",
              slug: "keychains",
            },
            productMedia: [
              {
                order: 1,
                isDefault: true,
                url: "/placeholder.svg?height=400&width=400",
              },
            ],
          },
        },
      ],
    },
  ],
};

// دریافت کاربر با ایمیل
export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

// دریافت کاربر با شناسه UUID
export function getUserByUuid(uuid: string): User | undefined {
  return users.find((user) => user.uuid === uuid);
}

// دریافت آدرس‌های کاربر
export function getUserAddresses(userUuid: string): UserAddress[] {
  return userAddresses[userUuid] || [];
}

// دریافت موجودی کاربر
export function getUserBalance(userUuid: string): UserBalance | undefined {
  return userBalances[userUuid];
}

// دریافت سفارش‌های کاربر
export function getUserOrders(userUuid: string): Order[] {
  return userOrders[userUuid] || [];
}

// افزودن کاربر جدید (در یک پروژه واقعی، این تابع با دیتابیس کار می‌کند)
export function addUser(
  user: Omit<User, "uuid" | "createdAt" | "updatedAt">
): User {
  const newUser: User = {
    uuid: `user-${Date.now().toString()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...user,
    role: user.role || "customer",
  };

  users.push(newUser);
  return newUser;
}

// برای سازگاری با کد قدیمی
export function getUserById(id: string): User | undefined {
  return getUserByUuid(id);
}
