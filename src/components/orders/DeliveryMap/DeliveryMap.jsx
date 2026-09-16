import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { cx } from '@/lib/utils'
import './DeliveryMap.css'

/**
 * Delivery view built over the route artwork: the rider marker animates along
 * the road, so the screen reads as live tracking rather than a static picture.
 */
export function DeliveryMap({ status }) {
  const target = status === 'delivered' ? 1 : status === 'in-transit' ? 0.62 : 0.18
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const id = window.setTimeout(() => setProgress(target), 250)
    return () => window.clearTimeout(id)
  }, [target])

  // Waypoints trace the highlighted road from Benin City up to Kano.
  const path = [
    [0.6, 0.99],
    [0.55, 0.95],
    [0.42, 0.82],
    [0.36, 0.62],
    [0.26, 0.47],
    [0.19, 0.37],
  ]

  const pos = pointAt(path, progress)

  return (
    <div className="delivery-map">
      <img src="/img/delivery-map.jpg" alt="Delivery route from the farm to the delivery address" className="delivery-map-img" />

      <span className="delivery-map-marker" style={{ left: `${pos[0] * 100}%`, top: `${pos[1] * 100}%` }}>
        <span className="delivery-map-marker-inner">
          <span className="delivery-map-ping" />
          <span className="delivery-map-dot">
            <Check className="icon-16" style={{ color: '#fff' }} strokeWidth={3} />
          </span>
        </span>
      </span>

      <span className={cx('delivery-map-badge', status === 'delivered' ? 'delivery-map-badge-delivered' : 'delivery-map-badge-active')}>
        <Check className="icon-16" strokeWidth={3} />
        {status === 'delivered' ? 'Delivered' : status === 'in-transit' ? 'In Transit' : 'Preparing'}
      </span>
    </div>
  )
}

/** Linear interpolation along the waypoint list. */
function pointAt(path, t) {
  if (t <= 0) return path[0]
  if (t >= 1) return path[path.length - 1]
  const span = 1 / (path.length - 1)
  const index = Math.min(path.length - 2, Math.floor(t / span))
  const local = (t - index * span) / span
  const [x1, y1] = path[index]
  const [x2, y2] = path[index + 1]
  return [x1 + (x2 - x1) * local, y1 + (y2 - y1) * local]
}