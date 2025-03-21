import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

// Number of transactions to generate
const NUM_TRANSACTIONS = 30_000;
const mockUserId = "test-fake-user-id";

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

// Generate categories
const categories = [
  ...incomeCategories.map(category => ({
    id: category,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false
  })),
  ...expenseCategories.map(category => ({
    id: category,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false
  }))
];

// Generate transaction types
const transactionTypes = [
  {
    type: "income"
  },
  {
    type: "expense"
  }
];

// Define the date range (from 3 years ago until now)
const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 5);
const endDate = new Date();

// Calculate total months between dates
const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

// Base income configuration (simulating a successful business owner/professional)
const baseIncome = {
    salary: 5000, // Regular monthly salary
    business: 8000, // Base business revenue
    rental: 2500, // Monthly rental income
    growth: 0.05 // 5% average growth rate per year
};

const transactions = [];

// Generate transactions for each month
for (let m = 0; m <= monthDiff; m++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + m);
    const monthEnd = new Date(currentDate);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);

    // Calculate growth factor based on time passed
    const yearsPassed = m / 12;
    const growthMultiplier = Math.pow(1 + baseIncome.growth, yearsPassed);

    // Generate income transactions for this month
    // Salary (paid on 25th)
    const salaryDate = new Date(currentDate);
    salaryDate.setDate(25);
    transactions.push({
        id: faker.string.uuid(),
        userId: mockUserId,
        title: "Monthly Salary",
        description: "Regular monthly salary payment",
        type: "income",
        categoryId: "salary",
        amount: baseIncome.salary * growthMultiplier * (0.95 + Math.random() * 0.1), // Small random variation
        currency: "GBP",
        transactionDate: salaryDate.getTime(),
        createdAt: salaryDate.getTime(),
        updatedAt: salaryDate.getTime()
    });

    // Business revenue (multiple transactions through month)
    const businessTransactions = faker.number.int({ min: 3, max: 8 });
    for (let i = 0; i < businessTransactions; i++) {
        const transactionDate = faker.date.between({ from: currentDate, to: monthEnd });
        const baseAmount = (baseIncome.business / businessTransactions) * growthMultiplier;
        transactions.push({
            id: faker.string.uuid(),
            userId: mockUserId,
            title: faker.helpers.arrayElement([
                "Client Project Payment",
                "Consulting Fee",
                "Service Revenue",
                "Product Sales"
            ]),
            description: faker.lorem.sentence(),
            type: "income",
            categoryId: "business_revenue",
            amount: baseAmount * (0.7 + Math.random() * 0.6), // More variation in business income
            currency: "GBP",
            transactionDate: transactionDate.getTime(),
            createdAt: transactionDate.getTime(),
            updatedAt: transactionDate.getTime()
        });
    }

    // Rental income (paid on 1st)
    const rentalDate = new Date(currentDate);
    rentalDate.setDate(1);
    transactions.push({
        id: faker.string.uuid(),
        userId: mockUserId,
        title: "Rental Income",
        description: "Monthly rental payment received",
        type: "income",
        categoryId: "rental_income",
        amount: baseIncome.rental * growthMultiplier,
        currency: "GBP",
        transactionDate: rentalDate.getTime(),
        createdAt: rentalDate.getTime(),
        updatedAt: rentalDate.getTime()
    });

    // Occasional bonuses (quarterly)
    if (m % 3 === 0) {
        const bonusDate = faker.date.between({ from: currentDate, to: monthEnd });
        transactions.push({
            id: faker.string.uuid(),
            userId: mockUserId,
            title: "Quarterly Bonus",
            description: "Quarterly performance bonus",
            type: "income",
            categoryId: "bonuses",
            amount: baseIncome.salary * growthMultiplier * faker.number.float({ min: 0.5, max: 1.5 }),
            currency: "GBP",
            transactionDate: bonusDate.getTime(),
            createdAt: bonusDate.getTime(),
            updatedAt: bonusDate.getTime()
        });
    }

    // Generate expense transactions
    const monthlyExpenses = faker.number.int({ min: 25, max: 40 });
    for (let i = 0; i < monthlyExpenses; i++) {
        const transactionDate = faker.date.between({ from: currentDate, to: monthEnd });
        const category = faker.helpers.arrayElement(expenseCategories);
        
        // Adjust expense amounts based on category
        let maxAmount = 200; // Default max for misc expenses
        if (["rent", "mortgage"].includes(category)) {
            maxAmount = 2000;
        } else if (["property_taxes", "car_maintenance", "electronics"].includes(category)) {
            maxAmount = 1000;
        } else if (["groceries", "utilities", "insurance"].includes(category)) {
            maxAmount = 500;
        }

        transactions.push({
            id: faker.string.uuid(),
            userId: mockUserId,
            title: faker.lorem.words(3),
            description: faker.lorem.sentence(),
            type: "expense",
            categoryId: category,
            amount: faker.number.float({ min: maxAmount * 0.1, max: maxAmount }),
            currency: "GBP",
            transactionDate: transactionDate.getTime(),
            createdAt: transactionDate.getTime(),
            updatedAt: transactionDate.getTime()
        });
    }
}

// Sort transactions by date
transactions.sort((a, b) => a.transactionDate - b.transactionDate);

try {
    const basePath = path.join(process.cwd(), '..', 'netcore', 'Bextpense', 'Bextpense', 'Infrastructure', 'Data');
    
    if (!fs.existsSync(basePath)) {
        throw new Error('Base path does not exist. Ensure you have not modified the project structure already.');
    }
  
    // Write categories
    fs.writeFileSync(
        path.join(basePath, 'categories.json'),
        JSON.stringify(categories, null, 2)
    );
    console.log(`Generated ${categories.length} categories to categories.json`);

    // Write transaction types
    fs.writeFileSync(
        path.join(basePath, 'transactionTypes.json'),
        JSON.stringify(transactionTypes, null, 2)
    );
    console.log(`Generated ${transactionTypes.length} transaction types to transactionTypes.json`);

    // Write transactions
    fs.writeFileSync(
        path.join(basePath, 'transactions.json'),
        JSON.stringify(transactions, null, 2)
    );
    console.log(`Generated ${transactions.length} transactions to transactions.json`);
} catch (error) {
    console.error('Failed to write seed files:', error);
    process.exit(1);
}
