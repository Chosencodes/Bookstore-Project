'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileSettings({
  initialEmail,
  profileEmail,
}: {
  initialEmail: string
  profileEmail: string | null
}) {
  const router = useRouter()
  const [email, setEmail] = useState(profileEmail ?? initialEmail)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingEmail, setIsSavingEmail] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [emailMessage, setEmailMessage] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  const canSavePassword = useMemo(() => {
    if (!newPassword) return false
    return newPassword === confirmPassword
  }, [newPassword, confirmPassword])

  const handleUpdateEmail = async () => {
    setEmailMessage(null)
    setIsSavingEmail(true)
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('Not signed in')

      const { error: updateAuthError } = await supabase.auth.updateUser({ email })
      if (updateAuthError) throw updateAuthError

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ email })
        .eq('id', user.id)
      if (updateProfileError) throw updateProfileError

      setEmailMessage('Email updated. You may need to confirm the change via email.')
      router.refresh()
    } catch (err) {
      setEmailMessage(err instanceof Error ? err.message : 'Failed to update email')
    } finally {
      setIsSavingEmail(false)
    }
  }

  const handleUpdatePassword = async () => {
    setPasswordMessage(null)
    setIsSavingPassword(true)
    try {
      if (!canSavePassword) {
        throw new Error('Passwords do not match')
      }
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordMessage('Password updated.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMessage(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Update the email address associated with your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailMessage && <p className="text-sm text-muted-foreground">{emailMessage}</p>}
          <Button onClick={handleUpdateEmail} disabled={isSavingEmail || !email}>
            {isSavingEmail ? 'Saving...' : 'Save Email'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Set a new password for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {passwordMessage && <p className="text-sm text-muted-foreground">{passwordMessage}</p>}
          <Button onClick={handleUpdatePassword} disabled={isSavingPassword || !canSavePassword}>
            {isSavingPassword ? 'Saving...' : 'Save Password'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
