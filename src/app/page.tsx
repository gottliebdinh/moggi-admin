import { redirect } from 'next/navigation'

export default function HomePage() {
  // Automatisch zu /orders weiterleiten
  redirect('/orders')
}