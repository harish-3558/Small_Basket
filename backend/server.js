const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const productRouter = require('./routers/productrouter');
const adminRouter = require('./routers/adminrouter');
const emailRouter = require('./routers/emailrouter');
const cartRouter = require('./routers/cartrouter');
const vendorRouter = require('./routers/vendorrouter');
const managementRouter = require('./routers/managementrouter');
const orderRouter = require('./routers/orderrouter');

const app = express();
app.use(express.json());

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//this line is used to serve static files from the "uploads" directory. It allows clients to access uploaded images via URLs like http://localhost:3000/uploads/filename.jpg.

app.use('/products', productRouter);
app.use('/admin', adminRouter);
app.use('/email', emailRouter);
app.use('/cart', cartRouter);
app.use('/vendor', vendorRouter);
app.use('/admin/manage', managementRouter);
app.use('/orders', orderRouter);

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
