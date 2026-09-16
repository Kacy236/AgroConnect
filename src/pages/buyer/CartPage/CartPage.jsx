import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useOrders } from '@/context/OrderContext'
import { useProducts } from '@/context/ProductContext'
import { useToast } from '@/context/ToastContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { CartItem } from '@/components/cart/CartItem/CartItem'
import { ProductTile } from '@/components/marketplace/ProductCard/ProductCard'
import { Button, LinkButton } from '@/components/ui/Button/Button'
import { EmptyState } from '@/components/ui/Bits/Bits'
import { money } from '@/lib/utils'
import './CartPage.css'

export function CartPage() {
  const { user } = useAuth()
  const { lines, increment, decrement, remove, clear, totals } = useCart()
  const { byId, favourites } = useProducts()
  const { placeOrder } = useOrders()
  const { notify } = useToast()
  const navigate = useNavigate()

  const { items, subtotal, deliveryFee, total } = totals(byId)
  const favouriteProducts = favourites.map(byId).filter(Boolean).slice(0, 4)

  function checkout() {
    const orderLines = lines
      .map((l) => {
        const product = byId(l.productId)
        if (!product) return null
        return {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          unit: product.unit,
          qty: l.qty,
        }
      })
      .filter((l) => Boolean(l))

    if (!orderLines.length) return

    const order = placeOrder({
      buyerId: user?.id ?? 'u-sarah',
      buyerName: user?.name ?? 'Sarah Agada',
      lines: orderLines,
      subtotal,
      deliveryFee,
      address: user?.location ?? '14 Adeniran Ogunsanya, Surulere, Lagos',
    })

    clear()
    notify('Order placed successfully')
    navigate(`/buyer/order-placed/${order.id}`, { replace: true })
  }

  return (
    <>
      <div className="mobile-only">
        <PageHeader title="My Cart" backTo="/buyer" />
      </div>
      <div className="desktop-only cart-desktop-header">
        <h1 className="cart-desktop-title">My Cart</h1>
      </div>

      <div className="cart-body">
        {lines.length ? (
          <div className="cart-layout">
            <ul className="min-w-0 flex-1">
              {lines.map((line) => {
                const product = byId(line.productId)
                if (!product) return null
                return (
                  <CartItem
                    key={line.productId}
                    product={product}
                    qty={line.qty}
                    onIncrement={() => increment(line.productId)}
                    onDecrement={() => decrement(line.productId)}
                    onRemove={() => {
                      remove(line.productId)
                      notify(`${product.name} removed from cart`)
                    }}
                  />
                )
              })}
            </ul>

            <aside className="cart-summary-aside">
              <div className="cart-summary-card">
                <h2 className="cart-summary-title">CART SUMMARY</h2>
                <dl className="cart-summary-list">
                  <div className="cart-summary-row cart-summary-row--tinted">
                    <dt>Total Item ( {items} )</dt>
                    <dd>{money(subtotal)}</dd>
                  </div>
                  <div className="cart-summary-row">
                    <dt className="text-ink">Delivery Fee</dt>
                    <dd className="value-bold">{money(deliveryFee)}</dd>
                  </div>
                  <div className="cart-summary-row">
                    <dt className="value-bold">Subtotal</dt>
                    <dd className="value-bold">{money(total)}</dd>
                  </div>
                </dl>
                <div className="cart-summary-checkout">
                  <Button block size="md" onClick={checkout}>
                    Checkout
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon={<ShoppingCart className="icon-md-lg" />}
              title="Your cart is empty"
              description="Browse the marketplace and add some fresh produce."
              action={<LinkButton to="/buyer">Start shopping</LinkButton>}
            />
          </div>
        )}

        {favouriteProducts.length ? (
          <section className="mt-10">
            <h2 className="favourites-title">Favourite</h2>
            <div className="tile-grid">
              {favouriteProducts.map((p) => (
                <ProductTile key={p.id} product={p} to={`/buyer/product/${p.id}`} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  )
}