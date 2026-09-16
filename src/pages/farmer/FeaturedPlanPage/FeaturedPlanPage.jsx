import React, { useState } from 'react'
import { BadgeCheck, Sprout } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { Button } from '@/components/ui/Button/Button'
import './FeaturedPlanPage.css' // Importing the normal CSS

const PLANS = [
  {
    id: 'starter',
    name: 'Featured Starter',
    monthly: 7500,
    blurb: 'Get started and get noticed',
    perks: [
      'Featured on homepage',
      'Showcase your farm',
      'Priority in search results.',
      'Dedicated support',
    ],
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Featured Premium',
    monthly: 12500,
    blurb: 'Get started and get noticed',
    perks: [
      'Top dashboard placement',
      'Featured badge on listings',
      'Social media promotion',
      'Priority in search results',
      'Dedicated account manager',
    ],
    highlight: true,
  },
]

export function FeaturedPlanPage() {
  const { notify } = useToast()
  const [yearly, setYearly] = useState(false)

  function price(monthly) {
    // A year up front saves 20%.
    return yearly ? Math.round(monthly * 12 * 0.8) : monthly
  }

  return (
    <div className="featured-plan-page">
      <PageHeader title="Choose a Featured Plan" backTo="/farmer/profile" align="left" />

      <div className="featured-plan-container">
        <p className="intro-text">
          Subscribe to be the first few featured.
        </p>

        <div
          className="billing-toggle-container"
          role="tablist"
          aria-label="Billing period"
        >
          <button
            role="tab"
            aria-selected={!yearly}
            onClick={() => setYearly(false)}
            className={`toggle-btn ${!yearly ? 'active' : 'inactive'}`}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={yearly}
            onClick={() => setYearly(true)}
            className={`toggle-btn yearly-btn ${yearly ? 'active' : 'inactive-yearly'}`}
          >
            Yearly
            <span className="save-badge">
              Saved 20%
            </span>
          </button>
        </div>

        <div className="plans-grid">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`plan-card ${plan.highlight ? 'highlighted' : 'standard'}`}
            >
              <h2 className="plan-title">{plan.name}</h2>
              <p className="plan-price">
                ₦ {price(plan.monthly).toLocaleString('en-NG')}
                <span className="plan-period">
                  /{yearly ? 'year' : 'month'}
                </span>
              </p>
              <p className="plan-blurb">{plan.blurb}</p>

              <ul className="perks-list">
                {plan.perks.map((perk, i) => (
                  <li key={perk} className="perk-item">
                    <BadgeCheck className="perk-icon" />
                    <span
                      className={`perk-text ${i === 0 ? 'perk-text-bold' : ''}`}
                    >
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="choose-btn"
                variant={plan.highlight ? 'primary' : 'outline'}
                size="md"
                block
                onClick={() => notify(`${plan.name} selected — billing is not wired up in this demo`)}
              >
                Choose Plan
              </Button>
            </article>
          ))}
        </div>

        <p className="footer-note">
          <span className="footer-icon-wrapper">
            <Sprout className="footer-icon" />
          </span>
          You will be among the first few farms featured on AgroConnect after subscription.
        </p>
      </div>
    </div>
  )
}