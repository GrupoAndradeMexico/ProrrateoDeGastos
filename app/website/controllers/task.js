var taskView = require('../views/reference'),
    taskModel = require('../models/dataAccess'),
    cron = require('node-cron'),
    Promise = require('bluebird'),
    http = require('http')
var conf = require('../../../conf');
Rutas = require ('../../../conf.json');
var procesaGastos = Rutas.procesaGastos;
var procesaUtilidadFSR = Rutas.procesaUtilidadFSR;
var procesaPorcentajeFSR = Rutas.procesaPorcentajeFSR;


var task = function (conf) {
    this.conf = conf || {};
    this.view = new taskView();
    this.model = new taskModel({
        parameters: this.conf.parameters
    });
    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
};


cron.schedule(procesaGastos, async  function () {
       // console.log(`=====INICIO=====`);
        var model = new taskModel({
          parameters: conf
        });  
        let dateObj = new Date();
        //let mes = dateObj.getMonth() + 1;
        //let anio = dateObj.getFullYear();
        let mes = 11;
        let anio = 2020;

        var params = [
            { name: 'mes', value: mes, type: model.types.INT },
            { name: 'anio', value: anio, type: model.types.INT },
        ];
        var self = this;

        model.query('SEL_GASTOS_BALANZA_SP', params,async function (error, result) {
            if (error) {
            }
            else {
               // console.log(result);
                var solicitudes = result;
                if(solicitudes.length == 0)
                     {console.log("SIN PENDIENTES");}
                     else
                     {
                        var resolved = [];
                        var errors = [];
                        for (var i = 0; i < solicitudes.length; i++) {
                            try {
                                var paramsSol = {
                                    mes: solicitudes[i].mes,
                                    anio: solicitudes[i].anio,
                                    id_pagadora: solicitudes[i].id_pagadora,
                                 }
                                let PolizaCVFR = await ejecucionGastoBalanza(paramsSol);
                            } catch (e) {
                                errors.push(e);
                            }
                        }           
                     }
            }
        }); 
});

async function ejecucionGastoBalanza(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/ejecucionGastoBalanza",
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


module.exports = task;