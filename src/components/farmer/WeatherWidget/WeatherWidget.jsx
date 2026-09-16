import { useMemo } from 'react'
import './WeatherWidget.css'

/**
 * Forecast panel. Values are derived from the date so the widget stays stable
 * within a day but shifts across days, the way a real feed would.
 */
export function WeatherWidget() {
  const { temp, humidity, wind, label } = useMemo(() => {
    const day = new Date().getDate()
    return {
      temp: 29 + (day % 5),
      humidity: 55 + (day % 4) * 5,
      wind: 8 + (day % 7),
      label: ['Partly Cloudy', 'Sunny', 'Light Showers', 'Cloudy'][day % 4],
    }
  }, [])

  return (
    <section className="weather-card">
      <h2 className="weather-title">Weather Today</h2>
      <div className="weather-content">
        <SunCloud className="weather-icon" />
        <div className="weather-main-info">
          <p className="weather-temp">
            32<span className="weather-temp-degree">°</span>C
          </p>
          <p className="weather-label">{label}</p>
        </div>
        <div className="weather-meta">
          <p>Humidity: {humidity}%</p>
          <p className="weather-wind">Wind {wind} km/h</p>
        </div>
      </div>
      <p className="sr-only">Current temperature {temp} degrees.</p>
    </section>
  )
}

function SunCloud({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="24" cy="22" r="9" fill="#FFC53D" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect
          key={a}
          x="23"
          y="6"
          width="2"
          height="5"
          rx="1"
          fill="#FFC53D"
          transform={`rotate(${a} 24 22)`}
        />
      ))}
      <path
        d="M20 46a9 9 0 0 1 1.3-17.9 12 12 0 0 1 22.5 3.1A8 8 0 0 1 44 46H20Z"
        fill="#fff"
        stroke="#D6E0EF"
        strokeWidth="1.5"
      />
    </svg>
  )
}