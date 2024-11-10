const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../Models/AdminModel');
const Employee= require('../Models/EmployeeModel')

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password,"userdata")

  try {
    const admin = await Admin.findOne({ email });
    console.log(admin,"admin")

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful!',
      admin,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    let imgUpload;

    console.log(name, email, mobile, designation, gender, course ,"hhi")
    if (req.file) {
      imgUpload = req.file.path; 
    }

    
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      imgUpload,
    });

    
    const savedEmployee = await newEmployee.save();

   console.log(savedEmployee,"save")
    res.status(201).json({
      message: 'Employee created successfully',
      data: savedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating employee',
      error: error.message,
    });
  }
};

const fetchemployees =async(req,res)=>{
  try {
    
    const employees = await Employee.find();
    console.log(employees,"employ")
    res.status(200).json(employees); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
}

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, designation, gender, course } = req.body;

    const updatedData = {
      name,
      email,
      mobile,
      designation,
      gender,
      course,
    };

    
    if (req.file) {
      updatedData.imgUpload = req.file.path;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

   
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    
    res.status(200).json({ message: 'Employee deleted successfully', employeeId });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = {
  adminLogin,
  createEmployee,
  fetchemployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
