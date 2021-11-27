var comisionesFlotillasView = require('../views/reference'),
comisionesFlotillasModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var comisionesFlotillas = function(conf) {
    this.conf = conf || {};

    this.view = new comisionesFlotillasView();
    this.model = new comisionesFlotillasModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

comisionesFlotillas.prototype.get_InfoDepartamentosComisiones = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('SEL_DEPARTAMENTOS_COMISIONES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

comisionesFlotillas.prototype.get_actualizarPorcentaje = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'iddepartamento', value: req.query.iddepartamento, type: self.model.types.INT },
        { name: 'estatus', value: req.query.estatus, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idusuario, type: self.model.types.INT },
    ];

    this.model.query('UPD_DEPARTAMENTO_PORCENTAJE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


comisionesFlotillas.prototype.get_detalleFlotillas = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'idFlotilla', value: req.query.idFlotilla, type: self.model.types.INT },
    ];

    this.model.query('SEL_DEPARTAMENTOS_COMISIONES_FLOTILLA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

comisionesFlotillas.prototype.get_eliminaSucFlotilla = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'idDetalleFlotilla', value: req.query.idDetalleFlotilla, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    ];

    this.model.query('UPD_COMISIONES_FLOTILLA_SUCURSAL_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

comisionesFlotillas.prototype.get_insertarSucFlotilla = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'IdFlotilla', value: req.query.IdFlotilla, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    ];

    this.model.query('INS_COMISIONES_FLOTILLA_SUCURSAL_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = comisionesFlotillas;