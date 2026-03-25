'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }
  return (
    <Button variant="outline" className={className} onClick={handleSignOut} asChild={false}>
      <span>Sign Out</span>
    </Button>
  )
}
