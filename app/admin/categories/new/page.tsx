import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/components/admin/category-form"
import { ArrowLeft } from "lucide-react"

export default function NewCategoryPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Add New Category</h1>
          <p className="text-muted-foreground mt-1">
            Create a new book category
          </p>
        </div>
      </div>

      <CategoryForm />
    </div>
  )
}
