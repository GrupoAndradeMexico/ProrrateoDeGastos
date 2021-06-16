var consultaPolizaNominaView = require('../views/reference'),
consultaPolizaNominaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');

var consultaPolizaNomina = function(conf) {
    this.conf = conf || {};

    this.view = new consultaPolizaNominaView();
    this.model = new consultaPolizaNominaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

consultaPolizaNomina.prototype.get_fechasPagas = function(req, res, next) {
    var self = this;
    var tipo = '';
    
    var params = [
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'tipo', value: tipo, type: self.model.types.STRING }
    ];

    this.model.query('CONSULTA_FECHAS_PAGA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_ObtieneAsientoContablePaga = function(req, res, next) {
    var self = this;
	
    var poliza   = 4
	var insertaPoliza  = 0 
	var workLocat = '3'
	var fechaPagaSelected  = req.query.fechaPagaSelected
	var tipoSelected  = req.query.tipoSelected
    
    var params = [
        { name: 'poliza', value: poliza, type: self.model.types.INT },
        { name: 'insertaPoliza', value: insertaPoliza, type: self.model.types.INT },
        { name: 'workLocat', value: workLocat, type: self.model.types.INT },
        { name: 'fechaPagaSelected', value: fechaPagaSelected, type: self.model.types.INT },
        { name: 'tipoSelected', value: tipoSelected, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('POLIZA_NOSCA_NOTRA_V3', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = consultaPolizaNomina;