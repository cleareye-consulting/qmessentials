import { useLocation } from 'react-router'

export default function useQuery(...paramNames) {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const values = []
  for (let paramName of paramNames) {
    const value = params[paramName]
    values.push(value)
  }
  return values
}
