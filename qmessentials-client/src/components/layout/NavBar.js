export default function NavBar({ children }) {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">{children}</div>
    </nav>
  )
}
