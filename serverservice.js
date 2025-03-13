const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user.route');

require("dotenv").config();

const app = express(); // create web server

const PORT = process.env.PORT; // กำหนด port ให้กับ server

// ใช้ middleware
app.use(cors());
app.use(express.json());
app.use('/user', userRoute);

// เอาไว้ทดสอบว่า request / respond ทำงานได้หรือไม่
app.get('/', (req, res) => {
    res.json({ 
        message: 'Hello World' 
    });
});

// สั่ง start server โดยเปิด port รองรับ request/respond ตามที่กำหนดไว้
app.listen(PORT, () => {
    // console.log('Server is running on port' + PORT);
    // console.log("Server is running on port" + PORT);
    console.log(`Server is running on port ${PORT}`);
})