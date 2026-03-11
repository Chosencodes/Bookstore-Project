import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import type { BookWithCategory } from "@/types/database"

interface BookCardProps {
  book: BookWithCategory
  showDescription?: boolean
}

export function BookCard({ book, showDescription = false }: BookCardProps) {
  // Generate a random rating between 3 and 5 for display (seeded by book id for consistency)
  const rating = 3.5 + (book.id.charCodeAt(0) % 15) / 10

  return (
    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 bg-card">
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary/30">
        <Link href={`/books/${book.id}`}>
          {book.cover_image ? (
            <Image
              src={book.cover_image}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/5 to-primary/20">
              <span className="text-5xl font-serif text-primary/40">{book.title.charAt(0)}</span>
            </div>
          )}
        </Link>
        
        {/* Out of stock badge */}
        {book.stock === 0 && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            Out of Stock
          </Badge>
        )}
        
        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" asChild>
            <Link href={`/books/${book.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Quick view</span>
            </Link>
          </Button>
        </div>
        
        {/* Add to cart button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <Button 
            className="w-full" 
            size="sm"
            disabled={book.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to cart
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-col gap-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({(book.id.charCodeAt(1) % 20) + 1})</span>
          </div>
          
          {/* Title */}
          <Link href={`/books/${book.id}`}>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
          </Link>
          
          {/* Author */}
          <p className="text-sm text-muted-foreground">{book.author}</p>
          
          {/* Description (optional) */}
          {showDescription && book.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {book.description}
            </p>
          )}
          
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-primary text-lg">
              ${book.price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
