import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Por favor ingresa un nombre de usuario'],
      unique: true,
      trim: true,
      minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
      maxlength: [20, 'El usuario no puede exceder 20 caracteres']
    },
    email: {
      type: String,
      required: [true, 'Por favor ingresa un correo electrónico'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
    },
    password: {
      type: String,
      required: [true, 'Por favor ingresa una contraseña'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false
    },
    avatar: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
