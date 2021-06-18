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
var procesaPercepciones = Rutas.procesaPercepciones;
var procesaPolizas = Rutas.procesaPolizas;


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


cron.schedule(procesaPolizas, async  function () {
    // console.log(`=====INICIO=====`);
     var model = new taskModel({
       parameters: conf
     });  
     let dateObj = new Date();
     //let hora = dateObj.getHours(); 
     //let dia = ("0" + dateObj.getDate()).slice(-2);
     //let mes = ("0" + (dateObj.getMonth() + 1)).slice(-2);
     //let anio = dateObj.getFullYear();
     
     var hora = 11; 
     var dia = '21'
     var mes = '04';
     var anio = '2021';
     let  fecha = dia +'/'+ mes +'/'+ anio;
     
     var params = [
         { name: 'fecha', value: fecha, type: model.types.STRING },
         { name: 'hora', value: hora, type: model.types.INT }
     ];
     var self = this;

     model.query('SEL_PROCESOS_POLIZAS_SP', params,async function (error, result) {
         if (error) {
         }
         else {
             var solicitudes = result;
             if(solicitudes.length == 0)
                  {console.log("SIN PENDIENTES PROCESOS POLIZAS");}
                  else
                  {
                     var resolved = [];
                     var errors = [];
                     for (var i = 0; i < solicitudes.length; i++) {
                         try {
                            var paramBit = {
                                idDetalle: solicitudes[i].idDetalle,
                                }
                            switch (solicitudes[i].idProceso) {
                                case 1:
                                  text = solicitudes[i].proceso;
                                  var paramInf = {
                                    mes: mes,
                                    anio: anio,
                                    idDetalle: solicitudes[i].idDetalle
                                    }
                                  let gasto1 = await ejecucionUtilidades(paramInf);
                                  let x = gasto1;
                                case 2:
                                  text = solicitudes[i].proceso;
                                  break;
                                case 3:
                                  text = solicitudes[i].proceso;
                                  break;
                                case 4:
                                  text = solicitudes[i].proceso;
                                  var paramInf4 = {
                                    mes: mes,
                                    anio: anio,
                                    idDetalle: solicitudes[i].idDetalle
                                    }
                                  let gasto4 = await ejecucionPorcentajeFSR(paramInf4);
                                  let x = gasto4;

                                  break;
                                case 24:
                                  text = solicitudes[i].proceso;
                                  var paramInf24 = {
                                    mes: mes,
                                    anio: anio,
                                    }
                                  let gasto24 = await ejecucionInforme(paramInf24);
                                  //let actualiza = await ejecucionActualizaProceso(paramBit);
                                  break;
                                case 25:
                                    text = solicitudes[i].proceso;
                                    var paramInf25 = {
                                      mes: mes,
                                      anio: anio,
                                      idDetalle: solicitudes[i].idDetalle
                                      }
                                    let gasto25 = await ejecucionPolizaCorpo(paramInf25);
                                    let actualiza25 = await ejecucionActualizaProceso(paramBit);
                                break;
                                case 26:
                                    text = solicitudes[i].proceso;
                                    var paramInf26 = {
                                        prorrateado: 1,
                                        insertaOrden: 1,
                                      }
                                    let gasto26 = await ejecucionOCTRA(paramInf26);
                                    //let actualiza = await ejecucionActualizaProceso(paramBit);
                                break;
                                case 27:
                                    text = solicitudes[i].proceso;
                                    var paramInf27 = {
                                        mes: mes,
                                        anio: anio,
                                        idDetalle: solicitudes[i].idDetalle
                                      }
                                    let gasto27 = await insertaGastosBalanza(paramInf27);
                                    //let actualiza = await ejecucionActualizaProceso(paramBit);
                                break;
                                case 28:
                                    text = solicitudes[i].proceso;
                                    var paramInf28 = {
                                        mes: mes,
                                        anio: anio,
                                        idDetalle: solicitudes[i].idDetalle
                                      }
                                    let gasto28 = await ejecucionGastosBalanza(paramInf28);
                                    //let actualiza = await ejecucionActualizaProceso(paramBit);
                                break;

                              }
                         } catch (e) {
                             errors.push(e);
                         }
                     }           
                  }
         }
     }); 
});

cron.schedule(procesaGastos, async  function () {
       // console.log(`=====INICIO=====`);
        var model = new taskModel({
          parameters: conf
        });  
        let dateObj = new Date();
        let mes = dateObj.getMonth() + 1;
        let anio = dateObj.getFullYear();
        //let mes = 11;
        //let anio = 2020;

        var params = [
            { name: 'mes', value: mes, type: model.types.INT },
            { name: 'anio', value: anio, type: model.types.INT },
        ];
        var self = this;

        model.queryAllRecordSet('SEL_GASTOS_BALANZA_SP', params,async function (error, result) {
            if (error) {
            }
            else {
               // console.log(result);
                var solicitudes = result[0];
                if(solicitudes.length == 0)
                     {console.log("SIN PENDIENTES GASTOS BALANZA");}
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
                                let gasto = await ejecucionGastoBalanza(paramsSol);
                            } catch (e) {
                                errors.push(e);
                            }
                        }           
                     }
            }
        }); 
});

