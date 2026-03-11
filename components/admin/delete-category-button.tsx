"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface DeleteCategoryButtonProps {
  categoryId: string
  categoryName: string
  bookCount: number
}

export function DeleteCategoryButton({ categoryId, categoryName, bookCount }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Error deleting category:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive"
          disabled={bookCount > 0}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            {bookCount > 0 ? (
              <>
                Cannot delete &quot;{categoryName}&quot; because it has {bookCount} {bookCount === 1 ? "book" : "books"} assigned.
                Please reassign or delete the books first.
              </>
            ) : (
              <>
                Are you sure you want to delete &quot;{categoryName}&quot;? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {bookCount === 0 && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
