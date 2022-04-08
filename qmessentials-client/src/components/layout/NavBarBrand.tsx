import { Link } from 'react-router-dom'

export interface NavBarBrandParams {
  logo: string
  text: string
  onClick: () => void
}

export default function NavBarBrand({ logo, text }: NavBarBrandParams) {
  return (
    <Link className="navbar-brand" to="/">
      <img src={logo} alt="logo" height="80" />
      <span>{text}</span>
    </Link>
  )
}