cron.schedule(procesaUtilidadFSR, async  function () {
    // console.log(`=====INICIO=====`);
     var model = new taskModel({
       parameters: conf
     });  
     let dateObj = new Date();
     let mes = dateObj.getMonth() + 1;
     let anio = dateObj.getFullYear();
     //let mes = 11;
     //let anio = 2020;

     var params = [
         { name: 'mes', value: mes, type: model.types.INT },
         { name: 'anio', value: anio, type: model.types.INT },
     ];
     var self = this;

     model.queryAllRecordSet('SEL_GASTOS_BALANZA_SP', params,async function (error, result) {
         if (error) {
         }
         else {
             var solicitudesSemiNuevos = result[1];
             if(solicitudesSemiNuevos.length == 0)
             {console.log("SIN PENDIENTES SEMINUEVOS");}
             else
             {
                var errorsSemiNuevos = [];
                for (var i = 0; i < solicitudesSemiNuevos.length; i++) {
                    try {
                        var paramsSemi = {
                            idSemiNuevos: solicitudesSemiNuevos[i].idSemiNuevos,
                            nombreBase: solicitudesSemiNuevos[i].nombreBase,
                            fechaInicio: solicitudesSemiNuevos[i].fechaInicio,
                            fechaFin: solicitudesSemiNuevos[i].fechaFin,
                              }
                        let guarda = await ejecucionUtilidadSemiNuevos(paramsSemi);
                         } catch (e) {
                            errorsSemiNuevos.push(e);
                         }
                     }           
             }
             var solicitudesRefacciones = result[2];
             if(solicitudesRefacciones.length == 0)
             {console.log("SIN PENDIENTES Refacciones");}
             else
             {
                var errorsRefacciones = [];
                for (var i = 0; i < solicitudesRefacciones.length; i++) {
                    try {
                        var paramsRef = {
                            idRefacciones: solicitudesRefacciones[i].idRefacciones,
                            nombreBase: solicitudesRefacciones[i].nombreBase,
                            fechaInicio: solicitudesRefacciones[i].fechaInicio,
                            fechaFin: solicitudesRefacciones[i].fechaFin,
                            idpersona: solicitudesRefacciones[i].idpersona
                              }
                        let guarda = await ejecucionUtilidadRefacciones(paramsRef);
                         } catch (e) {
                            errorsRefacciones.push(e);
                         }
                     }           
             }
            var solicitudesFlotillas = result[3];
             if(solicitudesFlotillas.length == 0)
             {console.log("SIN PENDIENTES FLOTILLAS");}
             else
             {
                     var resolvedFlotillas = [];
                     var errors = [];
                     for (var i = 0; i < solicitudesFlotillas.length; i++) {
                         try {
                             var paramsFlot = {
                                idFlotillas: solicitudesFlotillas[i].idFlotillas,
                                nombreBase: solicitudesFlotillas[i].nombreBase,
                                fechaInicio: solicitudesFlotillas[i].fechaInicio,
                                fechaFin: solicitudesFlotillas[i].fechaFin,
                                flotilla: solicitudesFlotillas[i].flotilla
                              }
                             let guarda = await ejecucionUtilidadFlotillas(paramsFlot);
                         } catch (e) {
                            resolvedFlotillas.push(e);
                         }
                     }           
             }
         }
     }); 
});

cron.schedule(procesaPorcentajeFSR, async  function () {
    // console.log(`=====INICIO=====`);
     var model = new taskModel({
       parameters: conf
     });  
     let dateObj = new Date();
     let mes = dateObj.getMonth() + 1;
     let anio = dateObj.getFullYear();
     //let mes = 11;
     //let anio = 2020;

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
                             let PolizaCVFR = await ejecucionPorcentajeFSR(paramsSol);
                         } catch (e) {
                             errors.push(e);
                         }
                     }           
                  }
         }
     }); 
});

