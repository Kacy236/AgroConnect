import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button/Button'
import { SuccessScreen } from '@/components/ui/SuccessMark/SuccessMark'
import './AccountCreatedPage.css'

export function AccountCreatedPage() {
  const { user, role } = useAuth()
  const navigate = useNavigate()

  /** Farmers land in verification first; buyers go straight to the marketplace. */
  function continueOn() {
    if (role === 'farmer') navigate('/farmer/verify/profile', { replace: true })
    else navigate('/buyer', { replace: true })
  }

  return (
    <SuccessScreen
      title="Congratulations!"
      description={
        <>
          <p>Your account has been successfully created.</p>
          <p className="account-created-line">
            You can now start sellimg or buying agricultural products.
          </p>
        </>
      }
      actions={
        <div className="account-created-actions">
          <Button block onClick={continueOn}>
            {role === 'farmer' ? 'Verify my account' : 'Go to Dashboard'}
          </Button>
          {role === 'farmer' ? (
            <Button variant="ghost" block onClick={() => navigate('/farmer', { replace: true })}>
              Skip for now
            </Button>
          ) : null}
        </div>
      }
    >
      {user ? (
        <p className="account-created-signed-in">
          Signed in as <span className="account-created-name">{user.name}</span>
        </p>
      ) : null}
    </SuccessScreen>
  )
}