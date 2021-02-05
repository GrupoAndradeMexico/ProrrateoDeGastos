var prorrateoSucursalView = require('../views/reference'),
prorrateoSucursalModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var prorrateoSucursal = function(conf) {
    this.conf = conf || {};

    this.view = new prorrateoSucursalView();
    this.model = new prorrateoSucursalModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

prorrateoSucursal.prototype.get_TipoComprobanteXPagadora = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'id_pagadora', value: req.query.idpagadora, type: self.model.types.STRING }
    ];

    this.model.query('SEL_TIPOCOMPROBANTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.get_PlantillasXPagadora = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'id_pagadora', value: req.query.idpagadora, type: self.model.types.STRING },
    ];

    this.model.query('SEL_PLANTILLA_PRORRATEO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.get_Balanza = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'id_pagadora', value: req.query.idpagadora, type: self.model.types.STRING },
        { name: 'cargo', value: req.query.cargo, type: self.model.types.STRING },
        { name: 'abono', value: req.query.abono, type: self.model.types.STRING },
        { name: 'cargomes', value: req.query.cargomes, type: self.model.types.STRING },
        { name: 'abonomes', value: req.query.abonomes, type: self.model.types.STRING },
        { name: 'anio', value: req.query.anio, type: self.model.types.STRING },
    ];

    this.model.queryAllRecordSet('SEL_BALANZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.get_porcentajesGastos = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('SEL_PORCENTAJES_GASTOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.get_utilidadesCarga = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.queryAllRecordSet('SEL_UTILIDADESCARGA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.get_insSemiNuevos = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idSemiNuevos', value: req.query.idSemiNuevos, type: self.model.types.INT },
        { name: 'SeminuevosUtilidad', value: req.query.SeminuevosUtilidad, type: self.model.types.DECIMAL },
    ];

    this.model.query('INS_UTILIDAD_SEMINUEVOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.get_insRefacciones = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idRefacciones', value: req.query.idRefacciones, type: self.model.types.INT },
        { name: 'RefaccionesUtilidad', value: req.query.RefaccionesUtilidad, type: self.model.types.DECIMAL },
    ];

    this.model.query('INS_UTILIDAD_REFACCIONES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.get_insFlotillas = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idFlotillas', value: req.query.idFlotillas, type: self.model.types.INT },
        { name: 'FlotillasUtilidad', value: req.query.FlotillasUtilidad, type: self.model.types.DECIMAL },
    ];

    this.model.query('INS_UTILIDAD_FLOTILLAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoSucursal.prototype.post_ejecucionGastoBalanza = function(req, res, next) {
    var self = this;
    var mes = req.body.mes;
    var anio = req.body.anio;
    var id_pagadora =  req.body.id_pagadora;

    var params = [
        { name: 'mes', value: mes, type: self.model.types.INT },
        { name: 'anio', value: anio, type: self.model.types.INT },
        { name: 'id_pagadora', value: id_pagadora, type: self.model.types.STRING },
    ];
    
    this.model.query('[dbo].[INS_GASTOS_BALANZA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = prorrateoSucursal;