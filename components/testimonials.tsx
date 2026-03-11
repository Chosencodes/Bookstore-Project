"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    text: "This is the best book store! A wide variety. The prices are great, and there is always a sale of some kind going on. You can find just what you are looking for here.",
    author: "Pam Pruitt",
    location: "new york",
  },
  {
    text: "I am so happy to find a site where I can shop for unusual items. The packaging was phenomenal and my book arrived on time in perfect condition.",
    author: "Joel M.",
    location: "new york",
  },
  {
    text: "Excellent service. The books were wrapped securely and arrived in pristine condition. I sent an email after the books arrived to ask about the author.",
    author: "Ellie A.",
    location: "new york",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card className="bg-transparent border-none shadow-none">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <Quote className="h-10 w-10 text-primary-foreground/50 mb-6" />
                    <h3 className="text-lg font-semibold text-primary-foreground mb-4">
                      What people saying!
                    </h3>
                    <p className="text-primary-foreground/90 text-lg leading-relaxed max-w-2xl mb-6">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-primary-foreground">{testimonial.author}</p>
                      <p className="text-sm text-primary-foreground/70">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-6">
            <CarouselPrevious className="static translate-y-0 bg-primary-foreground/20 hover:bg-primary-foreground/30 border-none text-primary-foreground" />
            <CarouselNext className="static translate-y-0 bg-primary-foreground/20 hover:bg-primary-foreground/30 border-none text-primary-foreground" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
