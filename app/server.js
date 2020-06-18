const express = require( 'express' );
const app = express();

/*
    get config from config folder
*/
const config = require( 'config' );
const serverConfig = config.get( 'server' );

/*
    create express server
*/
app.listen( serverConfig.port, () => {
    console.log( `App started at ${ serverConfig.port }` );
} );

module.exports = app;