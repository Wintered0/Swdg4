// routes/AllRoute.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/ManagementAccount");
const bookController = require("../controllers/BookController");
const transactionController = require("../controllers/BorrowTransactionController");
const inventoryController = require("../controllers/InventoryController");

// User routes
router.get("/users/:id", userController.getUserById);
router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Book routes
router.get("/books/:id", bookController.getBookById);
router.get("/books", bookController.getBooks);
router.post("/books", bookController.createBook);
router.put("/books/:id", bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);

// Transaction routes
router.get("/transactions/:id", transactionController.getTransactionById);
router.get("/transactions", transactionController.getTransactions);
router.post("/transactions", transactionController.createTransaction);
router.put("/transactions/return", transactionController.returnBook);

// Borrow/Return History (UC-07)
router.get("/borrow-history", transactionController.getBorrowHistory);

// Inventory routes (UC-08)
router.get("/inventory", inventoryController.getInventory);
router.put("/inventory/:id", inventoryController.updateInventory);
router.get("/inventory/alerts", inventoryController.getLowStockAlerts);
router.get("/inventory/report", inventoryController.generateInventoryReport);

module.exports = router;
