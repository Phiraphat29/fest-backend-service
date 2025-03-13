// จัดการ DB
const {PrismaClient} = require('@prisma/client');

// จัดการเรื่องการอัปโหลดไฟล์
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// สร้างตัวแปรอ้างอิงสำหรับ Prisma Client
const prisma = new PrismaClient();

// การอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/users");
    } ,
    filename: (req, file, cb) => {
        cb(null, 'user_'+ Math.floor(Math.random()* Date.now()) + path.extname(file.originalname));
    }
})
exports.uploadUser = multer({
     storage: storage,
     limits: {
         fileSize: 1000000
     },
     fileFilter: (req, file, cb) => {
         const fileTypes = /jpeg|jpg|png/;
         const mimeType = fileTypes.test(file.mimetype);
         const extname = fileTypes.test(path.extname(file.originalname));
         if(mimeType && extname) {
             return cb(null, true);
         }
         cb("Error: Images Only");
     }
}).single("userImage");
// ------------------------------------

// เอาข้อมูลที่ส่งมาจาก frontend มาเพิ่มลงตารางใน DB
exports.createUser = async (req, res) => {
    try {
        const result = await prisma.user_tb.create({
            data: {
                userFullname: req.body.userFullname,
                userName: req.body.userName,
                userPassword: req.body.userPassword,
                userImage: req.file ? req.file.path.replace('Images\\users\\', '') : ''
            }
        });
        res.status(201).json({message: 'เสร็จสิ้น', data: result});
    } catch (error) {
        res.status(500).json({message: `พบปัญหาในการทำงาน ${error.message}`});
        console.log(`Error: ${error.message}`);
    }
}
//------------------------------------