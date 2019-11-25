import Cookies from 'js-cookie'

export function getCsrfToken(): string {
  return Cookies.get('CSRF') as string
}
