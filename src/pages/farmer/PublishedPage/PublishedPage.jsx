import { useLocation, useNavigate } from 'react-router-dom'
import { useProducts } from '@/context/ProductContext'
import { Button } from '@/components/ui/Button/Button'
import { SuccessScreen } from '@/components/ui/SuccessMark/SuccessMark'
import { money } from '@/lib/utils'
import './PublishedPage.css'

export function PublishedPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { byId } = useProducts()

  const productId = location.state?.productId
  const product = productId ? byId(productId) : undefined

  return (
    <SuccessScreen
      title="Published"
      actions={
        <div className="published-actions">
          <Button block onClick={() => navigate('/farmer/marketplace', { replace: true })}>
            Continue
          </Button>
          {product ? (
            <Button variant="ghost" block onClick={() => navigate(`/farmer/products/${product.id}`, { replace: true })}>
              View listing
            </Button>
          ) : null}
        </div>
      }
    >
      {product ? (
        <div className="published-card">
          <img src={product.image} alt="" className="published-card-img" />
          <div className="published-card-text">
            <p className="published-card-name">{product.name}</p>
            <p className="published-card-meta">
              {money(product.price)} / {product.unit} · {product.available} {product.unit} available
            </p>
          </div>
        </div>
      ) : null}
    </SuccessScreen>
  )
}