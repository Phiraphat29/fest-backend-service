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

// ฟังก์ชั่นการทำงานต่าง ๆ ของ API ที่สร้างขึ้นมา
// สร้าง USER (POST) จากข้อมูลที่ส่งมาจาก frontend กับตารางใน DB-----
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
        res.status(201).json({message: 'เสร็จสิ้น', info: result});
    } catch (error) {
        res.status(500).json({message: `พบปัญหาในการทำงาน ${error.message}`});
        console.log(`Error: ${error.message}`);
    }
}

// ตรวจสอบ USER (GET) จากชื่อผู้ใช่ และรหัสผ่าน กับตารางใน DB-----
exports.checkLogin = async (req, res) => {
    try {
        const result = await prisma.user_tb.findFirst({
            where: {
                userName: req.params.userName,
                userPassword: req.params.userPassword
            }
        });
        if (result) {
            res.status(200).json({message: 'เสร็จสิ้น', info: result});
        }
        else {
            res.status(404).json({message: 'ไม่พบข้อมูล'});
        }
    } catch (error) {
        res.status(500).json({message: `พบปัญหาในการทำงาน ${error.message}`});
        console.log(`Error: ${error.message}`);
    }
};

// อัปเดตข้อมูล USER (PUT) จากชื่อผู้ใช่ และรหัสผ่าน กับตารางใน DB-----
exports.updateUser = async (req, res) => {
    try {
        let result = {};
        //-------------
        // ด้วยความที่มีการเก็บรูป ต้องตรวจสอบก่อนว่าข้อมูลมีรูปหรือไม่ ถ้าไม่มีรูปก็ไม่เป็นไร แต่ถ้ามีรูปต้องลบรูปเดิมไว้
        // ตรวจสอบว่าการแก้ไขมีการอัปโหลดรูปหรือไม่
        if (req.file) {
            // แก้ไขข้อมูลแบบแก้ไขรูปด้วย ต้องลบรูปเก่าออกก่อน
            // ดึงข้อมูลของ user ที่ต้องการแก้ไข
            const userResult = await prisma.user_tb.findFirst({
                where: {
                    userID: parseInt(req.params.userID)
                }
            });
            // เอาข้อมูลของ User มาตรวจสอบว่ามีรูปไหม ถ้ามีให้ลบทิ้ง
            if (userResult.userImage) {
                fs.unlinkSync(path.join(userResult.userImage))
            }
            // แก้ไขข้อมูลในฐานข้อมูล
            result = await prisma.user_tb.update({
                where: {
                    userID: parseInt(req.params.userID)
                },
                data: {
                    userFullname: req.body.userFullname,
                    userName: req.body.userName,
                    userPassword: req.body.userPassword,
                    userImage: request.file.path.replace("images\\users\\", ""),
                },
            });

        } else {
            // แก้ไขข้อมูลแบบไม่มีการแก้ไขรูป
            result = await prisma.user_tb.update({
                where: {
                    userID: parseInt(req.params.userID)
                },
                data: {
                    userFullname: req.body.userFullname,
                    userName: req.body.userName,
                    userPassword: req.body.userPassword,
                },
            });
        }
        // -------------
        res.status(200).json({message: 'เสร็จสิ้น', info: result});
    } catch (error) {
        res.status(500).json({message: `พบปัญหาในการทำงาน ${error.message}`});
        console.log(`Error: ${error.message}`);
    }
}
//------------------------------------