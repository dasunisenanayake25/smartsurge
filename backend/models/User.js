import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    monthlyBudget: {
      type: Number,
      default: 5000,
    },
    cebAccountNo: {
      type: String,
      default: '074-819-2015-V',
    },
    houseType: {
      type: String,
      default: 'Two-Storey Residential',
    },
    residentsCount: {
      type: Number,
      default: 4,
    },
    solarSetup: {
      type: String,
      default: 'None',
    },
    district: {
      type: String,
      default: 'Colombo',
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
