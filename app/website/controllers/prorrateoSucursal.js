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





module.exports = prorrateoSucursal;