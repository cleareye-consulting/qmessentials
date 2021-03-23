import { Link } from 'react-router-dom'

export default function NavBarBrand({ logo, text }) {
  return (
    <Link className="navbar-brand" to="/">
      <img src={logo} alt="logo" height="80" />
      <span>{text}</span>
    </Link>
  )
}
