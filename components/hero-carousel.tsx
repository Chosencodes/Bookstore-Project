"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"

const slides = [
  {
    tag: "editor choice",
    title: "top 10 books to make it a great year",
    bgColor: "bg-amber-50",
    image: "/hero-books-1.jpg",
  },
  {
    tag: "editor choice",
    title: "Meet Your Next Favorite Book.",
    subtitle: "Original Price $45.55",
    price: "$24.55",
    bgColor: "bg-rose-50",
    image: "/hero-books-2.jpg",
  },
  {
    tag: "editor choice",
    title: "our sci-fi & fantasy picks",
    subtitle: "Original Price $45.55",
    price: "$24.55",
    bgColor: "bg-sky-50",
    image: "/hero-books-3.jpg",
  },
]

export function HeroCarousel() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className={`relative ${slide.bgColor} min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]`}>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12 lg:py-0">
                  <div className="flex flex-col items-start gap-4 lg:max-w-md z-10">
                    <span className="text-xs uppercase tracking-widest text-primary font-medium">
                      {slide.tag}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="text-muted-foreground line-through">{slide.subtitle}</p>
                    )}
                    {slide.price && (
                      <p className="text-2xl font-bold text-primary">{slide.price}</p>
                    )}
                    <Button size="lg" className="mt-4" asChild>
                      <Link href="/books">Shop Now</Link>
                    </Button>
                  </div>
                  <div className="relative w-full lg:w-1/2 h-48 sm:h-64 lg:h-96 mt-8 lg:mt-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-48 sm:w-64 lg:w-80 h-64 sm:h-80 lg:h-96">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg transform rotate-3" />
                        <div className="absolute inset-0 bg-card rounded-lg shadow-2xl transform -rotate-3 flex items-center justify-center">
                          <span className="text-6xl">📚</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <CarouselPrevious className="static translate-y-0 bg-background/80 hover:bg-background" />
        <CarouselNext className="static translate-y-0 bg-background/80 hover:bg-background" />
      </div>
    </Carousel>
  )
}
