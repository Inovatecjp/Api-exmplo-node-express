import databaseConfig from '../config/database';
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 });

const Sequelize = require("sequelize");

Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value, 10); };


const connection = new Sequelize(databaseConfig);
connection.authenticate()
//   .then(() => {
//     console.log('Escutando webhook_channel')

//     connection.connectionManager.getConnection()
//       .then(dbConnection => {
//         dbConnection.query('LISTEN webhook_channel');
//         dbConnection.on('notification', async (msg) => {
//           console.log('Notification received:', msg);
//           broadcastMessage(msg.payload);
//         });
//       })
//       .catch(err => {
//         console.error('Error getting database connection:', err);
//         console.log('Erro: ',err);
//       });
//   })
//   .catch(err => {
//     console.log('Erro 2: ', err);
//     console.error('Unable to connect to the database:', err);
//   });

// async function broadcastMessage(message) {
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   }

// wss.on('connection', function connection(ws, req) {
//   const clientIp = req.connection.remoteAddress;
//   console.log('Novo cliente conectado:', clientIp);

//   ws.on('message', function incoming(message) {
//     console.log('Mensagem recebida de', clientIp, ':', message);
//   });

//   ws.on('close', function close(code, reason) {
//     console.log('Cliente desconectado:', clientIp);
//     console.log('Código de status:', code.toString());
//     console.log('Motivo:', reason.toString());
//   });
// });


module.exports = connection;