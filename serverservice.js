const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const festRoute = require('./routes/fest.route');

require("dotenv").config();

const app = express(); // create web server

const PORT = process.env.PORT; // กำหนด port ให้กับ server

// ใช้ middleware
app.use(cors());
app.use(express.json());
app.use('/user', userRoute);
app.use('/fest', festRoute);
app.use('/images/users', express.static('images/users'));
app.use('/images/fests', express.static('images/fests'));

// เอาไว้ทดสอบว่า request / respond ทำงานได้หรือไม่
app.get('/', (req, res) => {
    res.json({ 
        message: 'Get Started' 
    });
});

// สั่ง start server โดยเปิด port รองรับ request/respond ตามที่กำหนดไว้
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})