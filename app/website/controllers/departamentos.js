var departamentosView = require('../views/reference'),
departamentosModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var departamentos = function(conf) {
    this.conf = conf || {};

    this.view = new departamentosView();
    this.model = new departamentosModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

departamentos.prototype.get_InfoDepartamentos = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('SEL_DEPARTAMENTOS_CORPORATIVO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

departamentos.prototype.get_actualizarPorcentaje = function(req, res, next) {
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


module.exports = departamentos;