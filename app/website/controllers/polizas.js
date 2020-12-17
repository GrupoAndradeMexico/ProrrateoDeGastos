var polizasView = require('../views/reference'),
    polizasModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
http = require('http')
var conf = require('../../../conf');

var polizas = function(conf) {
    this.conf = conf || {};

    this.view = new polizasView();
    this.model = new polizasModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

polizas.prototype.get_EmpresasPagadoras = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    ];

    this.model.query('SEL_EMPRESAS_PAGADORAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizas.prototype.get_UnidadOrganizativa = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'id_pagadora', value: req.query.idpagadora, type: self.model.types.INT },
    ];

    this.model.query('SEL_UNIDADORGANIZATIVA_PAGADORA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizas.prototype.get_LugardeTrabajo = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'id_pagadora', value: req.query.idpagadora, type: self.model.types.INT },
    ];

    this.model.query('SEL_LUGARTRABAJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizas.prototype.get_TipoPoliza = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'id_pagadora', value: req.query.idpagadora, type: self.model.types.INT },
        { name: 'origen', value: req.query.origen, type: self.model.types.STRING },
    ];

    this.model.query('SEL_TIPOPOLIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizas.prototype.get_Pagas = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
    ];

    this.model.query('SEL_NOMBREPAGA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizas.prototype.get_InfoNomina = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'paga', value: req.query.paga, type: self.model.types.STRING },
        { name: 'poliza', value: req.query.poliza, type: self.model.types.INT },
        { name: 'frecuencia', value: req.query.frecuencia, type: self.model.types.STRING },
        { name: 'lugarTrabajo', value: req.query.lugarTrabajo, type: self.model.types.STRING },
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'pagadora', value: req.query.pagadora, type: self.model.types.STRING },
    ];

    this.model.queryAllRecordSet('SEL_EJECUTA_POLIZA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizas.prototype.post_InfoNominas = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'paga', value: req.body.paga, type: self.model.types.STRING },
        { name: 'poliza', value: req.body.poliza, type: self.model.types.INT },
        { name: 'frecuencia', value: req.body.frecuencia, type: self.model.types.STRING },
        { name: 'lugarTrabajo', value: req.body.lugarTrabajo, type: self.model.types.STRING },
        { name: 'mes', value: req.body.mes, type: self.model.types.INT },
        { name: 'anio', value: req.body.anio, type: self.model.types.INT },
        { name: 'pagadora', value: req.body.pagadora, type: self.model.types.STRING },
    ];

    this.model.queryAllRecordSet('SEL_EJECUTA_POLIZA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

polizas.prototype.get_InfoNominaxPagadora = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'id_pagadora', value: req.query.pagadora, type: self.model.types.INT },
        { name: 'origen', value: req.query.origen, type: self.model.types.STRING },
    ];

    this.model.query('SEL_TIPOPOLIZA_SP', params, async function(error, result) {
        if (error) {
        }
        else {
            var polizas = result;
            var resolved = [];
            var errors = [];
            for (i = 0; i < polizas.length; i ++) {
                polizas[i].detalle = [];
                polizas[i].totalDebe = 0;
                polizas[i].totalhaber = 0;
                polizas[i].fecha = '';
            }
                        for (var i = 0; i < polizas.length; i++) {
                            try {
                                var paramentros = {
                                    paga: req.query.paga,
                                    poliza: polizas[i].id_poliza, 
                                    frecuencia: req.query.frecuencia, 
                                    lugarTrabajo: req.query.lugarTrabajo,
                                    mes: req.query.mes, 
                                    anio: req.query.anio, 
                                    pagadora: req.query.pagadora }
                                    var detalle = await InfoPolizas(paramentros);
                                    var  verdetalle =  JSON.parse(detalle);
                                    polizas[i].detalle = verdetalle[1]; 
                                    polizas[i].totalDebe = verdetalle[2][0].debe;
                                    polizas[i].totalhaber = verdetalle[2][0].haber;
                                    polizas[i].fecha = verdetalle[0][0].fechaPaga;                                                
                            } catch (e) {
                                errors.push(e);
                            }
                        }  
                        self.view.expositor(res, {
                            error: error,
                            result: polizas
                        });
        }
    });
};

polizas.prototype.post_insertPoliza= function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idsucursal', value: req.body.idsucursal, type: self.model.types.INT },
        { name: 'tipoProceso', value: req.body.tipoProceso, type: self.model.types.INT },
        { name: 'documentoOrigen', value: req.body.documentoOrigen, type: self.model.types.STRING },
        { name: 'ventaUnitario', value: req.body.ventaUnitario, type: self.model.types.DECIMAL },
        { name: 'tipoProducto', value: req.body.tipoProducto, type: self.model.types.STRING },
        { name: 'canal', value: req.body.canal, type: self.model.types.STRING },
    ];
    
    this.model.query('INS_POLIZA_NOMINAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

async function InfoPolizas(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/polizas/InfoNominas",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (res3) {
            var response = "";
            res3.on('data', (d) => {
                response += d;
            }).on('end', () => {
                console.log(response);
                resolve(response);
            }).on('error', function (err) {
                console.log('HTTP2 request failed: ' + err);
                reject(err);
            });
        });
    req.write(JSON.stringify(params));
    req.end();
  });
}


module.exports = polizas;