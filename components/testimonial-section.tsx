"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "علی محمدی",
    role: "کلکسیونر به مدت ۸ سال",
    content:
      "کیفیت مجسمه‌های AME-TAMA بی‌نظیر است. توجه به جزئیات در مجسمه لوفی گیر ۵ من واقعاً خیره‌کننده است. برای کلکسیونرهای جدی ارزش هر ریال را دارد.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "مریم حسینی",
    role: "علاقه‌مند به انیمه",
    content:
      "من از بسیاری از فروشندگان مجسمه‌های لوکس خرید کرده‌ام، اما AME-TAMA با صنعتگری استثنایی و خدمات مشتری خود متمایز است. مجسمه گوجو من نقطه مرکزی مجموعه من است.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "امیر رضایی",
    role: "کلکسیونر و منتقد",
    content:
      "بسته‌بندی به تنهایی نشان‌دهنده تعهد AME-TAMA به کیفیت است. هر مجسمه در شرایط عالی می‌رسد و گواهی‌های اصالت، آن لمس اضافی از لوکس بودن را اضافه می‌کنند.",
    rating: 4,
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)

    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  // For mobile, show one testimonial at a time
  // For desktop, show all testimonials
  const displayedTestimonials = width < 768 ? [testimonials[currentIndex]] : testimonials

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent font-vazirmatn">
            نظرات کلکسیونرهای ما
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-vazirmatn">
            به جامعه کلکسیونرهای مشتاق ما بپیوندید که برای مجسمه‌های انیمه لوکس خود به AME-TAMA اعتماد می‌کنند.
          </p>
        </div>

        <div className="relative">
          {/* Mobile navigation buttons */}
          {width < 768 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md md:hidden"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">نظر قبلی</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md md:hidden"
                onClick={nextTestimonial}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">نظر بعدی</span>
              </Button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ml-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 font-vazirmatn">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600",
                      )}
                    />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 italic font-vazirmatn">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile pagination indicators */}
          {width < 768 && (
            <div className="flex justify-center mt-6 gap-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex ? "bg-purple-500 w-6" : "bg-gray-300 dark:bg-gray-600",
                  )}
                  aria-label={`رفتن به نظر ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
