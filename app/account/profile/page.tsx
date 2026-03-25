import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileSettings } from "@/components/account/profile-settings"
import type { Profile } from "@/types/database"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const safeProfile = profile as Profile | null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Update your email and password</p>
        </div>
        <Link href="/account" className="text-sm text-primary hover:underline">
          Back to Account
        </Link>
      </div>

      <ProfileSettings
        initialEmail={user.email ?? ""}
        profileEmail={safeProfile?.email ?? null}
      />
    </div>
  )
}
