import Profile from '../models/profile';
import Grands from '../models/grant';
import Grandsprofile from '../models/profileGrant';

class profileController {
  async store(req, res) {

      
      
      const profile = await Profile.bulkCreate(
        [
          { name: 'diretor_presidente', description: 'Administrador geral', created_at: new Date(), updated_at: new Date(),isAdmin: true},
          { name: 'diretor_juridico', description: 'Administrador geral juridico', created_at: new Date(), updated_at: new Date(),isAdmin: true},
          { name: 'secretaria_geral', description: 'Secretaria geral', created_at: new Date(), updated_at: new Date(),isAdmin: true},
          { name: 'secretario', description: 'secretario', created_at: new Date(), updated_at: new Date(),isAdmin: true},
          { name: 'gerente_administrativo', description: 'gerente_administrativo', created_at: new Date(), updated_at: new Date(),isAdmin: false},
          { name: 'coordenador_projetos', description: 'coordenador_projetos', created_at: new Date(), updated_at: new Date(),isAdmin: false},
          { name: 'coordenador_TI', description: 'coordenador_TI', created_at: new Date(), updated_at: new Date(),isAdmin: false},
        ]
      )

      const routes = await Grands.bulkCreate([
        { grant: 'post', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },
        { grant: 'put', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },
        { grant: 'delete', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },
        { grant: 'get', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },


        { grant: 'get', route: '/v1/accounts/Users/AllUsers', note: 'pegar o plano do user' },
        { grant: 'post', route: '/v1/accounts/Users/RecuperarSenha', note: 'pegar o plano do user' },
        { grant: 'post', route: '/v1/accounts/Users/MudarSenha', note: 'pegar o treino' },

        { grant: 'post', route: '/v1/accounts/token/', note: 'pegar todos os treinos por cateoria' },

        { grant: 'post', route: '/v1/Processos', note: 'pegar todos os treinos por cateoria' },

        { grant: 'get', route: '/v1/Events', note: 'pegar todos os treinos por cateoria' },
        { grant: 'post', route: '/v1/Events', note: 'pegar todos os treinos por cateoria' },


        { grant: 'delete',      route: '/v1/Events/:id',     note: 'Criar os planos,ver todos os plano criados pelo proprio treinador' },
        { grant: 'get',      route: '/v1/Events/:id',     note: 'Criar os planos,ver todos os plano criados pelo proprio treinador' },
        { grant: 'update',      route: '/v1/Events/:id',     note: 'Criar os planos,ver todos os plano criados pelo proprio treinador' },
       ]);
      

      // const newlints = routes.map(grand =>{
      //   return { profileId : profile.id , grantId:grand.id  }
      // })
      
      // const grandsPrfile = await Grandsprofile.bulkCreate(newlints)


      


      return res.json({ message: 'Sucesso' });
    
  }
  
  // Index
  async index(req, res) {
    try {
      const profiles = await Profile.findAll();
      return res.json(profiles);
    } catch (e) {
      return res.json(null);
    }
  }

  // Show
  async show(req, res) {
    try {
      const profile = await profile.findByPk(req.params.id);

      const { id, name, isAdmin } = profile;
      return res.json({ id, name, isAdmin });
    } catch (e) {
      return res.json(null);
    }
  }

  // Update
  async update(req, res) {
    try {
      const profile = await profile.findByPk(req.profileId);

      if (!profile) {
        return res.status(400).json({
          errors: ['Usuário não existe'],
        });
      }

      const novosDados = await profile.update(req.body);
      const { id, name, isAdmin } = novosDados;
      return res.json({ id, name, isAdmin });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  // Delete
  async delete(req, res) {
    try {
      const profile = await profile.findByPk(req.profileId);

      if (!profile) {
        return res.status(400).json({
          errors: ['Perfio do usuairo não existe'],
        });
      }

      await profile.destroy();
      return res.json(null);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new profileController();