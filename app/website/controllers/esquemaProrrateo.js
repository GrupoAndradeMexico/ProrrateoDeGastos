var esquemaProrrateoView = require('../views/reference'),
esquemaProrrateoModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var esquemaProrrateo = function(conf) {
    this.conf = conf || {};

    this.view = new esquemaProrrateoView();
    this.model = new esquemaProrrateoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

esquemaProrrateo.prototype.get_sucursalesAll = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('SEL_SUCURSALES_ALL_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_detalleEsquema = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEncabezado', value: req.query.idEncabezado, type: self.model.types.INT },
    ];

    this.model.query('SEL_DETALLE_ESQUEMA_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_guardaEncabezado = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'nombre', value: req.query.nombre, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    ];

    this.model.query('INS_ENCABEZADO_ESQUEMA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_guardaDetalle = function(req, res, next) {
    var self = this;

// conceptoDesc
// idArea
// areaDesc
    
    var params = [
       
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursales', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idEncabezado', value: req.query.idEncabezado, type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idConcepto', value: req.query.idConcepto, type: self.model.types.STRING },
        { name: 'conceptoDesc', value: req.query.conceptoDesc, type: self.model.types.STRING },
        { name: 'idArea', value: req.query.idArea, type: self.model.types.STRING },
        { name: 'areaDesc', value: req.query.areaDesc, type: self.model.types.STRING }
    ];

    this.model.query('GUARDA_DETALLE_ESQUEMA_PRORRATEO_V2', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_guardarDetalle = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEncabezado', value: req.query.idEncabezado, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa , type: self.model.types.INT },
        { name: 'idSucursales', value: req.query.idSucursales , type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idConcepto', value: req.query.idConcepto, type: self.model.types.STRING },
        { name: 'conceptoDesc', value: req.query.conceptoDesc, type: self.model.types.STRING },
    ];

    this.model.query('GUARDA_DETALLE_ESQUEMA_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_buscaEsquemas = function(req, res, next) {
    var self = this;
    
    var params = [

        { name: 'idEmpresa', value: req.query.idEmpresa , type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal , type: self.model.types.INT },
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio , type: self.model.types.INT }
    ];

    this.model.query('SEL_ESQUEMAS_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_actualizaEsquema = function(req, res, next) {
    var self = this;
    
    var params = [

        { name: 'idDetalle', value: req.query.idDetalle , type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario , type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal , type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje , type: self.model.types.INT },
        { name: 'idConcepto', value: req.query.idConcepto , type: self.model.types.STRING },
        { name: 'conceptoDesc', value: req.query.conceptoDesc , type: self.model.types.STRING }
    ];

    this.model.query('UPD_DETALLE_ESQUEMA_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_eliminaDetalleEdicion = function(req, res, next) {
    var self = this;
    
    var params = [

        { name: 'idDetalle', value: req.query.indice , type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario , type: self.model.types.INT }
    ];

    this.model.query('DEL_DETALLE_ESQUEMA_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


esquemaProrrateo.prototype.get_desactivaEsquema = function(req, res, next) {
    var self = this;
    
    var params = [

        { name: 'indice', value: req.query.indice , type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario , type: self.model.types.INT }
    ];

    this.model.query('DEL_ESQUEMA_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

esquemaProrrateo.prototype.get_conceptos = function(req, res, next) {
    var self = this;
    
    var params = [

        { name: 'idSucursal', value: req.query.idSucursal , type: self.model.types.INT }
    ];

    this.model.query('SEL_CONCEPTOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = esquemaProrrateo;