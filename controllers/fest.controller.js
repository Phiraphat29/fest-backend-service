// จัดการ DB
const { PrismaClient } = require('@prisma/client');

// จัดการเรื่องการอัปโหลดไฟล์
const multer = require('multer');
const path = require('path');

// สร้างตัวแปรอ้างอิงสำหรับ Prisma Client
const prisma = new PrismaClient();

// การอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/festivals");
    },
    filename: (req, file, cb) => {
        cb(null, 'fest_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});

exports.uploadFest = multer({
    storage: storage,
    limits: {
        fileSize: 2000000 // 2MB limit for festival images
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb("Error: Images Only");
    }
}).single("festImage");

// ------------------------------------

// เอาข้อมูลที่ส่งมาจาก frontend มาเพิ่มลงตารางใน DB
exports.createFest = async (req, res) => {
    try {
        const result = await prisma.fest_tb.create({
            data: {
                festName: req.body.festName,
                festDetail: req.body.festDetail,
                festState: req.body.festState,
                festNumDay: parseInt(req.body.festNumDay),
                festCost: parseFloat(req.body.festCost),
                userID: parseInt(req.body.userID),
                festImage: req.file ? req.file.path.replace('Images\\festivals\\', '') : ''
            }
        });
        res.status(201).json({ message: 'Festival created successfully', info: result });
    } catch (error) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน: ${error.message}` });
        console.log(`Error: ${error}`);
    }
};

// ดึงข้อมูล Fest ทั้งหมดของ User หนึ่ง ๆ จากตารางใน Db
exports.getAllFestByUser = async (req, res) => {
    try {
        const result = await prisma.fest_tb.findMany({
            where: {
                userID: parseInt(req.params.userID)
            }
        });
        res.status(200).json({ message: 'เสร็จสิ้น', info: result });
        
    } catch (error) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน: ${error.message}` });
        console.log(`Error: ${error}`);
    }
};

// ดึงข้อมูล Fest หนึ่ง ๆ เพื่อจะนำไปทำอะไรสักอย่างเช่น แก้ไข
exports.getOnlyFest = async (req, res) => {
    try {
        const result = await prisma.fest_tb.findFirst({
            where: {
                festID: parseInt(req.params.festID)
            }
        });
        res.status(200).json({ message: 'เสร็จสิ้น', info: result });
        
    } catch (error) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน: ${error.message}` });
        console.log(`Error: ${error}`);
    }
}

// แก้ไข fest
exports.updateFest = async (req, res) => {
    try {
        let result = {};
        //-------------
        // ด้วยความที่มีการเก็บรูป ต้องตรวจสอบก่อนว่าข้อมูลมีรูปหรือไม่ ถ้าไม่มีรูปก็ไม่เป็นไร แต่ถ้ามีรูปต้องลบรูปเดิมไว้
        // ตรวจสอบว่าการแก้ไขมีการอัปโหลดรูปหรือไม่
        if (req.file) {
            // แก้ไขข้อมูลแบบแก้ไขรูปด้วย ต้องลบรูปเก่าออกก่อน
            const festResult = await prisma.fest_tb.findFirst({
                where: {
                    festID: parseInt(req.params.festID)
                }
            });
            // เอาข้อมูลของ User มาตรวจสอบว่ามีรูปไหม ถ้ามีให้ลบทิ้ง
            if (festResult.festImage) {
                fs.unlinkSync(path.join(festResult.festImage))
            }
            // แก้ไขข้อมูลในฐานข้อมูล
            result = await prisma.fest_tb.update({
                where: {
                    userID: parseInt(req.params.festID)
                },
                data: {
                    festName: req.body.festName,
                    festDetail: req.body.festDetail,
                    festState: req.body.festState,
                    festNumDay: parseInt(req.body.festNumDay),
                    festCost: parseFloat(req.body.festCost),
                    userID: parseInt(req.body.userID),
                    festImage: req.file ? req.file.path.replace('Images\\festivals\\', '') : ''
                },
            });

        } else {
            // แก้ไขข้อมูลแบบไม่มีการแก้ไขรูป
            result = await prisma.user_tb.update({
                where: {
                    festID: parseInt(req.params.festID)
                },
                data: {
                    festName: req.body.festName,
                    festDetail: req.body.festDetail,
                    festState: req.body.festState,
                    festNumDay: parseInt(req.body.festNumDay),
                    festCost: parseFloat(req.body.festCost),
                    userID: parseInt(req.body.userID),
                },
            });
        }
        // -------------
        res.status(200).json({message: 'เสร็จสิ้น', info: result});
    } catch (error) {
        res.status(500).json({message: `พบปัญหาในการทำงาน ${error.message}`});
        console.log(`Error: ${error}`);
    }
}

// ลบ fest
exports.deleteFest = async (req, res) => {
    try {
        const result = await prisma.fest_tb.delete({
            where: {
                festID: parseInt(req.params.festID)
            }
        });
        res.status(200).json({message: 'ลบข้อมูลสำเร็จ', info: result});
    } catch (error) {
        res.status(500).json({message: `พบปัญหาในการทำงาน ${error.message}`});
        console.log(`Error: ${error}`)
    }
}