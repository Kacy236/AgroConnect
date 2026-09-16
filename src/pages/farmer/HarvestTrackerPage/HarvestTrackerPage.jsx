import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/context/ProductContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { HarvestCalendar } from '@/components/farmer/HarvestCalendar/HarvestCalendar'
import { WeatherWidget } from '@/components/farmer/WeatherWidget/WeatherWidget'
import { HARVESTS } from '@/data/seed'
import { longDate } from '@/lib/utils'
import './HarvestTrackerPage.css' // Importing the normal CSS

export function HarvestTrackerPage() {
  const { products } = useProducts()
  const upcoming = HARVESTS[0]
  const rest = HARVESTS.slice(1)

  function productLink(name) {
    const match = products.find((p) => p.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]))
    return match ? `/farmer/products/${match.id}` : '/farmer/marketplace'
  }

  return (
    <div className="harvest-tracker-page">
      <PageHeader title="Harvest Tracker" backTo="/farmer" />

      <div className="harvest-container">
        <section className="upcoming-harvest-card">
          <div className="upcoming-header">
            <h2 className="upcoming-title">Upcoming Harvest</h2>
            <Link to="#calendar" className="calendar-link">
              View Calendar
            </Link>
          </div>

          <div className="upcoming-content">
            <img
              src={upcoming.image}
              alt=""
              className="upcoming-image"
            />
            <div className="upcoming-details">
              <p className="upcoming-product-name">{upcoming.productName}</p>
              <div className="progress-container">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${upcoming.progress}%` }}
                  />
                </div>
                <span className="progress-text">
                  {upcoming.progress}%
                </span>
              </div>
            </div>
          </div>
        </section>

        <div id="calendar">
          <HarvestCalendar
            harvestDates={HARVESTS.map((h) => h.date)}
            initialMonth={new Date(upcoming.date)}
          />
        </div>

        <WeatherWidget />

        <section className="next-up-section">
          <h2 className="next-up-title">Next up</h2>
          <ul className="next-up-list">
            {rest.map((h) => (
              <li key={h.id}>
                <Link
                  to={productLink(h.productName)}
                  className="next-up-card"
                >
                  <img
                    src={h.image}
                    alt=""
                    className="next-up-image"
                  />
                  <div className="next-up-details">
                    <p className="next-up-product-name">{h.productName}</p>
                    <p className="next-up-date">{longDate(h.date)}</p>
                  </div>
                  <span className="next-up-progress">
                    {h.progress}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}