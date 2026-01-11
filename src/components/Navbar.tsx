import NavbarClient from './NavbarClient'

export default async function Navbar() {
  // Move auth check to client component to avoid server-side failures
  // This ensures the navbar always renders even if Supabase is unavailable
  return <NavbarClient />
}
