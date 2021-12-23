
var reporteConciliacionView = require('../views/reference'),
reporteConciliacionModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');

var reporteConciliacion = function(conf) {
    this.conf = conf || {};

    this.view = new reporteConciliacionView();
    this.model = new reporteConciliacionModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


reporteConciliacion.prototype.get_conciliacion = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'work_locat', value: req.query.work_locat, type: self.model.types.STRING },
        { name: 'mes', value: req.query.mes, type: self.model.types.STRING },
        { name: 'anio', value: req.query.anio, type: self.model.types.STRING }
    ];

    this.model.query('REPORTE_NOMINA_CONCILIACION', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


reporteConciliacion.prototype.get_empleados = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT }
    ];

    this.model.query('OBTIENE_EMPLEADOS_REPORTE', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

reporteConciliacion.prototype.get_empleadosProrrateados = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('CONSULTA_EMPLEADOS_PRORRATEADOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

reporteConciliacion.prototype.get_empleadosProrrateadosSucursal = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idWorkLocat', value: req.query.idWorkLocat, type: self.model.types.INT }
    ];

    this.model.query('REPORTE_TOTAL_EMPLEADOS_PRORRA_SUCURSAL', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

reporteConciliacion.prototype.get_ReporteConcentrado = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT }
    ];

    this.model.query('SEL_REPORTE_CONCENTRADO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

reporteConciliacion.prototype.get_ListaConceptosConcentrado = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('CONCEPTOS_POLIZA_REPORTE_CONCENTRADO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = reporteConciliacion;