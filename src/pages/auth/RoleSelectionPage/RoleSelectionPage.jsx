import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button/Button'
import { cx } from '@/lib/utils'
import { AuthSplit } from '../AuthSplit/AuthSplit'
import './RoleSelectionPage.css'

const OPTIONS = [
  {
    role: 'farmer',
    title: 'Farmer',
    blurb: 'Sell produce directly to buyers',
    image: '/img/role-farmer.jpg',
  },
  {
    role: 'buyer',
    title: 'Buyer',
    blurb: 'Purchase fresh agricultural product',
    image: '/img/role-buyer.jpg',
  },
]

export function RoleSelectionPage() {
  const { pendingRole, setPendingRole } = useAuth()
  const navigate = useNavigate()

  return (
    <AuthSplit
      image="/img/auth-market.jpg"
      imageAlt="A buyer and a farmer trading fresh vegetables at a farm stall"
      showBack={false}
    >
      <h1 className="role-title">
        How would you like
        <br />
        to use AgroConnect?
      </h1>
      <p className="role-subtitle">Select an option to conitinue</p>

      <div className="role-options" role="radiogroup" aria-label="Account type">
        {OPTIONS.map((option) => {
          const active = pendingRole === option.role
          return (
            <button
              key={option.role}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPendingRole(option.role)}
              onDoubleClick={() => navigate('/register')}
              className={cx('role-option', active && 'role-option-active')}
            >
              <img src={option.image} alt="" className="role-option-image" />
              <span className="role-option-text">
                <span className="role-option-title">{option.title}</span>
                <span className="role-option-blurb">{option.blurb}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="role-actions">
        <Button block onClick={() => navigate('/register')}>
          Continue as {pendingRole === 'farmer' ? 'Farmer' : 'Buyer'}
        </Button>
        <Button variant="outline" block onClick={() => navigate('/welcome')}>
          Back
        </Button>
      </div>
    </AuthSplit>
  )
}