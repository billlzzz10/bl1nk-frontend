'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

type Status = 'loading' | 'success' | 'error'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { authenticateWithToken } = useAuthStore()

  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('Checking your sign-in status...')

  useEffect(() => {
    let redirectTimeout: ReturnType<typeof setTimeout> | null = null

    const token = searchParams.get('token') ?? searchParams.get('access_token')
    const error = searchParams.get('error')
    const redirectPath = searchParams.get('redirect') || '/workspace'

    if (error) {
      setStatus('error')
      setMessage(decodeURIComponent(error))
      return () => {
        if (redirectTimeout) clearTimeout(redirectTimeout)
      }
    }

    if (!token) {
      setStatus('error')
      setMessage('Authentication details not found')
      return () => {
        if (redirectTimeout) clearTimeout(redirectTimeout)
      }
    }

    ;(async () => {
      try {
        await authenticateWithToken(token)
        setStatus('success')
        setMessage('Sign-in successful, redirecting to your workspace...')
        redirectTimeout = setTimeout(() => {
          router.replace(redirectPath)
        }, 1200)
      } catch {
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
      }
    })()

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [authenticateWithToken, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Connecting Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                <p className="text-muted-foreground">{message}</p>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="h-10 w-10 text-red-500" />
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
          </div>

          {status === 'error' && (
            <div className="flex flex-col space-y-2">
              <Button variant="default" onClick={() => router.replace('/auth/login')}>
                Back to Login
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
