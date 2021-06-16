registrationModule.controller('consultaPolizaNominaController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, gastosNoCentraRepository, consultaPolizaNominaRepository) {
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;
    $scope.selectedAnio;
    $scope.selectedMes;
    $scope.fechaPagaSelected;
    $scope.lstGastos;
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
                ];

                $scope.lstQuincenas = []
            }
    });

    $scope.ObtieneFechasPagas = function(){

        if( isNaN($scope.selectedMes) === false && isNaN($scope.selectedAnio.anio) === false){
            $scope.verDetalle = false;
            consultaPolizaNominaRepository.FechasPagas($scope.selectedMes, $scope.selectedAnio.anio).then(resp => {
                if(resp.data.length > 0){
                    $scope.lstQuincenas = resp.data;
                }
    
            });
        }

    }

    $scope.LimpiaTabla = function(){
        $scope.lstGastos = [];
        $scope.verDetalle = false;
    }

    $scope.GetAsientoContable = function(){
        $scope.totalDebe = 0;
        $scope.totalHaber = 0;
        $scope.lstGastos = [];

        $scope.verDetalle = false;
        $('#mdlLoading').modal('show');
        consultaPolizaNominaRepository.ObtieneAsientoContablePaga($scope.fechaPagaSelected.fechasPaga, $scope.fechaPagaSelected.tipo).then(resp =>{
            if(resp.data.length > 2){
                $scope.lstGastos = resp.data[1];

                $scope.lstGastos.forEach(el => {
                    $scope.totalDebe += el.debe;
                    $scope.totalHaber += el.haber;
                });

                $scope.verDetalle = true;

                $('#tableGastos').DataTable().clear();
                $('#tableGastos').DataTable().destroy();
    
                setTimeout(() => {
                    $('#tableGastos').DataTable({
                        scrollY:        "300px",
                        scrollX:        true,
                        scrollCollapse: true,
                        columnDefs: [
                            { width: 150, targets: 1}
                        ],
                        fixedColumns: true,
                        destroy: true,
                        "responsive": true,
                        searching: true,
                        paging: false,
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
            else{
                $('#mdlLoading').modal('hide');

            }
        });
    }
}
})