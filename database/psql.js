// const Sequelize = require('sequelize');
const config = require('config');
const dbConfig = config.get('psql');
const {Client } = require('pg')
// const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
//     dialect: 'postgres',
//     port: parseInt(dbConfig.port, 10),
//     host: dbConfig.host,
//     operatorsAliases: Sequelize.Op,
//     logging: dbConfig.log,
// });
const client = new Client({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: parseInt(dbConfig.port, 10),
  })
// let db = {};

client
    .connect()
    .then(() => {
        console.log(`psql connected to ${dbConfig.database}`);
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// db.sequelize = client;
// db.Sequelize = Client;

// db exports
module.exports = client;