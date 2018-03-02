// ========== Global Dependencies ============ //
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const compression = require('compression');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');

/* Local Dependance */
const routes = require('./src/controllers');

// ========== Config Options For Middlewares ============= //

const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
};

// ========== Setting Up Middlewares ============= //
if (process.env.environment === 'dev') {
    dotenv.load({ path: '.env.dev' });
} else {
    dotenv.load({ path: '.env.prod' });
}
// required for passport session
app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

// ========== Connect To MongoDB through Mongoose ============= //

mongoose.connect(process.env.DB_URL, { useMongoClient: true });

// MONGOOSE CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open at', process.env.DB_URL);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

// ========== API Routing ============= //  
app.use('/api', routes);

/**
* Error Handler.
*/
app.use(errorHandler());

// ========== Listen to Requests ============= //
app.listen(process.env.PORT, () => {
    console.log("App is running at PORT ", process.env.PORT);
});