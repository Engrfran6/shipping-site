// Database types for TypeScript support
export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  company_name?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country: string
  user_type: "client" | "admin" | "guest"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Shipment {
  id: string
  tracking_number: string
  user_id?: string

  // Sender information
  sender_name: string
  sender_email?: string
  sender_phone?: string
  sender_address: string
  sender_city: string
  sender_state: string
  sender_postal_code: string
  sender_country: string

  // Recipient information
  recipient_name: string
  recipient_email?: string
  recipient_phone?: string
  recipient_address: string
  recipient_city: string
  recipient_state: string
  recipient_postal_code: string
  recipient_country: string

  // Package information
  package_type: "envelope" | "box" | "tube" | "custom"
  weight_kg: number
  length_cm?: number
  width_cm?: number
  height_cm?: number
  declared_value: number
  description?: string

  // Service information
  service_type: "standard" | "express" | "overnight" | "international"
  delivery_instructions?: string
  signature_required: boolean
  insurance_required: boolean

  // Status and tracking
  status:
    | "pending"
    | "confirmed"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "exception"
    | "cancelled"
  estimated_delivery_date?: string
  actual_delivery_date?: string

  // Pricing
  base_cost: number
  insurance_cost: number
  tax_amount: number
  total_cost: number

  created_at: string
  updated_at: string
}

export interface TrackingEvent {
  id: string
  shipment_id: string
  event_type: string
  event_description: string
  location?: string
  created_at: string
  created_by?: string
}

export interface Quote {
  id: string
  user_id?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string

  // Shipping details
  origin_address: string
  origin_city: string
  origin_state: string
  origin_postal_code: string
  origin_country: string

  destination_address: string
  destination_city: string
  destination_state: string
  destination_postal_code: string
  destination_country: string

  // Package information
  package_type: "envelope" | "box" | "tube" | "custom"
  weight_kg: number
  length_cm?: number
  width_cm?: number
  height_cm?: number
  declared_value: number

  // Service preferences
  service_type: "standard" | "express" | "overnight" | "international"
  signature_required: boolean
  insurance_required: boolean

  // Quote details
  estimated_cost?: number
  estimated_delivery_days?: number
  quote_expires_at?: string
  status: "pending" | "quoted" | "accepted" | "expired" | "cancelled"

  created_at: string
  updated_at: string
}

export interface ShippingCostCalculation {
  base_cost: number
  weight_cost: number
  insurance_cost: number
  total_cost: number
  billable_weight_kg: number
  estimated_delivery_days: number
  error?: string
}
