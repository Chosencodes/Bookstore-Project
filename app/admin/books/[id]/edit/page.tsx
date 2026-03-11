import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookForm } from "@/components/admin/book-form"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft } from "lucide-react"
import type { Book, Category } from "@/types/database"

interface EditBookPageProps {
  params: Promise<{ id: string }>
}

async function getBook(id: string): Promise<Book | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single()
  return data as Book | null
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  return (data as Category[]) || []
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params
  const [book, categories] = await Promise.all([
    getBook(id),
    getCategories(),
  ])

  if (!book) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/books">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Book</h1>
          <p className="text-muted-foreground mt-1">
            Update book details
          </p>
        </div>
      </div>

      <BookForm book={book} categories={categories} />
    </div>
  )
}
