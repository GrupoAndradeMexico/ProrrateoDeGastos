var polizaNominaView = require('../views/reference'),
    polizaNominaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');

var polizaNomina = function(conf) {
    this.conf = conf || {};

    this.view = new polizaNominaView();
    this.model = new polizaNominaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

polizaNomina.prototype.get_Organizaciones = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT }
    ];

    this.model.query('SEL_Organizaciones_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_Empresas = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'id_organizacion', value: req.query.id_organizacion, type: self.model.types.STRING },
    ];

    this.model.query('SEL_Empresas_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_anio = function(req, res, next) {
    var self = this;
    
    var params = [
       
    ];

    this.model.query('SEL_Anio_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_Fechas = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'id_organizacion', value: req.query.id_organizacion, type: self.model.types.STRING } ,
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
    ];

    this.model.query('SEL_Fechas_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_Nomina = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'id_organizacion', value: req.query.id_organizacion, type: self.model.types.STRING } ,
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'fecha', value: req.query.fecha, type: self.model.types.STRING }
    ];

    this.model.query('SEL_Nomina_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_ReporteNomina = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'id_organizacion', value: req.query.id_organizacion, type: self.model.types.STRING } ,
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'fecha', value: req.query.fecha, type: self.model.types.STRING }
    ];

    this.model.query('SEL_ReporteNomina_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_TipoConceptos = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'id_organizacion', value: req.query.id_organizacion, type: self.model.types.STRING } ,
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'fecha', value: req.query.fecha, type: self.model.types.STRING }
    ];

    this.model.query('SEL_TipoConcepto_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_DetalleNomina = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idusuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
        { name: 'CME_ID_POSITION', value: req.query.CME_ID_POSITION, type: self.model.types.INT },
        { name: 'CME_N_POSITION', value: req.query.CME_N_POSITION, type: self.model.types.STRING }
    ];

    this.model.query('SEL_DetalleNomina_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_Conceptos = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'id_organizacion', value: req.query.id_organizacion, type: self.model.types.STRING } ,
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
        { name: 'tipo', value: req.query.tipo, type: self.model.types.STRING }
    ];

    this.model.query('SEL_Concepto_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_GuardarConcepto = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'id_concepto', value: req.query.id_concepto, type: self.model.types.INT } ,
        { name: 'valor', value: req.query.value, type: self.model.types.INT },
      
    ];

    this.model.query('SEL_GuardarConcepto_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_GuardarConceptos = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'valor', value: req.query.value, type: self.model.types.STRING },
      
    ];

    this.model.query('SEL_GuardarConceptos_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_UPDCatalogo = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idsubtramite', value: req.query.idsubtramite, type: self.model.types.INT },
        { name: 'subtramite', value: req.query.subtramite, type: self.model.types.STRING },
        { name: 'idclasificacion', value: req.query.idclasificacion, type: self.model.types.INT },
        { name: 'costo', value: req.query.costo, type: self.model.types.INT },
        { name: 'precio', value: req.query.precio, type: self.model.types.INT },
        { name: 'conUtilidad', value: req.query.conUtilidad, type: self.model.types.INT },
    ];

    this.model.query('UPD_Catalogo_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_DELCatalogo = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idsubtramite', value: req.query.idsubtramite, type: self.model.types.INT },
        { name: 'estatus', value: req.query.estatus, type: self.model.types.INT }
    ];

    this.model.query('DEL_Catalogo_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizaNomina.prototype.get_SelProveedores = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_Proveedor_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_SelTramites = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_Tramites_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
polizaNomina.prototype.get_INSCatalogo = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'subtramite', value: req.query.subtramite, type: self.model.types.STRING },
        { name: 'idclasificacion', value: req.query.idclasificacion, type: self.model.types.STRING },
        { name: 'idpersona', value: req.query.idpersona, type: self.model.types.INT },
        { name: 'costo', value: req.query.costo, type: self.model.types.DECIMAL },
        { name: 'precio', value: req.query.precio, type: self.model.types.DECIMAL }
    ];

    this.model.query('INS_Catalogo_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = polizaNomina;