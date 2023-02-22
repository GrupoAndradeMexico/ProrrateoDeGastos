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

porcentajeSucursal.prototype.get_actualizarPorcentaje = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT },
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idusuario, type: self.model.types.INT },,
        { name: 'porcentajefijo', value: req.query.porcentajefijo, type: self.model.types.INT },

    ];

    this.model.query('UPD_SUCURSAL_PORCENTAJE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

porcentajeSucursal.prototype.get_guardarPorcentaje = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idusuario, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'porcentajefijo', value: req.query.porcentajefijo, type: self.model.types.INT },
    ];

    this.model.query('INS_SUCURSAL_PORCENTAJE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

porcentajeSucursal.prototype.get_InfoPorcentajesServicio = function(req, res, next) {
    var self = this;
    var params = [];

    this.model.query('SEL_PORCENTAJES_SERVICIOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

porcentajeSucursal.prototype.get_actualizarPorcentajeServicio = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idusuario, type: self.model.types.INT },
    ];

    this.model.query('UPD_SUCURSAL_PORCENTAJE_SERVICIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

porcentajeSucursal.prototype.get_guardarPorcentajeServicio = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idusuario, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.STRING },
    ];

    this.model.query('INS_SUCURSAL_PORCENTAJE_SERVICIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


module.exports = porcentajeSucursal;