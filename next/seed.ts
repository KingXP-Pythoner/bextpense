import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

// Number of transactions to generate
const NUM_TRANSACTIONS = 30_000;

// Define Income and Expense categories
const incomeCategories = [
  "salary", "freelance", "investments", "business_revenue", "gifts", 
  "refunds", "bonuses", "rental_income", "other_income"
];

const expenseCategories = [
  "rent", "mortgage", "property_taxes", "home_insurance", "electricity", 
  "water", "gas", "internet", "phone_bill", "groceries", "restaurants", 
  "coffee_shops", "fast_food", "fuel", "public_transport", "car_maintenance", 
  "parking", "ride_sharing", "medical_bills", "health_insurance", "gym_membership", 
  "pharmacy", "streaming_services", "movies", "concerts", "gaming", "clothing", 
  "accessories", "electronics", "home_decor", "courses", "books", "subscriptions", 
  "school_fees", "credit_card_payments", "student_loans", "personal_loans", 
  "retirement_fund", "stocks", "emergency_fund", "flights", "hotels", 
  "transportation", "tourist_activities", "charity", "gifts_expenses", "miscellaneous"
];

// Define the date range (from 3 years ago until now)
const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 5);
const endDate = new Date();

// Calculate total months between dates
const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
// Set minimum and maximum transactions per month
const MIN_TRANSACTIONS_PER_MONTH = 30;
const MAX_TRANSACTIONS_PER_MONTH = 100;

const transactions = [];

// Generate transactions for each month
for (let m = 0; m <= monthDiff; m++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + m);
    const monthEnd = new Date(currentDate);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);

    // Random number of transactions for this month
    const monthlyTransactions = faker.number.int({ 
        min: MIN_TRANSACTIONS_PER_MONTH, 
        max: MAX_TRANSACTIONS_PER_MONTH 
    });

    // Generate multiple transactions for this month
    for (let i = 0; i < monthlyTransactions; i++) {
        const type = faker.helpers.arrayElement(["income", "expense"]);
        const category = type === "income"
            ? faker.helpers.arrayElement(incomeCategories)
            : faker.helpers.arrayElement(expenseCategories);

        // Generate a random date within this month
        const transactionDate = faker.date.between({ 
            from: currentDate, 
            to: monthEnd 
        });

        const amountRange = type === "income"
            ? { min: 1000, max: 10000 }
            : { min: 5, max: 2000 };

        // Simulate user behavior: 80% chance of entering transaction on same day,
        // 20% chance of entering it 1-5 days later
        const delayInDays = Math.random() < 0.8 
            ? 0 
            : faker.number.int({ min: 1, max: 5 });
        
        const createdAt = new Date(transactionDate.getTime() + (delayInDays * 24 * 60 * 60 * 1000));
        
        // Simulate occasional updates: 10% chance of having been updated
        const updatedAt = Math.random() < 0.1
            ? new Date(createdAt.getTime() + faker.number.int({ min: 1, max: 48 }) * 60 * 60 * 1000)
            : createdAt;

        const transaction = {
            id: faker.string.uuid(),
            title: faker.lorem.words(3).substring(0, 124),
            description: faker.lorem.sentence().substring(0, 256),
            type: type,
            category: category,
            amount: parseFloat(faker.finance.amount({ min: amountRange.min, max: amountRange.max, dec: 2 })),
            currency: "GBP",
            transactionDate: transactionDate.getTime(),
            createdAt: createdAt.getTime(),
            updatedAt: updatedAt.getTime()
        };

        transactions.push(transaction);
    }
}

// Sort transactions by month first, then by year
transactions.sort((a, b) => {
    const dateA = new Date(a.transactionDate);
    const dateB = new Date(b.transactionDate);
    
    // Compare months first
    const monthDiff = dateA.getMonth() - dateB.getMonth();
    if (monthDiff !== 0) return monthDiff;
    
    // If same month, compare years
    return dateA.getFullYear() - dateB.getFullYear();
});

try {
  // Use absolute path for file writing
  const filePath = path.join(process.cwd(), 'transactions.json');
  fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
  console.log(`Generated ${NUM_TRANSACTIONS} transactions to ${filePath}`);
} catch (error) {
  console.error('Failed to write transactions file:', error);
  process.exit(1);
}
