import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/components/admin/category-form"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft } from "lucide-react"
import type { Category } from "@/types/database"

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

async function getCategory(id: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()
  return data as Category | null
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const category = await getCategory(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Category</h1>
          <p className="text-muted-foreground mt-1">
            Update category details
          </p>
        </div>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
