const express = require('express');
const userController = require('./../controllers/user.controller');

const route = express.Router();

// กำหนดวิธีการเรียกใช้งาน API (Endpoint)

// ใช้ method POST สำหรับการสร้างข้อมูลใหม่
route.post('/', userController.uploadUser, userController.createUser);

// ใช้ method GET สำหรับการตรวจสอบข้อมูลผู้ใช้งาน
route.get('/:userName/:userPassword', userController.checkLogin);

// ใช้ method put สำหรับการอัปเดตข้อมูลผู้ใช้งาน
route.put('/:userID', userController.uploadUser, userController.updateUser);

module.exports = route;