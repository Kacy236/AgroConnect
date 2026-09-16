import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button/Button'
import { SuccessScreen } from '@/components/ui/SuccessMark/SuccessMark'

export function VerificationApproved() {
  const navigate = useNavigate()

  return (
    <SuccessScreen
      title="Approved"
      description={
        <>
          <p>Your account has been successfully approved.</p>
          <p style={{ marginTop: '1rem' }}>You can now start selling agricultural product.</p>
        </>
      }
      actions={
        <Button block onClick={() => navigate('/farmer', { replace: true })}>
          Continue
        </Button>
      }
    />
  )
}