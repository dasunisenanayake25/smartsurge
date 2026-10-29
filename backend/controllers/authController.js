import User from '../models/User.js';
import Appliance from '../models/Appliance.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '250765798124-ibdcnuang81upo7h5ti54llgpa61sm01.apps.googleusercontent.com');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    // Auto-create or fix Demo Account seamlessly
    if (email === 'demo@smartsurge.com' && password === '123456') {
      if (!user) {
        user = await User.create({
          name: 'Kasun Perera',
          email: 'demo@smartsurge.com',
          password: '123456',
          monthlyBudget: 6500,
          cebAccountNo: '074-819-2015-V',
          houseType: 'Two-Storey Residential',
          residentsCount: 4,
          solarSetup: 'None',
          district: 'Colombo',
        });
      } else if (!(await user.matchPassword(password))) {
        user.password = '123456';
        await user.save();
      }

      // Ensure demo appliances exist
      const appCount = await Appliance.countDocuments({ userId: user._id });
      if (appCount === 0) {
        await Appliance.insertMany([
          { userId: user._id, name: 'Master Bedroom Inverter AC', category: 'AC', ratedWattage: 1200, status: 'ON', isSmartPlugConnected: true },
          { userId: user._id, name: 'Smart Inverter Refrigerator', category: 'Refrigerator', ratedWattage: 180, status: 'ON', isSmartPlugConnected: true },
          { userId: user._id, name: 'Living Room 55" 4K Smart TV', category: 'TV', ratedWattage: 110, status: 'ON', isSmartPlugConnected: true },
          { userId: user._id, name: 'Automatic Washing Machine', category: 'Washing Machine', ratedWattage: 500, status: 'OFF', isSmartPlugConnected: true },
          { userId: user._id, name: 'Kitchen Microwave Oven', category: 'Other', ratedWattage: 1150, status: 'OFF', isSmartPlugConnected: true },
          { userId: user._id, name: 'LED Corridor & Ambient Lighting', category: 'Lighting', ratedWattage: 75, status: 'ON', isSmartPlugConnected: true },
        ]);
      }
    }

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth login / auto-register
// @route   POST /api/v1/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential token' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || '250765798124-ibdcnuang81upo7h5ti54llgpa61sm01.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create new user with Google profile
      user = await User.create({
        name,
        email,
        googleId,
        monthlyBudget: 5000,
        cebAccountNo: '074-' + Math.floor(100 + Math.random() * 900) + '-2026',
        houseType: 'Two-Storey Residential',
        residentsCount: 4,
        solarSetup: 'None',
        district: 'Colombo',
      });

      // Populate initial sample smart appliances for seamless instant demo
      await Appliance.insertMany([
        { userId: user._id, name: 'Living Room Inverter AC', category: 'AC', ratedWattage: 1100, status: 'ON', isSmartPlugConnected: true },
        { userId: user._id, name: 'Smart Refrigerator', category: 'Refrigerator', ratedWattage: 180, status: 'ON', isSmartPlugConnected: true },
        { userId: user._id, name: 'Smart TV', category: 'TV', ratedWattage: 100, status: 'OFF', isSmartPlugConnected: true },
        { userId: user._id, name: 'Washing Machine', category: 'Washing Machine', ratedWattage: 450, status: 'OFF', isSmartPlugConnected: true },
      ]);
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(401).json({ message: 'Google Authentication failed: ' + error.message });
  }
};

// @desc    Get profile
// @route   GET /api/v1/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        monthlyBudget: user.monthlyBudget || 5000,
        cebAccountNo: user.cebAccountNo || '074-819-2015-V',
        houseType: user.houseType || 'Two-Storey Residential',
        residentsCount: user.residentsCount || 4,
        solarSetup: user.solarSetup || 'None',
        district: user.district || 'Colombo',
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile & budget settings
// @route   PUT /api/v1/auth/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.monthlyBudget !== undefined) {
        user.monthlyBudget = req.body.monthlyBudget;
      }
      if (req.body.cebAccountNo !== undefined) user.cebAccountNo = req.body.cebAccountNo;
      if (req.body.houseType !== undefined) user.houseType = req.body.houseType;
      if (req.body.residentsCount !== undefined) user.residentsCount = req.body.residentsCount;
      if (req.body.solarSetup !== undefined) user.solarSetup = req.body.solarSetup;
      if (req.body.district !== undefined) user.district = req.body.district;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        monthlyBudget: updatedUser.monthlyBudget,
        cebAccountNo: updatedUser.cebAccountNo,
        houseType: updatedUser.houseType,
        residentsCount: updatedUser.residentsCount,
        solarSetup: updatedUser.solarSetup,
        district: updatedUser.district,
        token: generateToken(updatedUser._id),
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
