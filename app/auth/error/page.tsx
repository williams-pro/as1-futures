import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AuthErrorPageProps {
  searchParams: {
    error?: string
  }
}

const errorMessages = {
  auth_callback_error: 'Error during authentication. Please try again.',
  user_not_found: 'User not found in the system. Please contact support.',
  account_inactive: 'Your account has been deactivated. Contact support for more information.',
  role_lookup_failed: 'Unable to verify your permissions. Please try again or contact support.',
  no_session: 'Your session has expired. Please log in again.',
  unexpected_error: 'An unexpected error occurred. Please try again.',
  default: 'Authentication failed. Please try again.'
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const error = searchParams.error || 'default'
  const message = errorMessages[error as keyof typeof errorMessages] || errorMessages.default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-as1-gold-50/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Authentication Error</CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Try Again
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
