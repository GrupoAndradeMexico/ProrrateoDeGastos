var prorrateoOrdenView = require('../views/reference'),
prorrateoOrdenModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var prorrateoOrden = function(conf) {
    this.conf = conf || {};

    this.view = new prorrateoOrdenView();
    this.model = new prorrateoOrdenModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

prorrateoOrden.prototype.get_empresas = function(req, res, next) {
    var self = this;
    
    var params = [ ];

    this.model.query('SEL_EMPRESAS_DIG_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_sucursales = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idempresa', value: req.query.idempresa, type: self.model.types.STRING },
    ];

    this.model.query('SEL_SUCURSALES_DIG_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


prorrateoOrden.prototype.get_ordenesCompra = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idempresa', value: req.query.idempresa, type: self.model.types.STRING },
        { name: 'idsucursal', value: req.query.idsucursal, type: self.model.types.STRING },
        { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fechaFin, type: self.model.types.STRING },
    ];

    this.model.query('SEL_INFO_ORDENESCOMPRA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_esquemas = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
    ];

    this.model.query('SEL_ESQUEMAS_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_prorrateoOrden= function(req, res, next) {
    var self = this;
    var sucOrden = req.query.idsucursal;
    var numOrden = req.query.orden;
    var params = [
        { name: 'monto', value: req.query.monto, type: self.model.types.DECIMAL },
        { name: 'esquema', value: req.query.esquema, type: self.model.types.INT },          
       // { name: 'orden', value: numOrden, type: self.model.types.STRING},
    ];
    
    this.model.query('[dbo].[SEL_INFO_PRORRATEOORDENESCOMPRA_SP]', params,async function(error, result) {
        if (!error) {
            var resolved = [];
            var errors = [];
            for (var i = 0; i < result.length; i++) {
                try {
                    resolved.push(await promiseInsertPoliza(result[i], sucOrden,numOrden, self));
                }
                catch (e) {
                    errors.push(e);
                }
            }
            self.view.expositor(res, {
                error: error,
                result: resolved
            });
        }
        else
        {
            self.view.expositor(res, {
                error: error,
                result: null
            });   
        }
    });
};

//inserta la poliza
async function promiseInsertPoliza(datos, sucOrden, numOrden, self) {
    return new Promise((resolve, reject) => {
            var params = [
                { name: 'sucOrden', value: sucOrden, type: self.model.types.INT},
                { name: 'sucProrrateo', value: datos.sucProrrateo, type: self.model.types.INT},
                { name: 'empProrrateo', value: datos.empProrrateo, type: self.model.types.INT},
                { name: 'precioUnitario', value: datos.montoSuc, type: self.model.types.INT},
                { name: 'orden', value: numOrden, type: self.model.types.STRING},
                { name: 'idConcepto', value: datos.idConcepto, type: self.model.types.STRING},
                ];
            self.model.query('INS_PRORRATEOORDEN_SP', params, async function(error, result) {
                if (!error) {
                    resolve(result)
                    console.log(result)
                } else {
                    reject(error);
                }
            });
    });
}

prorrateoOrden.prototype.get_detalleOrden = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'folio', value: req.query.orden, type: self.model.types.STRING }
    ];

    this.model.query('SEL_DETALLE_ORDEN_COMPRA_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_areaAfectacion = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_AREA_AFECTACION', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_conceptosProrrateo = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_CONCEPTOS_PRORRATEO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_guardarRelacion = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEsquema', value: req.query.idEsquema, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'Orden', value: req.query.Orden, type: self.model.types.STRING },
        { name: 'Area', value: req.query.Area, type: self.model.types.STRING },
        { name: 'Concepto', value: req.query.Concepto, type: self.model.types.STRING },
        { name: 'TipoIVA', value: req.query.TipoIVA, type: self.model.types.STRING },
        { name: 'monto', value: req.query.monto, type: self.model.types.DECIMAL }
    ];

    this.model.query('INS_DETALLEPRORRATEO_ORDEN_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


prorrateoOrden.prototype.get_detalleProrrateoOrden = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idEsquema', value: req.query.idEsquema, type: self.model.types.INT },
        { name: 'folio', value: req.query.folio, type: self.model.types.STRING }
    ];

    this.model.query('SEL_DETALLE_PRORRATEO_ORDEN', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_delRelacionAreaConcepto = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'id', value: req.query.id, type: self.model.types.INT }
    ];

    this.model.query('DEL_RELACION_ESQUEMA_PRORRATEO_ORDEN', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

prorrateoOrden.prototype.get_insOrdenMasIva = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'orden', value: req.query.orden, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('INS_ORDENMASIVA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = prorrateoOrden;