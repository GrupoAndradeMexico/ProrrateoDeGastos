var gastosView = require('../views/reference'),
    gastosModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
http = require('http')
var conf = require('../../../conf');

var gastos = function(conf) {
    this.conf = conf || {};

    this.view = new gastosView();
    this.model = new gastosModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


gastos.prototype.get_InfoGastos = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'idpagadora', value: req.query.pagadora, type: self.model.types.STRING },
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'quincena', value: req.query.quincena, type: self.model.types.INT },
    ];

    this.model.query('INS_PRORRATEOGASTOSBALANZA_QUINCENA_NOCENTRA_FRONT_V1_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



module.exports = gastos;