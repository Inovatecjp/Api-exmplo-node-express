# Uma API REST simples para consumo de dados

Para subir o projeto no ar com SQLite, copie o arquivo `.env_example` para `.env`.  

Você também precisará adicionar uma secret key no arquivo `.env`:

```
TOKEN_SECRET='sua_secret_key_aqui'
```

Execute os comandos abaixo:

```
npm i
npx sequelize db:migrate
yarn sequelize-cli migration:create --name=Create_eventos
npm run start
npm run start:devolps
```

Neste ponto sua API deverá está rodando no endereço http://127.0.0.1:3010/.

Caso queira migrar para MySQL/MariaDB, edite as configurações de base de dados no arquivo `.env`, configure também o `src/config/database.js`.

Para SQLite as configurações são:

```javascript
require('dotenv').config();

module.exports = {
  dialect: 'sqlite',
  storage: './db.sqlite',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
```

Para MySQL/MariaDB as configurações são:

```javascript
require('dotenv').config();

module.exports = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  dialectOptions: {
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
```


Para Postgres as configurações são:

```javascript
require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  dialectOptions: {
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
```

Perceba que as configurações começando com `process.env.` vem do arquivo `.env`.

Os dados de usuário e senha dos arquivos de seed são:



Você pode obter o token JWT na rota `/tokens`, passando os dados JSON:

```json
{
	"email": "admin@email.com",
	"password": "123456"
}
```

Headers:

```
Content-Type	application/json; charset=utf-8
```

