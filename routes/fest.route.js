const express = require('express');
const festController = require('./../controllers/fest.controller');

const route = express.Router();

// กำหนดวิธีการเรียกใช้งาน API (Endpoint)

// ใช้ method POST สำหรับการสร้างข้อมูลใหม่
route.post('/', festController.uploadFest, festController.createFest);

// ใช้ method GET สำหรับการตรวจสอบข้อมูล Festival
route.get('/:userID', festController.getAllFestByUser);
route.get('/only/:festID', festController.getOnlyFest);

// ใช้ method put สำหรับการอัปเดตข้อมูล Festival
route.put('/:festID', festController.uploadFest, festController.updateFest);

// ใช้ method delete สำหรับการลบข้อมูล Festival
route.delete('/:festID', festController.deleteFest);

module.exports = route;