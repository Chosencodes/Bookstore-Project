import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookForm } from "@/components/admin/book-form"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft } from "lucide-react"
import type { Category } from "@/types/database"

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  return (data as Category[]) || []
}

export default async function NewBookPage() {
  const categories = await getCategories()

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
          <h1 className="text-3xl font-bold text-foreground">Add New Book</h1>
          <p className="text-muted-foreground mt-1">
            Add a new book to your inventory
          </p>
        </div>
      </div>

      <BookForm categories={categories} />
    </div>
  )
}
