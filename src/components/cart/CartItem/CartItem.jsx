import { Minus, Plus } from 'lucide-react'
import { money } from '@/lib/utils'
import './CartItem.css'

export function CartItem({ product, qty, onIncrement, onDecrement, onRemove }) {
  return (
    <li className="cart-item">
      <div className="cart-item-row">
        <img src={product.image} alt={product.name} className="cart-item-img" />

        <div className="cart-item-info">
          <p className="cart-item-name">{product.name}</p>
          <p className="cart-item-price">
            {money(product.price)} / {product.unit}
          </p>
        </div>

        <div className="cart-item-stepper">
          <button type="button" onClick={onDecrement} aria-label={`Reduce ${product.name} quantity`} className="cart-item-btn">
            <Minus className="icon-16" />
          </button>
          <span className="cart-item-qty" aria-live="polite">
            {qty}
          </span>
          <button type="button" onClick={onIncrement} aria-label={`Increase ${product.name} quantity`} className="cart-item-btn">
            <Plus className="icon-16" />
          </button>
        </div>

        <p className="cart-item-total cart-item-total-desktop">{money(product.price * qty)}</p>
      </div>

      <div className="cart-item-footer">
        <button type="button" onClick={onRemove} className="cart-item-remove">
          Remove
        </button>
        <p className="cart-item-total cart-item-total-mobile">{money(product.price * qty)}</p>
      </div>
    </li>
  )
}