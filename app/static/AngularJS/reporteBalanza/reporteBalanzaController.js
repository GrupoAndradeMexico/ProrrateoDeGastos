registrationModule.controller('reporteBalanzaController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, reporteBalanzaRepository) {
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;
    $scope.verDetalle = false;
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
            polizasRepository.getEmpresasPagadoras($scope.idUsuario).then(function (result) {
                if (result.data.length > 0) {
                    $scope.lstEmpresasPagadoras = result.data;
                    $scope.getAnios();
                }
            });
        }
    }, 1500);

    

    $scope.getAnios = function () {
        polizaNominaRepository.getAnios().then(function (result) {
            if (result.data.length > 0) {
                $scope.lstAnios = result.data;
                //$scope.selectedAnio = result.data[result.data.length-1];
                $scope.lstMeses = [
                    { id:1, text:'Enero'},
                    { id:2, text:'Febrero'},
                    { id:3, text:'Marzo'},
                    { id:4, text:'Abril'},
                    { id:5, text:'Mayo'},
                    { id:6, text:'Junio'},
                    { id:7, text:'Julio'},
                    { id:8, text:'Agosto'},
                    { id:9, text:'Septiembre'},
                    { id:10, text:'Octubre'},
                    { id:11, text:'Noviembre'},
                    { id:12, text:'Diciembre'}
                ]
                $scope.lstQuincenas = [
                    { id:1, text:'Primera Quincena'},
                    { id:2, text:'Segunda Quincena'}
                ]
            }
    });
}
    


$scope.getInfoResporte = function () {
    $scope.verDetalle = false;
    $scope.empresa  = '001';
    $('#mdlLoading').modal('show');
    reporteBalanzaRepository.getreporteBalanza($scope.selectedAnio.anio, $scope.selectedMes, $scope.selectedQuincena).then(function (result) {
        if (result.data.length > 0) {
            $scope.verDetalle = true;
            $scope.lstGastos = result.data;
            $('#tableGastos').DataTable().clear();
            $('#tableGastos').DataTable().destroy();

            setTimeout(() => {
                $('#tableGastos').DataTable({
                    scrollY:        "560px",
                    scrollX:        true,
                    //scrollCollapse: false,
                    columnDefs: [
                        { width: 150, targets: 1}
                    ],
                    fixedColumns: true,
                    destroy: true,
                    "responsive": false,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15, 
                    dom: 'Bfrtip',
                    buttons: [
                    'csv', 'excel',
                    ],
                    "order": [[0, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Search',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    },
                });
                $('#tableGastos_length').hide();
            })
            $('#mdlLoading').modal('hide');
        }
        else
        {
            $scope.lstGastos = [];
            console.log('Sin resultados')
        }
});
}



})