var prorrateoFacturaView = require('../views/reference'),
    prorrateoFacturaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
http = require('http')
var conf = require('../../../conf');

var prorrateoFactura = function(conf) {
    this.conf = conf || {};

    this.view = new prorrateoFacturaView();
    this.model = new prorrateoFacturaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

prorrateoFactura.prototype.get_facturas = function(req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('SEL_FACTURASPRORRATEO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = prorrateoFactura;