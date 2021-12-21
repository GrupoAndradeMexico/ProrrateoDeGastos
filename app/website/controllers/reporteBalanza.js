var reporteBalanzaView = require('../views/reference'),
reporteBalanzaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
http = require('http')
var conf = require('../../../conf');

var reporteBalanza = function(conf) {
    this.conf = conf || {};

    this.view = new reporteBalanzaView();
    this.model = new reporteBalanzaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


reporteBalanza.prototype.get_ReporteBalanza = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'mes', value: req.query.mes, type: self.model.types.INT },
        { name: 'quincena', value: req.query.quincena, type: self.model.types.INT },
    ];

    this.model.query('SEL_REPORTE_BALANZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



module.exports = reporteBalanza;