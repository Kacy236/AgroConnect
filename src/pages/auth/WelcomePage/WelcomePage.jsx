import { LinkButton } from '@/components/ui/Button/Button'
import { Logo } from '@/components/ui/Bits/Bits'
import './WelcomePage.css'

export function WelcomePage() {
  return (
    <div className="welcome">
      <div className="welcome-hero">
        <img
          src="/img/welcome-hero.jpg"
          alt="A farmer holding a basket of freshly harvested vegetables"
          className="welcome-hero-image"
        />
        <div className="welcome-logo-wrap">
          <Logo className="welcome-logo" />
        </div>
        <div className="welcome-fade" />
      </div>

      <div className="welcome-panel">
        <div className="welcome-panel-inner">
          <LinkButton to="/role" block>
            Get Started
          </LinkButton>
          <LinkButton to="/login" variant="outline" block>
            Login
          </LinkButton>
        </div>
      </div>
    </div>
  )
}