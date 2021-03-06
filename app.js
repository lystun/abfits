const express = require('express');
const app = express();

app.use(express.json());


//error handler
const HandleError = require('./utils/handleError')

//import the global error handler
const globalErrorHandler = require('./utils/globalErrorHandler');

//import routes
const categoryRoutes = require('./routes/categoriesRoutes');
const stylesRoutes = require('./routes/stylesRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


//mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/styles', stylesRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.all('*', (req, res, next) => {
    return next(new HandleError("Route not found", 404));
})

//global error handlers
app.use( globalErrorHandler );

module.exports = app;