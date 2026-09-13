import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CategorySlug, Product, Review } from '@/lib/types'
import { PRODUCTS } from '@/data/seed'
import { KEYS, load, save } from '@/lib/storage'
import { uid } from '@/lib/utils'

export type NewProduct = Omit<
  Product,
  'id' | 'farmerId' | 'farmName' | 'location' | 'inStock' | 'rating' | 'reviews' | 'createdAt'
>

interface ProductValue {
  products: Product[]
  favourites: string[]
  byId: (id: string) => Product | undefined
  byCategory: (slug: CategorySlug) => Product[]
  search: (query: string, category?: CategorySlug | 'all') => Product[]
  bestSellers: Product[]
  addProduct: (input: NewProduct) => Product
  updateProduct: (id: string, patch: Partial<Product>) => void
  toggleStock: (id: string) => void
  removeProduct: (id: string) => void
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void
  toggleFavourite: (id: string) => void
  isFavourite: (id: string) => boolean
}

const ProductContext = createContext<ProductValue | null>(null)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => load(KEYS.products, PRODUCTS))
  const [favourites, setFavourites] = useState<string[]>(() =>
    load(KEYS.favourites, ['p-tomato', 'p-potato', 'p-bell-pepper', 'p-carrot']),
  )

  useEffect(() => {
    save(KEYS.products, products)
  }, [products])

  useEffect(() => {
    save(KEYS.favourites, favourites)
  }, [favourites])

  const byId = useCallback((id: string) => products.find((p) => p.id === id), [products])

  const byCategory = useCallback(
    (slug: CategorySlug) => products.filter((p) => p.category === slug),
    [products],
  )

  const search = useCallback(
    (query: string, category: CategorySlug | 'all' = 'all') => {
      const q = query.trim().toLowerCase()
      return products.filter((p) => {
        const matchesCategory = category === 'all' || p.category === category
        const matchesQuery =
          !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        return matchesCategory && matchesQuery
      })
    },
    [products],
  )

  const bestSellers = useMemo(
    () => products.filter((p) => p.inStock).slice(0, 4),
    [products],
  )

  const addProduct = useCallback((input: NewProduct) => {
    const product: Product = {
      ...input,
      id: uid('p'),
      farmerId: 'u-musa',
      farmName: 'Musa Field Farm',
      location: 'Kaduna',
      inStock: true,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
    }
    setProducts((list) => [product, ...list])
    return product
  }, [])

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const toggleStock = useCallback((id: string) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)))
  }, [])

  const removeProduct = useCallback((id: string) => {
    setProducts((list) => list.filter((p) => p.id !== id))
  }, [])

  const addReview = useCallback((productId: string, review: Omit<Review, 'id' | 'date'>) => {
    setProducts((list) =>
      list.map((p) => {
        if (p.id !== productId) return p
        const reviews = [
          { ...review, id: uid('r'), date: new Date().toISOString() },
          ...p.reviews,
        ]
        const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        return { ...p, reviews, rating: Math.round(rating * 10) / 10 }
      }),
    )
  }, [])

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((list) => (list.includes(id) ? list.filter((f) => f !== id) : [...list, id]))
  }, [])

  const isFavourite = useCallback((id: string) => favourites.includes(id), [favourites])

  const value = useMemo<ProductValue>(
    () => ({
      products,
      favourites,
      byId,
      byCategory,
      search,
      bestSellers,
      addProduct,
      updateProduct,
      toggleStock,
      removeProduct,
      addReview,
      toggleFavourite,
      isFavourite,
    }),
    [
      products,
      favourites,
      byId,
      byCategory,
      search,
      bestSellers,
      addProduct,
      updateProduct,
      toggleStock,
      removeProduct,
      addReview,
      toggleFavourite,
      isFavourite,
    ],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts(): ProductValue {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used inside <ProductProvider>')
  return ctx
}
