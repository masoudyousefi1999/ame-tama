"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// تصاویر اسلایدر
const slides = [
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "مجسمه‌های انیمه لوکس",
    description: "مجموعه‌ای از بهترین مجسمه‌های انیمه با کیفیت استثنایی و جزئیات خیره‌کننده",
    cta: "مشاهده مجموعه",
    link: "#categories",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "محصولات جدید",
    description: "جدیدترین مجسمه‌های اضافه شده به مجموعه AME-TAMA را کشف کنید",
    cta: "مشاهده محصولات جدید",
    link: "#new-arrivals",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "نسخه‌های محدود",
    description: "مجسمه‌های کمیاب و نسخه‌های محدود که فقط برای مدت کوتاهی در دسترس هستند",
    cta: "مشاهده نسخه‌های محدود",
    link: "#limited-editions",
  },
]

export default function ShopHeader() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // تغییر خودکار اسلاید
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // تغییر به اسلاید مشخص
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden">
      {/* اسلایدر تصاویر */}
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentSlide === index ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 backdrop-blur-sm" />

          {/* محتوای اسلاید */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl font-vazirmatn"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 20,
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-8 max-w-2xl font-vazirmatn"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 20,
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {slide.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 20,
              }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="rounded-full bg-white text-purple-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group font-vazirmatn"
                asChild
              >
                <a href={slide.link}>
                  {slide.cta}
                  <ArrowRight className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rotate-180" />
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* نشانگرهای اسلاید */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`رفتن به اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
