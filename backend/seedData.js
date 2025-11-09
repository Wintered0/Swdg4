const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const BorrowTransaction = require('./models/BorrowTransaction');
require('dotenv').config();

async function seedData() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/library';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas successfully');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await BorrowTransaction.deleteMany({});

    // Seed Users
    const users = [
      { name: 'Nguyen Van A', email: 'nguyenvana@example.com', userId: 'SV001', role: 'User', password: 'password123' },
      { name: 'Tran Thi B', email: 'tranthib@example.com', userId: 'SV002', role: 'User', password: 'password123' },
      { name: 'Le Van C', email: 'levanc@example.com', userId: 'SV003', role: 'User', password: 'password123' },
      { name: 'Pham Thi D', email: 'phamthid@example.com', userId: 'SV004', role: 'User', password: 'password123' },
      { name: 'Hoang Van E', email: 'hoangvane@example.com', userId: 'SV005', role: 'User', password: 'password123' }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Users seeded:', createdUsers.length);

    // Seed Books
    const books = [
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', available: true, quantity: 5, condition: 'Good', location: 'Shelf A1' },
      { title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'Dystopian', available: true, quantity: 3, condition: 'Good', location: 'Shelf A2' },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', available: true, quantity: 4, condition: 'Fair', location: 'Shelf A3' },
      { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', category: 'Romance', available: true, quantity: 6, condition: 'New', location: 'Shelf B1' },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', category: 'Fiction', available: true, quantity: 2, condition: 'Poor', location: 'Shelf B2' },
      { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', isbn: '978-0-590-35340-3', category: 'Fantasy', available: true, quantity: 8, condition: 'Good', location: 'Shelf C1' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0-544-00203-5', category: 'Fantasy', available: true, quantity: 3, condition: 'Good', location: 'Shelf C2' },
      { title: 'Dune', author: 'Frank Herbert', isbn: '978-0-441-17271-9', category: 'Science Fiction', available: true, quantity: 4, condition: 'Fair', location: 'Shelf D1' }
    ];

    const createdBooks = await Book.insertMany(books);
    console.log('Books seeded:', createdBooks.length);

    // Seed Borrow Transactions
    const transactions = [
      {
        userId: createdUsers[0]._id,
        bookId: createdBooks[0]._id,
        borrowDate: new Date('2024-10-01'),
        dueDate: new Date('2024-10-15'),
        returnDate: new Date('2024-10-10'),
        status: 'Returned'
      },
      {
        userId: createdUsers[1]._id,
        bookId: createdBooks[1]._id,
        borrowDate: new Date('2024-10-05'),
        dueDate: new Date('2024-10-19'),
        returnDate: new Date('2024-10-25'), // Overdue
        status: 'Returned'
      },
      {
        userId: createdUsers[2]._id,
        bookId: createdBooks[2]._id,
        borrowDate: new Date('2024-10-10'),
        dueDate: new Date('2024-10-24'),
        status: 'Borrowed' // Currently borrowed
      },
      {
        userId: createdUsers[3]._id,
        bookId: createdBooks[3]._id,
        borrowDate: new Date('2024-09-15'),
        dueDate: new Date('2024-09-29'),
        returnDate: new Date('2024-09-20'),
        status: 'Returned'
      },
      {
        userId: createdUsers[4]._id,
        bookId: createdBooks[4]._id,
        borrowDate: new Date('2024-10-12'),
        dueDate: new Date('2024-10-26'),
        status: 'Borrowed' // Currently borrowed
      },
      {
        userId: createdUsers[0]._id,
        bookId: createdBooks[5]._id,
        borrowDate: new Date('2024-09-20'),
        dueDate: new Date('2024-10-04'),
        returnDate: new Date('2024-10-08'), // Overdue
        status: 'Returned'
      },
      {
        userId: createdUsers[1]._id,
        bookId: createdBooks[6]._id,
        borrowDate: new Date('2024-10-08'),
        dueDate: new Date('2024-10-22'),
        returnDate: new Date('2024-10-18'),
        status: 'Returned'
      }
    ];

    const createdTransactions = await BorrowTransaction.insertMany(transactions);
    console.log('Transactions seeded:', createdTransactions.length);

    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();