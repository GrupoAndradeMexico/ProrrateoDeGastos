var plantillaProrrateoView = require('../views/reference'),
plantillaProrrateoModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var plantillaProrrateo = function(conf) {
    this.conf = conf || {};

    this.view = new plantillaProrrateoView();
    this.model = new plantillaProrrateoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

plantillaProrrateo.prototype.get_guardaCabecero = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'nombreRelacion', value: req.query.nombreRelacion, type: self.model.types.STRING },
        { name: 'ordencompra', value: req.query.ordencompra, type: self.model.types.STRING },
        { name: 'idEsquema', value: req.query.idEsquema, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'Frecuencia', value: req.query.Frecuencia, type: self.model.types.INT },
        { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'esplantilla', value: req.query.esplantilla, type: self.model.types.INT },
    ];

    this.model.query('INS_CABECERO_PLANTILLA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

plantillaProrrateo.prototype.get_guardaDetalleCabecero = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idPlantilla', value: req.query.idPlantilla, type: self.model.types.INT },
        { name: 'idArea', value: req.query.idArea, type: self.model.types.STRING },
        { name: 'areaDescripcion', value: req.query.areaDescripcion, type: self.model.types.STRING },
        { name: 'idConcepto', value: req.query.idConcepto, type: self.model.types.STRING },
        { name: 'conceptoDescripcion', value: req.query.conceptoDescripcion, type: self.model.types.STRING },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
    ];

    this.model.query('INS_DETALLE_PLANTILLA_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

plantillaProrrateo.prototype.get_guardaRelacion = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresaOrden', value: req.query.idEmpresaOrden, type: self.model.types.INT },
        { name: 'idSucursalOrden', value: req.query.idSucursalOrden, type: self.model.types.INT },
        { name: 'idAreaOrden', value: req.query.idAreaOrden, type: self.model.types.STRING },
        { name: 'areaOrden', value: req.query.areaOrden, type: self.model.types.STRING },
        { name: 'idConceptoOrden', value: req.query.idConceptoOrden, type: self.model.types.STRING },
        { name: 'conceptoOrden', value: req.query.conceptoOrden, type: self.model.types.STRING },
        { name: 'idEmpresaPro', value: req.query.idEmpresaPro, type: self.model.types.INT },
        { name: 'idSucursalPro', value: req.query.idSucursalPro, type: self.model.types.INT },
        { name: 'idAreaPro', value: req.query.idAreaPro, type: self.model.types.STRING },
        { name: 'areaPro', value: req.query.areaPro, type: self.model.types.STRING },
        { name: 'idConcepto', value: req.query.idConcepto, type: self.model.types.STRING },
        { name: 'conceptoPro', value: req.query.conceptoPro, type: self.model.types.STRING }
    ];

    this.model.query('INS_REALACION_SUCURSAL_AREA_CONCEPTO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


plantillaProrrateo.prototype.get_guardaProrrateoOrden = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEsquema', value: req.query.idEsquema, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'Orden', value: req.query.Orden, type: self.model.types.STRING },
        { name: 'Area', value: req.query.Area, type: self.model.types.STRING },
        { name: 'areaDEscripcion', value: req.query.areaDEscripcion, type: self.model.types.STRING },
        { name: 'Concepto', value: req.query.Concepto, type: self.model.types.STRING },
        { name: 'conceptoDescripcion', value: req.query.conceptoDescripcion, type: self.model.types.STRING }
    ];

    this.model.query('INS_DETALLE_PRORRATEO_ORDEN_V2', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = plantillaProrrateo;