cron.schedule(procesaPercepciones, async  function () {
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

     model.query('SEL_PERCEPCIONES_PAGADORA_SP', params,async function (error, result) {
         if (error) {
         }
         else {
            // console.log(result);
             var solicitudes = result;
             if(solicitudes.length == 0)
                  {console.log("SIN PENDIENTES PERCEPCIONES");}
                  else
                  {
                     var errors = [];
                     for (var i = 0; i < solicitudes.length; i++) {
                         try {
                             var paramsSol = {
                                 mes: solicitudes[i].mes,
                                 anio: solicitudes[i].anio,
                                 id_pagadora: solicitudes[i].id_pagadora,
                              }
                              let gasto = await ejecucionPercepciones(paramsSol);

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

async function ejecucionUtilidades(params) {

    var model = new taskModel({
        parameters: conf
      });  

    var params = [
        { name: 'mes', value: params.mes, type: model.types.INT },
        { name: 'anio', value: params.anio, type: model.types.INT },
    ];
    var self = this;
    model.queryAllRecordSet('SEL_GASTOS_BALANZA_SP', params,async function (error, result) {
        if (error) {
        }
        else {
            var solicitudesSemiNuevos = result[1];
            if(solicitudesSemiNuevos.length == 0)
            {console.log("SIN PENDIENTES SEMINUEVOS");}
            else
            {
               var errorsSemiNuevos = [];
               console.log('Numero de SemiNuevos ' + solicitudesSemiNuevos.length)
               for (var i = 0; i < solicitudesSemiNuevos.length; i++) {
                   try {
                       var paramsSemi = {
                           idSemiNuevos: solicitudesSemiNuevos[i].idSemiNuevos,
                           nombreBase: solicitudesSemiNuevos[i].nombreBase,
                           fechaInicio: solicitudesSemiNuevos[i].fechaInicio,
                           fechaFin: solicitudesSemiNuevos[i].fechaFin,
                             }
                       let guarda = await ejecucionUtilidadSemiNuevos(paramsSemi);
                       console.log('Registro Numero ' + i);
                        } catch (e) {
                           errorsSemiNuevos.push(e);
                        }
                    }           
            }
            var solicitudesRefacciones = result[2];
            if(solicitudesRefacciones.length == 0)
            {console.log("SIN PENDIENTES Refacciones");}
            else
            {
               var errorsRefacciones = [];
               console.log('Numero de Refacciones ' + solicitudesRefacciones.length)
               for (var i = 0; i < solicitudesRefacciones.length; i++) {
                   try {
                       var paramsRef = {
                           idRefacciones: solicitudesRefacciones[i].idRefacciones,
                           nombreBase: solicitudesRefacciones[i].nombreBase,
                           fechaInicio: solicitudesRefacciones[i].fechaInicio,
                           fechaFin: solicitudesRefacciones[i].fechaFin,
                           idpersona: solicitudesRefacciones[i].id_persona
                             }
                       let guarda = await ejecucionUtilidadRefacciones(paramsRef);
                       console.log('Registro Numero ' + i);
                        } catch (e) {
                           errorsRefacciones.push(e);
                        }
                    }           
            }
           var solicitudesFlotillas = result[3];
            if(solicitudesFlotillas.length == 0)
            {console.log("SIN PENDIENTES FLOTILLAS");}
            else
            {
                    var resolvedFlotillas = [];
                    var errors = [];
                    console.log('Numero de Flotillas ' + solicitudesFlotillas.length)
                    for (var i = 0; i < solicitudesFlotillas.length; i++) {
                        try {
                            var paramsFlot = {
                               idFlotillas: solicitudesFlotillas[i].idFlotillas,
                               nombreBase: solicitudesFlotillas[i].nombreBase,
                               fechaInicio: solicitudesFlotillas[i].fechaInicio,
                               fechaFin: solicitudesFlotillas[i].fechaFin,
                               flotilla: solicitudesFlotillas[i].flotilla
                             }
                            let guarda = await ejecucionUtilidadFlotillas(paramsFlot);
                            console.log('Registro Numero ' + i);
                            //console.log(paramsFlot)
                
                        } catch (e) {
                           resolvedFlotillas.push(e);
                        }
                    }           
            }
        }
    }); 

    
   }

async function ejecucionUtilidadSemiNuevos(params) {
 return new Promise((resolve, reject) => {
     var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
     var req = http.request({
         host: host,
         port: puerto,
         path: "/api/prorrateoSucursal/ejecucionSemiNuevos",
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

async function ejecucionUtilidadRefacciones(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/ejecucionRefacciones",
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

async function ejecucionUtilidadFlotillas(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/ejecucionFlotillas",
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

async function ejecucionPorcentajeFSR(params) {
 return new Promise((resolve, reject) => {
     var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
     var req = http.request({
         host: host,
         port: puerto,
         path: "/api/prorrateoSucursal/ejecucionPorcentajeFSR",
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


async function ejecucionPercepciones(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/ejecucionPercepciones",
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

async function ejecucionInforme(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/ejecucionInforme",
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

async function ejecucionActualizaProceso(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/actualizaProceso",
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

async function ejecucionOCTRA(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/OCTrasinmex",
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

async function ejecucionPolizaCorpo(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/polizaCorpo",
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

async function insertaGastosBalanza(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/insertaGastosBalanza",
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


async function ejecucionGastosBalanza(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/prorrateoSucursal/ejecucionGastosBalanza",
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