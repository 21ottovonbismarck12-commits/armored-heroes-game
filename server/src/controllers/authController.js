import User from '../models/User.js';
import Player from '../models/Player.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, characterName } = req.body;

    // Validaciones
    if (!username || !email || !password || !characterName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor proporciona todos los campos requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario o correo ya existe' 
      });
    }

    // Crear usuario
    user = await User.create({
      username,
      email,
      password
    });

    // Crear jugador asociado
    const player = await Player.create({
      userId: user._id,
      characterName
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: '¡Registro exitoso!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      player: {
        id: player._id,
        characterName: player.characterName,
        level: player.level,
        experience: player.experience
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrarse',
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor proporciona correo y contraseña' 
      });
    }

    // Buscar usuario y seleccionar password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Obtener datos del jugador
    const player = await Player.findOne({ userId: user._id });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: '¡Login exitoso!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      player: {
        id: player._id,
        characterName: player.characterName,
        level: player.level,
        experience: player.experience,
        stats: player.stats
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const player = await Player.findOne({ userId: req.user.id });

    if (!user || !player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      player: {
        id: player._id,
        characterName: player.characterName,
        level: player.level,
        experience: player.experience,
        gold: player.gold,
        crystals: player.crystals,
        stats: player.stats,
        equipment: player.equipment,
        wins: player.wins,
        losses: player.losses,
        rank: player.rank
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener perfil',
      error: error.message 
    });
  }
};
