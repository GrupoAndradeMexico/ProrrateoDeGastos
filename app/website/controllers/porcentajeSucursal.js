var porcentajeSucursalView = require('../views/reference'),
    porcentajeSucursalModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
http = require('http')
var conf = require('../../../conf');

var porcentajeSucursal = function(conf) {
    this.conf = conf || {};

    this.view = new porcentajeSucursalView();
    this.model = new porcentajeSucursalModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


porcentajeSucursal.prototype.get_InfoPorcentajes = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('SEL_PORCENTAJES_SUCURSAL_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

porcentajeSucursal.prototype.get_sucursales = function(req, res, next) {
    var self = this;
    var params = [];

    this.model.query('SEL_SUCURSALES_NOMINA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



module.exports = porcentajeSucursal;