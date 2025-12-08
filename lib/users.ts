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