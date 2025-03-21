export const TRANSACTION_TYPES = ["income", "expense"] as const;

export const TRANSACTION_CATEGORIES = {
    income: [
        "salary", "freelance", "investments", "business_revenue", "gifts", 
        "refunds", "bonuses", "rental_income", "other_income"
    ],
    expense: [
        "rent", "mortgage", "property_taxes", "home_insurance", "electricity", 
        "water", "gas", "internet", "phone_bill", "groceries", "restaurants", 
        "coffee_shops", "fast_food", "fuel", "public_transport", "car_maintenance", 
        "parking", "ride_sharing", "medical_bills", "health_insurance", "gym_membership", 
        "pharmacy", "streaming_services", "movies", "concerts", "gaming", "clothing", 
        "accessories", "electronics", "home_decor", "courses", "books", "subscriptions", 
        "school_fees", "credit_card_payments", "student_loans", "personal_loans", 
        "retirement_fund", "stocks", "emergency_fund", "flights", "hotels", 
        "transportation", "tourist_activities", "charity", "gifts_expenses", "miscellaneous"
    ]
} as const;

export const DEFAULT_OFFSET = 20
export const DEFAULT_FIXED_LIMIT = 20
export const DEFAULT_PER_PAGE_MIN = 10
export const DEFAULT_PER_PAGE_MAX = 30
