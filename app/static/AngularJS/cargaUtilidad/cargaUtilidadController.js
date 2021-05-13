registrationModule.controller('cargaUtilidadController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, cargaUtilidadRepository) {
    $scope.tab = 1;
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;
    $scope.verDetalle = false;
    $scope.maxFecha = new Date().toISOString().substring(0, 10);
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
       $scope.carga();
    }
    }, 1500);

    $scope.carga = function ()
    {
        cargaUtilidadRepository.getCargaUtilidad().then(function (result) {
            if (result.data.length > 0) {
                $scope.lstSemiNuevos = result.data[0];
                $('#Seminuevos').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 15,
                    "order": [[0, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#Seminuevos_length').hide();

                $scope.lstRefacciones = result.data[1];
                $('#Refacciones').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 15,
                    "order": [[0, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $scope.lstFlotillas = result.data[2];

                $('#Refacciones_length').hide();
            }
        });

    }

    $scope.setTab = function (newTab) {
        $scope.tab = newTab;
    };
  
    $scope.isSet = function (tabNum) {
        return $scope.tab == tabNum;
    };

    
    $scope.ModalCargaSeminuevos = function (detalle)
    {
        $scope.idSemiNuevos = detalle.idSemiNuevos
        $scope.SeminuevosSucursal = detalle.sucursal;
        $scope.SeminuevosMesAnio = detalle.mes + ' - ' + detalle.anio;
        $scope.SeminuevosUtilidad = 0;
        $('#cargaUtilidadSemi').modal('show');
    }

    $scope.ModalCargaRefacciones = function (detalle)
    {
        $scope.idRefacciones = detalle.idRefacciones
        $scope.RefaccionesSucursal = detalle.sucursal;
        $scope.RefaccionesMesAnio = detalle.mes + ' - ' + detalle.anio;
        $scope.RefaccionesUtilidad = 0;
        $('#cargaUtilidadRef').modal('show');
    }

    $scope.ModalCargaFlotillas = function (detalle)
    {
        $scope.idFlotillas = detalle.idFlotillas
        $scope.FlotillasSucursal = detalle.sucursal +' - '+  detalle.flotilla;
        $scope.FlotillasMesAnio = detalle.mes + ' - ' + detalle.anio;
        $scope.FlotillasUtilidad = 0;
        $('#cargaUtilidadFlot').modal('show');
    }


    $scope.GuardarSemi = function ()
    {
        $('#cargaUtilidadSemi').modal('hide');
        $('#mdlLoading').modal('show');
        cargaUtilidadRepository.InsSemiNuevos($scope.idSemiNuevos, $scope.SeminuevosUtilidad).then(function (result) {
            if (result.data[0].estatus ==  1) {
                $scope.carga(); 
                $('#mdlLoading').modal('hide');
                alertFactory.success('Se guardo la utilidad, correctamente');
            }
            else
            {
                $('#mdlLoading').modal('hide');
                alertFactory.warning('Ocurrio un error al guardar la utilidad');
            }
        })
    }

    $scope.GuardarRef = function ()
    {
        $('#cargaUtilidadRef').modal('hide');
        $('#mdlLoading').modal('show');
        cargaUtilidadRepository.InsRefacciones($scope.idRefacciones, $scope.RefaccionesUtilidad).then(function (result) {
            if (result.data[0].estatus ==  1) {
                $scope.carga(); 
                $('#mdlLoading').modal('hide');
                alertFactory.success('Se guardo la utilidad, correctamente');
            }
            else
            {
                $('#mdlLoading').modal('hide');
                alertFactory.warning('Ocurrio un error al guardar la utilidad');
            }
        })
    }

    $scope.GuardarFlot = function ()
    {
        $('#cargaUtilidadFlot').modal('hide');
        $('#mdlLoading').modal('show');
        cargaUtilidadRepository.InsFlotillas($scope.idFlotillas, $scope.FlotillasUtilidad).then(function (result) {
            if (result.data[0].estatus ==  1) {
                $scope.carga(); 
                $('#mdlLoading').modal('hide');
                alertFactory.success('Se guardo la utilidad, correctamente');
            }
            else
            {
                $('#mdlLoading').modal('hide');
                alertFactory.warning('Ocurrio un error al guardar la utilidad');
            }
        })
    }



})