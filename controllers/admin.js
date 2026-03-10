const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
 
    // check existing user
    const existingUser = await Admin.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
  console.log(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

exports.loginAdmin = async (req,res)=>{
  try{

    const {email,password} = req.body;

    const admin = await Admin.findOne({where:{email}});

    if(!admin) return res.status(404).json({message:"Admin not found"});

    const match = await bcrypt.compare(password,admin.password);

    if(!match) return res.status(400).json({message:"Invalid password"});

    const token = jwt.sign(
      {id:admin.id, role:"admin"},
      process.env.JWT_SECRET||"SECRET_KEY"
    );

    res.json({token});

  }catch(err){
    res.status(500).json({message:err.message});
  }
}