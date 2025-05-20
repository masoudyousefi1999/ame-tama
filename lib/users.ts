// تعریف نوع کاربر
// import myImage from "@/public/photo_2025-05-14_11-44-03.jpg";
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  addresses?: {
    id: string;
    title: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
  }[];
  createdAt: string;
}

// داده‌های نمونه برای کاربران
const users: User[] = [
  {
    id: "1",
    firstName: "مسعود",
    lastName: "یوسفی",
    email: "masoudyousefi1999@gmail.com",
    password: "MASOUDyo1378",
    phone: "09375116262",
    // avatar: myImage.src,
    avatar: "/placeholder.svg?height=200&width=200",
    addresses: [
      {
        id: "addr1",
        title: "خانه",
        address: "خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
        city: "تهران",
        province: "تهران",
        postalCode: "1234567890",
        isDefault: true,
      },
    ],
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    firstName: "مریم",
    lastName: "حسینی",
    email: "maryam@example.com",
    password: "password456",
    phone: "09198765432",
    avatar: "/placeholder.svg?height=200&width=200",
    addresses: [
      {
        id: "addr2",
        title: "محل کار",
        address: "خیابان شریعتی، خیابان ملک، پلاک ۴۵",
        city: "تهران",
        province: "تهران",
        postalCode: "9876543210",
        isDefault: true,
      },
    ],
    createdAt: "2023-02-20T14:45:00Z",
  },
];

// دریافت کاربر با ایمیل
export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

// دریافت کاربر با شناسه
export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

// افزودن کاربر جدید (در یک پروژه واقعی، این تابع با دیتابیس کار می‌کند)
export function addUser(user: Omit<User, "id">): User {
  const newUser = {
    id: Date.now().toString(),
    ...user,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
}
