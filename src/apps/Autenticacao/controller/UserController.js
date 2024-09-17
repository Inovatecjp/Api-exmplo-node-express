import Profile from "../models/profile";
const User = require("../models/User");

const sendMailPromise = require("../../Emails/mailer/mailer");
const helper = require("../../Emails/controllers/candidatoHelper");
import jwt from "jsonwebtoken";

import ValidaCPF from "../../../utils/validaCPF";

import moment from "moment";
const { Op } = require("sequelize");

class UserController {
  async store(req, res) {
    try {
      const { password, cpf, name, email, phone } = req.body;
      let errors = [];

      // Validação de email
      if (!email) {
        errors.push("Coloque um email");
      }

      // // Validação de CPF
      // const isValidCPF = new ValidaCPF(cpf).valida();
      // if (!isValidCPF) {
      //   errors.push('Coloque um CPF válido');
      // }

      // Validação de telefone
      if (!phone) {
        errors.push("Coloque um telefone");
      }

      // Verificação de erros
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Criação do perfil, se necessário
      const [profile, created] = await Profile.findOrCreate({
        where: { name: "User_comun" },
        defaults: {
          name: "User_comun",
          description: "usuario comun",
          isAdmin: false,
        },
      });
      try {
        // Criação do usuário
        const newUser = await User.create({
          profile_id: profile.id,
          password,
          cpf,
          name,
          email,
          phone,
          is_ativo: true,
        });

        const token = jwt.sign(
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            profile_id: newUser.profile_id,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: process.env.TOKEN_EXPIRATION,
          }
        );

        return res.json({
          token,
          user: { nome: newUser.name, email: newUser.email },
        });
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          const errorMessages = err.errors.map((error) => error.message);
          return res.status(400).json({ errors: errorMessages });
        }
        console.error(err);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    } catch (err) {
      console.error(err.message);
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  }

  async RecuperarSenha(req, res) {
    try {
      let mess = [];
      const { email } = req.body;
      console.log(email);
      let emailData = helper.createDefaultEmailConfig(email);

      if (!email) {
        mess.push("coloque um email");
      }
      if (mess.length > 0) {
        return res.status(404).json({ error: mess });
      }

      try {
        const user = await User.findOne({
          where: {
            email: email,
          },
        });

        if (!user) {
          return res.status(404).json({ message: "email não encontrado" });
        }
        let domain = email.substring(0, email.indexOf("@"));
        let newPassword = domain + "1234";

        emailData.variables.user = user.name;
        emailData.variables.userName = user.cpf;
        emailData.variables.userPassword = newPassword;

        const newuseobj = user.update({
          password: newPassword,
        });
        user.save();

        sendMailPromise(
          emailData.email,
          emailData.subject,
          emailData.message,
          emailData.template,
          emailData.variables
        );

        return res.status(201).json({ message: "Sucesso" });
      } catch (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: `Erro ao criar usuário. o erro foi ${err.message}` });
      }
    } catch (e) {
      console.log(e);

      return res.status(500).json({ error: e.message });
    }
  }

  async MudarSenha(req, res) {
    try {
      let mess = [];
      const { password, newpassword, newpassword2 } = req.body;

      // if(mess.length>0){
      //   return res.status(404).json({ error: mess });
      // }

      try {
        console.log(req.userInfo);

        const user = await User.findByPk(req.userInfo.id);

        if (!user) {
          return res.status(401).json({ errors: "email não encontrado" });
        }

        if (!(await user.validPassword(password))) {
          return res.status(401).json({
            errors: ["Senha inválida"],
          });
        }

        if (newpassword != newpassword2) {
          return res
            .status(401)
            .json({ errors: "as Senhas digitas são diferentes" });
        }

        const newuseobj = user.update({
          password: newpassword,
        });
        user.save();

        return res.status(201).json({ message: "Sucesso" });
      } catch (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: `Erro ao criar usuário. o erro foi ${err.message}` });
      }
    } catch (e) {
      console.log(e);

      return res.status(500).json({ error: e.message });
    }
  }

  // Show
  async show(req, res) {
    try {
      const user = await User.findByPk(req.userInfo.id);
      const { name, last_name, email, cpf, birthDate, phone } = user;
      return res.json({ name, last_name, email, cpf, birthDate, phone });
    } catch (e) {
      return res.json(null);
    }
  }

  async indexAll(req, res) {
    try {
      const page =
        req.query.page == undefined || req.query.page == null
          ? 1
          : Number(req.query.page);

      const limite = 10;
      var lastpage = 1;
      const countUser = await User.count();
      if (countUser !== 0) {
        lastpage = Math.ceil(countUser / limite);

        const Userobj = await User.findAll({
          attributes: ["name", "last_name", "email"],
          order: [["id", "ASC"]],

          offset: Number(page * limite - limite),
          limit: limite,
        });

        var pagination = {
          path: "/exercicio/",
          page: page,
          prev_page_url: page - 1 >= 1 ? page - 1 : false,
          next_page_url: page + 1 > lastpage ? false : page + 1,
          total: countUser,
        };

        return res.json({ listUser: Userobj, pagination: pagination });
      } else {
        return res
          .status(400)
          .json({ error: "Erro: nenhum professor foi encrontrado" });
      }
    } catch (e) {
      return res.json(null);
    }
  }

  // Update
  async updat(req, res) {
    try {
      const user = await User.findByPk(req.userInfo.id);

      const { Cpf, Sobrenome, Nome, Email, Phone, BirthDate } = req.body;

      const newUser = await user.update({
        cpf: Cpf,
        last_name: Sobrenome,
        name: Nome,
        email: Email,
        phone: Phone,
        birthDate: BirthDate,
      });

      const { cpf, last_name, name, email, phone, birthDate } = newUser;
      return res.json({ cpf, last_name, name, email, phone, birthDate });
    } catch (e) {
      return res.json(null);
    }
  }
  // Delete
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.userInfo.id);

      if (!user) {
        return res.status(400).json({
          errors: ["Usuário não existe"],
        });
      }

      await user.update({
        is_ativo: false,
      });

      return res.json({ messagem: "usuario desativado" });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
