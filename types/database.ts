export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Book {
  id: string
  title: string
  author: string
  price: number
  stock: number
  category_id: string | null
  description: string | null
  cover_image: string | null
  created_at: string
}

export interface BookWithCategory extends Book {
  category: Category | null
}

export interface Profile {
  id: string
  email: string | null
  role: 'admin' | 'user'
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at: string
  items?: OrderItem[]
  profile?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  book_id: string
  quantity: number
  price: number
  created_at: string
  book?: Book
}

export interface CartItem {
  book: Book
  quantity: number
}
