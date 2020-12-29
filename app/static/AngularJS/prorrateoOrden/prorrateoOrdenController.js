registrationModule.controller('prorrateoOrdenController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce, polizasRepository, polizaNominaRepository, prorrateoSucursalRepository, prorrateoOrdenRepository, esquemaProrrateoRepository) {
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;
    $scope.verDetalle = false;
    $scope.maxFecha = new Date().toISOString().substring(0, 10);
    $scope.listDetalleOrden = [];
    $scope.listDetalleEsquema = []
    $scope.sucursalSelect;
    $scope.listAreasAfectacion = [];
    $scope.listConeptosVentas = [];
    $scope.areaSelected
    $scope.conceptoSelected
    $scope.detalleSeleccionado = false;
    $scope.habilitaGuardado = false;
    $scope.ordenSelected = ''
    $scope.listaDetalleProrrateoOrden = [];
    $scope.montoTotalOrden = 0;
    $scope.numDetalleOrden = 0;
    $scope.numDetallePro = 0;
    $scope.numDetalleEsquema = 0;
    $scope.habilitaProrrateo = false;

    $scope.seguridad = function () {
        polizaNominaRepository.seguridad($scope.idUsuario).then(function (result) {
            if (result.data.length > 0) {
                console.log('ok');
                $scope.btnAplicarReferencias = false;
            } else {
                $scope.btnAplicarReferencias = true;
                console.log('no trajo nada seguridad');
            }
        }, function (error) {
        });
    };
    setTimeout(function () {
        $(".cargando").remove();
        if ($scope.idUsuario != undefined) {
            prorrateoOrdenRepository.getEmpresas().then(function (result) {
                if (result.data.length > 0) {
                    $scope.lstEmpresas = result.data;
                }
            });
        }
    }, 1500);

    $scope.getSucursales = function () {
        prorrateoOrdenRepository.getSucursales($scope.empresa.emp_idempresa).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstSucursales = result.data;
            }
        });
    }

    $scope.getOrdenes = function () {
        $scope.getEsquemas();
        $scope.verDetalle = false;
        $('#mdlLoading').modal('show');
        if ($scope.empresa == undefined || $scope.sucursal == undefined || $scope.fechaInicio == undefined || $scope.fechaFin == undefined) {
            $('#mdlLoading').modal('hide');
            alertFactory.warning('Todos los criterios de busqueda son obligatorios');

        }
        else {
            $scope.nombreEmpresa = $scope.empresa.emp_nombre;
            $scope.nombreSucursal = $scope.sucursal.suc_nombre;
            let dateI = new Date($scope.fechaInicio);
            let dayI = dateI.getDate();
            let monthI = dateI.getMonth() + 1;
            let yearI = dateI.getFullYear();
            let inicio = dayI + '/' + monthI + '/' + yearI;
            let dateF = new Date($scope.fechaFin);
            let dayF = dateF.getDate();
            let monthF = dateF.getMonth() + 1;
            let yearF = dateF.getFullYear();
            let fin = dayF + '/' + monthF + '/' + yearF;
            $scope.getEsquemas();
            prorrateoOrdenRepository.getOrdenes($scope.empresa.emp_idempresa, $scope.sucursal.suc_idsucursal, inicio, fin).then(function (result) {
                if (result.data.length > 0) {
                    $scope.lstordenes = result.data;
                    $('#mdlLoading').modal('hide');
                    $scope.verDetalle = true;
                }
                else {
                    $('#mdlLoading').modal('hide');
                    alertFactory.warning('No se encontraron resultados');
                }
            });
        }

    }

    $scope.getEsquemas = function () {
        prorrateoOrdenRepository.getEsquemas($scope.empresa.emp_idempresa, $scope.sucursal.suc_idsucursal, 0, 0).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstEsquemas = result.data;
            }
            else {
                $scope.lstEsquemas = [];
            }
        });
    }

    /*
    $scope.GenerarProrrateo = function () {
        $scope.lstordenes;
        angular.forEach($scope.lstordenes, function (o, key) {
            if (o.prorrateable == true) {
                $('#mdlLoading').modal('show');
                prorrateoOrdenRepository.prorrateoOrden($scope.sucursal.suc_idsucursal, o.monto, $scope.esquema, o.orden).then(function (result) {
                    if (result.data.length > 0) {
                        $('#mdlLoading').modal('hide');
                        alertFactory.success('Polizas creadas correctamente orden: ' + o.orden);
                    }
                    else
                    {
                        $('#mdlLoading').modal('hide');
                        alertFactory.warning('Ocurrio un error');
                    }
            });
            }
        });
    }
    */

    //    $scope.GenerarProrrateo = async function () {
    //     var resolved = [];
    //     var errors = [];

    //     for (var i = 0; i < $scope.lstordenes.length; i++) {
    //         if($scope.lstordenes[i].prorrateable == true)
    //         {
    //             $('#mdlLoading').modal('show');
    //             try {
    //                 let detalle = await promiseOrden($scope.sucursal.suc_idsucursal, $scope.lstordenes[i].monto, $scope.esquema, $scope.lstordenes[i].orden);
    //                 var resR ={orden: $scope.lstordenes[i].orden, detalle: detalle }
    //                 resolved.push(resR);
    //                 //resolved.push(await promiseOrden($scope.sucursal.suc_idsucursal, $scope.lstordenes[i].monto, $scope.esquema, $scope.lstordenes[i].orden));
    //             }
    //             catch (e) {
    //                 //errors.push(e);
    //                 let detalle = e;
    //                 var resE ={orden: $scope.lstordenes[i].orden, detalle: detalle }
    //                 errors.push(resE);
    //             }
    //         }
    //     }
    //     if(resolved.length > 0)
    //     {
    //         angular.forEach(resolved, function (o, key) {
    //             alertFactory.success('Polizas creadas correctamente orden: ' + o.orden);
    //         });
    //     }

    //     if(errors.length > 0)
    //     {
    //         angular.forEach(errors, function (o, key) {
    //             alertFactory.success('Ocurrio un error con la siguiente Orden: ' + o.orden);
    //         });

    //     }
    //     $('#mdlLoading').modal('hide');

    // }

    async function promiseOrden(idSucursal, monto, esquema, orden) {
        return new Promise((resolve, reject) => {
            prorrateoOrdenRepository.prorrateoOrden(idSucursal, monto, esquema, orden).then(function (result) {
                if (result.data.length > 0) {
                    resolve(result.data);
                }
            }).catch(err => {
                reject(false);
            });

        });
    }


    $scope.ModalProrrateo = function (orden, monto) {

        $scope.listDetalleOrden = [];
        $scope.listDetalleEsquema = []
        $scope.detalleSeleccionado = false;
        $scope.ordenSelected = orden;
        $scope.montoTotalOrden = monto

        prorrateoOrdenRepository.detalleOrden(orden).then(result => {
            if (result.data.length > 0) {
                $scope.listDetalleOrden = result.data;
                for (i = 0; i < $scope.listDetalleOrden.length; i++) {
                    $scope.listDetalleOrden[i].select = false;
                }

                esquemaProrrateoRepository.getDetalleEsquema($scope.esquema).then(result => {
                    if (result.data.length > 0) {
                        $scope.listDetalleEsquema = result.data;

                        $scope.listDetalleEsquema = $scope.listDetalleEsquema.filter(x => x.nombreSucursal !== 'TOTAL');

                        DetalleProrrateoOrden();

                        $('#modalProrrateo').modal('show');
                    }
                })

            }
        })
    }

    $scope.GetAreaConceptos = function () {

        prorrateoOrdenRepository.getAreaAfectacion($scope.sucursalSelect.idEmpresa, $scope.sucursalSelect.idSucursal).then(result => {
            if (result.data.length > 0) {
                $scope.listAreasAfectacion = result.data;
            }
        });

        prorrateoOrdenRepository.getConceptosProrrateo($scope.sucursalSelect.idEmpresa, $scope.sucursalSelect.idSucursal).then(result => {
            if (result.data.length > 0) {
                $scope.listConeptosVentas = result.data;
            }
        });

    }

    $scope.DetalleSelected = function (opcion) {

        for (var i = 0; i < $scope.listDetalleOrden.length; i++) {
            if ($scope.listDetalleOrden[i].idSucursal !== opcion.idSucursal) {
                $scope.listDetalleOrden.select = false;
            }
            else {
                $scope.detalleSeleccionado = true;
            }
        }
    }

    $scope.HabilitaGuardar = function () {
        if ($scope.sucursalSelect !== undefined &&
            $scope.areaSelected !== undefined &&
            $scope.conceptoSelected !== undefined) {
            $scope.habilitaGuardado = true;
        }
    }


    $scope.GuardaRelacion = function () {


        var detalle = $scope.listDetalleOrden.filter(x => x.select !== false)[0];

        $scope.listaDetalleProrrateoOrden = [];

        data = {
            idEsquema: $scope.esquema,
            idEmpresa: $scope.sucursalSelect.idEmpresa,
            idSucursal: $scope.sucursalSelect.idSucursal,
            Orden: $scope.ordenSelected,
            Area: $scope.areaSelected.PAR_IDENPARA,
            Concepto: $scope.conceptoSelected.PAR_IDENPARA,
            TipoIVA: String(detalle.tipoIva),
            monto: (detalle.totalOrden * ($scope.sucursalSelect.porcentaje / 100))

        }

        prorrateoOrdenRepository.guardarRelacion(data).then(result => {
            if (result.data.length > 0) {
                swal('Info', result.data[0].msg, 'info')
                DetalleProrrateoOrden();
            }
        })
    }

    $scope.EliminaSeleccion = function (id) {
        prorrateoOrdenRepository.delRelacionAreaConcepto(id).then(result => {
            if (result.data.length > 0) {
                swal('Aviso', 'Se a eliminado la relación seleccionada', 'warning');
                DetalleProrrateoOrden();
            }
        })
    }

    $scope.GenerarProrrateo = function () {
        prorrateoOrdenRepository.insOrdenMasIva($scope.ordenSelected, $scope.sucursalSelect.idEmpresa, $scope.sucursalSelect.idSucursal).then(result => {
            if (result.data.length > 0) {
                swal('Info', 'Se inserto en ordenes masivas')
            }
        })
    }

    function DetalleProrrateoOrden() {

        $scope.listaDetalleProrrateoOrden = [];

        prorrateoOrdenRepository.getDetalleProrrateoOrden($scope.esquema, $scope.ordenSelected).then(result => {
            if (result.data.length > 0) {
                $scope.listaDetalleProrrateoOrden = result.data;
            }
            ValidaNumeroRegistros();

        });
    }

    $scope.GenerarProrrateo = async function () {
        var resolved = [];
        var errors = [];

        for (var i = 0; i < $scope.listaDetalleProrrateoOrden.length; i++) {
            
                $('#mdlLoading').modal('show');
                try {
                    let detalle = await promiseOrdenMasiva($scope.ordenSelected, $scope.listaDetalleProrrateoOrden[i].idEmpresaProrrateo, $scope.listaDetalleProrrateoOrden[i].idSucursalProrrateo);
                    var resR = { orden: $scope.lstordenes[i].orden, detalle: detalle }
                    resolved.push(resR);
                    //resolved.push(await promiseOrden($scope.sucursal.suc_idsucursal, $scope.lstordenes[i].monto, $scope.esquema, $scope.lstordenes[i].orden));
                }
                catch (e) {
                    //errors.push(e);
                    let detalle = e;
                    var resE = { orden: $scope.ordenSelected, detalle: detalle }
                    errors.push(resE);
                }
            
        }
        if (resolved.length > 0) {
            angular.forEach(resolved, function (o, key) {
                alertFactory.success('Polizas creadas correctamente orden: ' + o.orden);
            });
        }

        if (errors.length > 0) {
            angular.forEach(errors, function (o, key) {
                alertFactory.success('Ocurrio un error con la siguiente Orden: ' + o.orden);
            });

        }
        $('#mdlLoading').modal('hide');

    }

    async function promiseOrdenMasiva(orden, idEmpresa, idSucursal) {
        return new Promise((resolve, reject) => {
            prorrateoOrdenRepository.insOrdenMasIva(orden, idEmpresa,idSucursal).then(function (result) {
                if (result.data.length > 0) {
                    resolve(result.data);
                }
            }).catch(err => {
                reject(false);
            });

        });
    }

    function ValidaNumeroRegistros(){

        $scope.numDetalleOrden = $scope.listDetalleOrden.length;
        $scope.numDetalleEsquema = $scope.listDetalleEsquema.length;

        var totalRegistros = $scope.numDetalleOrden *  $scope.numDetalleEsquema;

        if(totalRegistros === $scope.listaDetalleProrrateoOrden.length){
            $scope.habilitaProrrateo = true;
        }
        else if(totalRegistros < $scope.listaDetalleProrrateoOrden.length)
        {
            swal('Alerta','El número de detalles supera lo esperado','warning')
            $scope.habilitaProrrateo = false;
        }
        else if(totalRegistros > $scope.listaDetalleProrrateoOrden.length)
        {
            swal('Alerta','El número de detalles es menor a lo esperado','warning')
            $scope.habilitaProrrateo = false;
        }

    }

})