import { useState } from 'react'
import AuthLayout from './AuthLayout'
import Signup from './Signup'
import Signin from './Signin'
import VerifyEmail from './VerifyEmail'
import Onboarding from './Onboarding'

// These are all the possible screens in the auth flow.
// A "state machine" is just a variable that controls
// which screen is visible at any moment.
type AuthScreen =
  | 'signup'
  | 'verify-email'
  | 'signin'
  | 'onboarding'

export default function AuthPage() {
  const [screen, setScreen] = useState<AuthScreen>('signup')
  const [signupEmail, setSignupEmail] = useState('')

  // This function is passed down to child components so they
  // can trigger a screen change. This is called "lifting state up" —
  // the parent owns the state, children just call the setter.
  const go = (s: AuthScreen) => setScreen(s)

  return (
    <AuthLayout>
      {screen === 'signup' && (
        <Signup
          onSuccess={(email) => {
            setSignupEmail(email)
            go('verify-email')
          }}
          onSigninClick={() => go('signin')}
        />
      )}

      {screen === 'verify-email' && (
        <VerifyEmail
          email={signupEmail}
          onContinue={() => go('signin')}
        />
      )}

      {screen === 'signin' && (
        <Signin
          onSuccess={() => go('onboarding')}
          onSignupClick={() => go('signup')}
        />
      )}

      {screen === 'onboarding' && (
        <Onboarding />
      )}
    </AuthLayout>
  )
}