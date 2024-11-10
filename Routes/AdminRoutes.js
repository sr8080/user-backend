const express = require('express');
const { adminLogin,createEmployee, fetchemployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../Controllers/AdminController');
const upload= require('../Middleware/Upload')

const router = express.Router();

router.post('/adminlogin', adminLogin);
router.post('/addemployees',upload.single('imgUpload'),createEmployee)
router.get('/fetchemployees',fetchemployees)
router.get('/employees/:id',getEmployeeById)
router.put('/updateemployees/:id',updateEmployee)
router.delete('/removeemployees/:id', deleteEmployee);

module.exports = router;
