'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Busca os IDs dos perfis usando Sequelize
    const profiles = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Profiles";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Busca os IDs e rotas das permissões usando Sequelize
    const grants = await queryInterface.sequelize.query(
      `SELECT id, route FROM "Grants";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const profileGrants = [];

    profiles.forEach(profile => {
        //Filtrar pelos tipos de usuario
      if (profile.name === 'user_comum') {
        grants.forEach(grant => {
          if ([
            //FILTRAR PELAS ROUTES EM GRANT
            '/users/', 
            '/users/registrar',
            '/users/login', 
            '/users/token', 
          ].includes(grant.route)) {
            profileGrants.push({
              profile_id: profile.id,
              grant_id: grant.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        });
      }
    //   if (profile.name === 'admin') {
    //     grants.forEach(grant => {
    //       if ([
    //         '/users/', 
    //         '/users/registrar',
    //       ].includes(grant.route)) {
    //         profileGrants.push({
    //           profile_id: profile.id,
    //           grant_id: grant.id,
    //           createdAt: new Date(),
    //           updatedAt: new Date(),
    //         });
    //       }
    //     });
    //   }
    });

    // Insere os dados na tabela "Grandsprofile"
    return queryInterface.bulkInsert('profile_grant', profileGrants);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profile_grant', null, {});
  }
};
