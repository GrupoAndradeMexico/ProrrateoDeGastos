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
    $scope.listDetalleOrdenTrue = [];

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
                $('#ordenesPro').DataTable().clear();
            $('#ordenesPro').DataTable().destroy();
            setTimeout(() => {
                $('#ordenesPro').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 15,
                    "order": [[3, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#ordenesPro_length').hide();
            })
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
        sessionStorage.setItem('Orden', orden);
        $scope.lstEsquemas = [];
        $scope.habilitaProrrateo = false;
        $scope.listDetalleOrden = [];
        $scope.listDetalleEsquema = []
        $scope.detalleSeleccionado = false;
        $scope.ordenSelected = orden;
        $scope.montoTotalOrden = monto;
        $scope.crearEsquema = 0;
        $scope.listaProrrateo = []
        prorrateoOrdenRepository.detalleOrden(orden).then(result => {
            if (result.data.length > 0) {
                $scope.listDetalleOrden = result.data[0];
                $scope.lstEsquemasPlantillas  = result.data[1];
                //$scope.lstDetallesEsq = result.data[2];
             
    
                for (i = 0; i < $scope.listDetalleOrden.length; i++) {
                    $scope.listDetalleOrden[i].select = true;
                }

                if($scope.lstEsquemasPlantillas.length > 0)
                {

                    angular.forEach($scope.lstEsquemasPlantillas, function (o, key) {
                        if(o.detalles == $scope.listDetalleOrden.length) 
                        {
                            $scope.lstEsquemas.push(o);
                            $scope.esquema = o.id;
                            $scope.traeDetallePlantillas($scope.esquema); 
                        }
                        if($scope.lstEsquemas.length == 0)
                        {
                        $scope.crearEsquema = 1;
                        }
                    }) 
                }
                

                $('#modalProrrateo').modal('show');
                /*    
                esquemaProrrateoRepository.getDetalleEsquema($scope.esquema).then(result => {
                    if (result.data.length > 0) {
                        $scope.listDetalleEsquema = result.data;

                        $scope.listDetalleEsquema = $scope.listDetalleEsquema.filter(x => x.nombreSucursal !== 'TOTAL');

                        DetalleProrrateoOrden();
                    }
                })
                */
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
        //$('#mdlLoading').modal('show');
        $scope.listDetalleOrdenTrue = [];
        for (var i = 0; i < $scope.listDetalleOrden.length; i++) {
            if ($scope.listDetalleOrden[i].area == opcion.area && $scope.listDetalleOrden[i].idConsecutivoOC == opcion.idConsecutivoOC)  {
                $scope.listDetalleOrden[i].select = opcion.select;
            }
        }
        var detalles = '';
        var montoDetalles = 0;
        for (var i = 0; i < $scope.listDetalleOrden.length; i++) {
            if ($scope.listDetalleOrden[i].select == true)  {
                let det =  $scope.listDetalleOrden[i].idConsecutivoOC + ',';
                detalles += det;
                montoDetalles += $scope.listDetalleOrden[i].totalDetalle;
                $scope.listDetalleOrdenTrue.push($scope.listDetalleOrden[i]);
            }
        }
        detalles =  detalles.substring(0, detalles.length - 1);
        $scope.montoTotalOrden = montoDetalles;
        prorrateoOrdenRepository.detallesOC(detalles).then(result => {
            if (result.data.length > 0) {
                $scope.lstEsquemas = [];
                $scope.habilitaProrrateo = false; 
                $scope.detallesOC = result.data;
                angular.forEach($scope.detallesOC, function (o, key) {
                   if(o.detalles == $scope.listDetalleOrdenTrue.length) 
                   {
                    $scope.lstEsquemas.push(o); 
                    $scope.esquema = $scope.lstEsquemas[0].id;
                    $scope.traeDetallePlantillas($scope.esquema);
                    $scope.habilitaProrrateo = true; 
                    $scope.crearEsquema = 0;
                    //$('#mdlLoading').modal('hide');
                   }
                  
                });
                if($scope.lstEsquemas.length ==0)
                {
                 $scope.crearEsquema = 1;
                }
            }
            else{
                $scope.lstEsquemas = [];
                $scope.crearEsquema = 1;
                //$('#mdlLoading').modal('hide');
            }
        })
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
            TipoIVA: String(detalle.tipoiva),
            monto: (detalle.totalOrden * ($scope.sucursalSelect.porcentaje / 100)),
            idDetalle: detalle.idConsecutivoOC

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

    // $scope.GenerarProrrateo = function () {
    //     prorrateoOrdenRepository.insOrdenMasIva($scope.ordenSelected, $scope.sucursalSelect.idEmpresa, $scope.sucursalSelect.idSucursal,$scope.esquema).then(result => {
    //         if (result.data.length > 0) {
    //             swal('Info', 'Se inserto en ordenes masivas')
    //         }
    //     })
    // }

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
        var resolvedFact = [];
        var errorFact = [];
        var indice = -1;

        /*for( var i=0;i<$scope.listaDetalleProrrateoOrden.length; i++){
            indice = -1
            var data = {
                idEmpresa:0,
                idSucursal:0
            }

            data.idEmpresa = $scope.listaDetalleProrrateoOrden[i].idEmpresaProrrateo;
            data.idSucursal = $scope.listaDetalleProrrateoOrden[i].idSucursalProrrateo;

            if(listaProrrateo.length < 1){

                listaProrrateo.push(data)
            }
            else{

                indice = listaProrrateo.findIndex(x => x.idEmpresa == $scope.listaDetalleProrrateoOrden[i].idEmpresaProrrateo && x.idSucursal == $scope.listaDetalleProrrateoOrden[i].idSucursalProrrateo)
                
                if(indice === -1){
                    listaProrrateo.push(data)
                }
            }
        }*/


        try {
            let factura = await promiseOrden($scope.sucursal.suc_idsucursal, $scope.montoTotalOrden, $scope.esquema, $scope.ordenSelected);
            var resp = { orden: $scope.ordenSelected, detalle: factura }
            resolvedFact.push(resp)
        }
        catch (e) {
            let detalleError = e
            let respError = { orden: $scope.ordenSelected, detalle: detalleError }
            errorFact.push(respError)
        }

        if (resolvedFact.length > 0) {
            for (var i = 0; i < $scope.listaProrrateo.length; i++) {

                $('#mdlLoading').modal('show');
                try {
                    let detalle = await promiseOrdenMasiva($scope.ordenSelected, $scope.listaProrrateo[i].idEmpresa, $scope.listaProrrateo[i].idSucursal,$scope.esquema);
                    var resR = { orden: $scope.ordenSelected, detalle: detalle }
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
        }

        if (errorFact.length > 0) {
            angular.forEach(errors, function (o, key) {
                alertFactory.success('Ocurrio un error con la siguiente Orden al guardar la información de la factura: ' + o.orden);
            });
        }


        $('#mdlLoading').modal('hide');

    }

    async function promiseOrdenMasiva(orden, idEmpresa, idSucursal, idEsquema) {
        return new Promise((resolve, reject) => {
            prorrateoOrdenRepository.insOrdenMasIva(orden, idEmpresa, idSucursal, idEsquema).then(function (result) {
                if (result.data.length > 0) {
                    resolve(result.data);
                }
            }).catch(err => {
                reject(false);
            });

        });
    }

    function ValidaNumeroRegistros() {

        $scope.numDetalleOrden = $scope.listDetalleOrden.length;
        $scope.numDetalleEsquema = $scope.listDetalleEsquema.length;

        var totalRegistros = $scope.numDetalleOrden * $scope.numDetalleEsquema;

        if (totalRegistros === $scope.listaDetalleProrrateoOrden.length) {
            $scope.habilitaProrrateo = true;
        }
        else if (totalRegistros < $scope.listaDetalleProrrateoOrden.length) {
            swal('Alerta', 'El número de detalles supera lo esperado', 'warning')
            $scope.habilitaProrrateo = false;
        }
        else if (totalRegistros > $scope.listaDetalleProrrateoOrden.length) {
            swal('Alerta', 'El número de detalles es menor a lo esperado', 'warning')
            $scope.habilitaProrrateo = false;
        }

    }

    $scope.GenerarProrrateoFactura = async function () {
        var resolved = [];
        var errors = [];

        $('#mdlLoading').modal('show');
        try {
            let detalle = await promiseOrden($scope.sucursal.suc_idsucursal, $scope.montoTotalOrden, $scope.esquema, $scope.ordenSelected);
            var resR = { orden: $scope.lstordenes[i].orden, detalle: detalle }
            resolved.push(resR);
            //resolved.push(await promiseOrden($scope.sucursal.suc_idsucursal, $scope.lstordenes[i].monto, $scope.esquema, $scope.lstordenes[i].orden));
        }
        catch (e) {
            //errors.push(e);
            let detalle = e;
            var resE = { orden: $scope.lstordenes[i].orden, detalle: detalle }
            errors.push(resE);
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

    $scope.crearEsquemas = function () {
        $('#modalProrrateo').modal('hide');
        if ($('.modal-backdrop').is(':visible')) {
            $('body').removeClass('modal-open'); 
            $('.modal-backdrop').remove(); 
          };
          $location.path('/plantillaProrrateo');
    } 	

    $scope.traeDetallePlantillas =  function (Esquema) {
        $scope.lstDetallesEsq = [];
        if(Esquema != undefined || Esquema != null || Esquema != 0 )
        {
            prorrateoOrdenRepository.getDetalleProrrateoOrdenPlantilla(Esquema).then(result => {
                if (result.data.length > 0) {
                    $scope.lstDetallesEsq = result.data;
                    $scope.habilitaProrrateo = true;
                }

                if($scope.lstDetallesEsq.length > 0)
                {
                    
                    for( var i=0;i<$scope.lstDetallesEsq.length; i++){
                        indice = -1
                        var data = {
                            idEmpresa:0,
                            idSucursal:0
                        }
                        data.idEmpresa = $scope.lstDetallesEsq[i].id_empresa;
                        data.idSucursal = $scope.lstDetallesEsq[i].id_sucursal;

                        if($scope.listaProrrateo.length < 1){

                            $scope.listaProrrateo.push(data)
                        }
                        else{
            
                            indice = $scope.listaProrrateo.findIndex(x => x.idEmpresa == $scope.lstDetallesEsq[i].id_empresa && x.idSucursal == $scope.lstDetallesEsq[i].id_sucursal)
                            
                            if(indice === -1){
                                $scope.listaProrrateo.push(data)
                            }
                        }
                     }
                }
            });
        }
        else
        {
        } 
    }

})