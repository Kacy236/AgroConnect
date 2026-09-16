import { Link } from 'react-router-dom'
import './CategoryCard.css'

export function CategoryCard({ category }) {
  return (
    <Link to={`/buyer/category/${category.slug}`} className="category-card">
      <span className="category-card-img-wrap">
        <img src={category.image} alt="" loading="lazy" className="category-card-img" />
      </span>
      <span className="category-card-name">{category.name}</span>
    </Link>
  )
}