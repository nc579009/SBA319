
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();
const app = express();
app.use(express.json());


// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// Import Routes
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
