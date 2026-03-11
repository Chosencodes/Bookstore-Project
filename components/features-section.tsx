import { BookMarked, Heart, Recycle, Truck } from "lucide-react"

const features = [
  {
    icon: BookMarked,
    title: "Selection",
    description: "We have more than 13 million titles to choose from, from the earliest board books to the all-time classics.",
  },
  {
    icon: Heart,
    title: "Purchasing Power",
    description: "With Wish Lists you can choose to be notified the instant we find a copy, see how often we find rare titles.",
  },
  {
    icon: Recycle,
    title: "Used & New books",
    description: "If there is no demand for a book, we will donate it to charity, or we'll recycle it.",
  },
  {
    icon: Truck,
    title: "Shipping & More",
    description: "When you've found the books you want we'll ship qualifying orders to your door for FREE.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-12 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
