import jwt from 'jsonwebtoken';
const User = require("../models/User");


class TokenController {
  async store(req, res) {
    const { email = '', password = '' } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        errors: ['Email ou senha invalida'],
      });
    }

    const user = await User.findOne(
      { where: { email } }
    );


    if (!user) {
      return res.status(401).json({
        errors: ['Usuário não existe'],
      });
    }

    if (!(await user.validPassword(password))) {
      return res.status(401).json({
        errors: ['Senha inválida'],
      });
    }
    
    const { id, profile_id,name } = user;
    
    console.log(profile_id)
  

    
    const token = jwt.sign({ id,name, email, profile_id}, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({ token, user: { nome: user.name, email } });
  }
}

export default new TokenController();
