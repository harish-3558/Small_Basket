
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

export const productUrl = `${apiBaseUrl}/products`
export const imageUrl = apiBaseUrl
export const getProductImageUrl = (path) =>
  path?.startsWith("http") ? path : `${imageUrl}${path || ""}`
export const adminUrl = `${apiBaseUrl}/admin`
export const managementUrl = `${apiBaseUrl}/admin/manage`
export const vendorUrl = `${apiBaseUrl}/vendor`
export const ordersUrl = `${apiBaseUrl}/orders`
export const emailUrl = `${apiBaseUrl}/email`
export const cartUrl = `${apiBaseUrl}/cart`