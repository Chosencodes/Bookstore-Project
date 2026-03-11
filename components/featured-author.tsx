import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book-card"
import type { BookWithCategory } from "@/types/database"

interface FeaturedAuthorProps {
  authorBooks: BookWithCategory[]
}

export function FeaturedAuthor({ authorBooks }: FeaturedAuthorProps) {
  const authorName = authorBooks[0]?.author || "Featured Author"
  
  return (
    <section className="py-16 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest text-primary font-medium">Contact</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">Featured author</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Author Info */}
          <div className="bg-card rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{authorName}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  A celebrated author known for their phenomenally successful debut thriller. 
                  Before their breakout entry into the realms of fiction, they worked as a journalist, 
                  magazine editor and speech writer, as well as writing for the stage and screen.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Their first feature film came out in 2011, and they won the award for Best New 
                  Screenplay at the 2014 Independent Film Festival.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href={`/books?author=${encodeURIComponent(authorName)}`}>
                    view profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Author Books */}
          <div className="grid grid-cols-2 gap-4">
            {authorBooks.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
