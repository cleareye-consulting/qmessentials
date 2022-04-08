export interface ValidationResultObject {
  [field: string]: boolean | null
}

export interface User {
  userId: string
  givenNames: string[]
  familyNames: string[]
  emailAddress: string
  isActive: boolean
  roles: string[]
}

export interface Product {
  productId: string
  productName: string
  isActive: boolean
}
