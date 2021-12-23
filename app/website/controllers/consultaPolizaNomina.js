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
	
    var poliza   = 4;
	var insertaPoliza  = 0; 
	var workLocat = req.query.lugarTrabajo;
	var fechaPagaSelected  = req.query.fechaPagaSelected;
	var tipoSelected  = req.query.tipoSelected;
    var frecuenciaSelected  = req.query.frecuenciaSelected;
    
    var params = [
        { name: 'poliza', value: poliza, type: self.model.types.INT },
        { name: 'insertaPoliza', value: insertaPoliza, type: self.model.types.INT },
        { name: 'workLocat', value: workLocat, type: self.model.types.INT },
        { name: 'fechaPagaSelected', value: fechaPagaSelected, type: self.model.types.INT },
        { name: 'tipoSelected', value: tipoSelected, type: self.model.types.STRING },
        { name: 'frecuenciaSelected', value: frecuenciaSelected, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('POLIZA_NOSCA_NOTRA_V7', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_LugaresTrabajo = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('LUGARES_DE_TRABAJO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_GeneraPolizaIndividual = function(req, res, next) {
    var self = this;
	
    var poliza   = 4;
	var insertaPoliza  = 1; 
	var workLocat = req.query.lugarTrabajo;
	var fechaPagaSelected  = req.query.fechaPagaSelected;
	var tipoSelected  = req.query.tipoSelected;
    var frecuenciaSelected  = req.query.frecuenciaSelected;
    
    var params = [
        { name: 'poliza', value: poliza, type: self.model.types.INT },
        { name: 'insertaPoliza', value: insertaPoliza, type: self.model.types.INT },
        { name: 'workLocat', value: workLocat, type: self.model.types.STRING },
        { name: 'fechaPagaSelected', value: fechaPagaSelected, type: self.model.types.STRING },
        { name: 'tipoSelected', value: tipoSelected, type: self.model.types.STRING },
        { name: 'frecuenciaSelected', value: frecuenciaSelected, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('POLIZA_NOSCA_NOTRA_V7', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_ConsultaBitacoraPolizas = function(req, res, next) {
    var self = this;
    var mes = req.query.mes;
    var anio = req.query.anio;;
    
    var params = [
        { name: 'mes', value: mes, type: self.model.types.INT },
        { name: 'anio', value: anio, type: self.model.types.INT }
    ];

    this.model.query('CONSULTA_BITACORA_NOSCA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_GeneraOrdenesMasivas = function(req, res, next) {
    var self = this;
    var mes = req.query.mes;
    var anio = req.query.anio;
    var fechaNomina = req.query.fechaNomina;
    var tipoNomina = req.query.tipoNomina;;
    
    var params = [
        { name: 'mes', value: mes, type: self.model.types.INT },
        { name: 'anio', value: anio, type: self.model.types.INT },
        { name: 'fechaNomina', value: fechaNomina, type: self.model.types.STRING },
        { name: 'tipoNomina', value: tipoNomina, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('CALCULO_DE_INFORME_V7', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_FechasPagasBitacora = function(req, res, next) {
    var self = this;
    var tipo = '';
    
    var params = [
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'tipo', value: tipo, type: self.model.types.STRING }
    ];

    this.model.query('CONSULTA_FECHAS_PAGA_BITACORA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_ConsultaPoliza = function(req, res, next) {
    var self = this;
    var tipo = '';

    
    var params = [
        { name: 'lugarTrabajo', value: req.query.lugarTrabajo, type: self.model.types.STRING },
        { name: 'idCabecero', value: req.query.idCabecero, type: self.model.types.INT }
    ]

    this.model.query('SEL_DATOS_POLIZA_SUCURSAL_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_GeneraOrdenesMasivasCorpo = function(req, res, next) {
    var self = this;
    var mes = req.query.mes;
    var anio = req.query.anio;
    var fechaNomina = req.query.fechaNomina;
    var tipoNomina = req.query.tipoNomina;;
    
    var params = [
        { name: 'mes', value: mes, type: self.model.types.INT },
        { name: 'anio', value: anio, type: self.model.types.INT },
        { name: 'fechaNomina', value: fechaNomina, type: self.model.types.STRING },
        { name: 'tipoNomina', value: tipoNomina, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('CALCULO_DE_INFORME_V4', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_GeneraPolizaMasiva = function(req, res, next) {
    var self = this;
	
    var poliza   = 4;
	var insertaPoliza  = 1; 
	//var workLocat = req.query.lugarTrabajo;
	var fechaPagaSelected  = req.query.fechaPagaSelected;
	var tipoSelected  = req.query.tipoSelected;
    var frecuenciaSelected  = req.query.frecuenciaSelected;
    
    var params = [
        { name: 'poliza', value: poliza, type: self.model.types.INT },
        { name: 'insertaPoliza', value: insertaPoliza, type: self.model.types.INT },
        { name: 'fechaPagaNomina', value: fechaPagaSelected, type: self.model.types.INT },
        { name: 'tipoSelected', value: tipoSelected, type: self.model.types.STRING },
        { name: 'frecuenciaSelected', value: frecuenciaSelected, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('POLIZA_NOSCA_NOTRA_V8', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

consultaPolizaNomina.prototype.get_ListaEmpresasPoliza = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('LUGAR_TRABAJO_POLIZA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = consultaPolizaNomina;