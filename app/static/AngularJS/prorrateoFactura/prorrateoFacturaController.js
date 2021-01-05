registrationModule.controller('prorrateoFacturaController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,  prorrateoFacturaRepository) {
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
            prorrateoFacturaRepository.getFacturas().then(function (result) {
            if (result.data.length > 0) {
            $scope.lstfacturas = result.data;
            $('#facturasPro').DataTable().clear();
            $('#facturasPro').DataTable().destroy();
            setTimeout(() => {
                $('#facturasPro').DataTable({
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
                $('#facturasPro_length').hide();
            })
                }
            });
        }
    }, 1500);

  
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



})