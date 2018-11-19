// ========== Global Dependencies ============ //
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const Handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.username,
        pass: process.env.password
    }
});
const Email = require('email-templates');
const email = new Email({
    message: {
        from: 'yr16666@gmail.com'
    },
    send: true,
    transport: transporter,
    views: {
        options: {
            extension: 'hbs'
        }
    }
});

// ========== Setting Up Middlewares ============= //
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

// ========== Local Imports ============ //
const response = require('../responses');

// All Home Page Functions Go Here
module.exports = {
    homeMessage: (req, res) => {
        response.success.message = 'Look your app works.';
        res.status(200).send(response.success);
    },

    getEmail: (req, res) => {
        email
            .send({
                template: path.join(__dirname + '/../templates/', 'email'),
                message: {
                    to: 'yogesh.rathod@loylty.in'
                },
                locals: {
                    name: 'Yogesh',
                    position: 'Software Developer'
                }
            })
            .then(response => {
                res.send(response.originalMessage);
            })
            .catch(console.error);
    },

    pdfDownload: (req, res) => {
        const source = fs.readFileSync(
            path.join(__dirname + '/../templates/invoice/basic.hbs'),
            'utf8'
        );
        const template = Handlebars.compile(source);
        const options = { format: 'Letter' };
        const data = {
            name: 'Alan',
            address: 'Somewhere, TX',
            email: 'alan@gmail.com',
            date: '12/12/2018',
            total: '9000',
            grandTotal: '9000',
            orders: [
                {
                    desc: 'Some Product',
                    qty: '2',
                    unit: '3500',
                    unitTotal: '7000'
                },
                {
                    desc: 'Some Product 2',
                    qty: '1',
                    unit: '2000',
                    unitTotal: '2000'
                }
            ]
        };

        const result = template(data);
        pdf.create(result, options).toFile('./invoice.pdf', function(
            err,
            response
        ) {
            if (err) return console.log(err);
            res.sendFile(response.filename);
        });
    }
};
