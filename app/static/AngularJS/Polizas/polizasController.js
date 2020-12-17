registrationModule.controller('polizasController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository) {
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
                    //$scope.getUnidadesOrganizativas();
                }
            });
        }
    }, 1500);

    
    $scope.getUnidadesOrganizativas = function () {
        $scope.lstTipoPolizas = [];
        polizasRepository.getUnidadOrganizavaxPagadora($scope.empresa).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstUnidadesOrganizativas = result.data;
                $scope.getTipoPoliza();
            }
        });
    }

    $scope.getLugaresdeTrabajo = function () {
        $scope.lstTipoPolizas = [];
        polizasRepository.getLugarTrabajoxPagadora($scope.empresa).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstLugarestrabajo = result.data;
                $scope.getTipoPoliza();
            }
        });
    }

    $scope.getTipoPoliza = function () {
        polizasRepository.getTipoPolizaxPagadora($scope.empresa, 'PRESTADORA').then(function (result) {
            if (result.data.length > 0) {
                $scope.lstTipoPolizas = result.data;
                $scope.getAnios();
            }
        });
    }

    $scope.getAnios = function () {
        $scope.lstPagas = [];
        polizaNominaRepository.getAnios().then(function (result) {
            if (result.data.length > 0) {
                $scope.lstAnios = result.data;
                //$scope.selectedAnio = result.data[result.data.length-1];
                $scope.lstMeses = [
                    { id:1, text:'Enero'},
                    { id:2, text:'Febrero'},
                    { id:3, text:'Marzo'},
                    { id:4, text:'Abril'},
                    { id:5, text:'MAyo'},
                    { id:6, text:'Junio'},
                    { id:7, text:'Julio'},
                    { id:8, text:'Agosto'},
                    { id:9, text:'Septiembre'},
                    { id:10, text:'Octubre'},
                    { id:11, text:'Noviembre'},
                    { id:12, text:'Diciembre'}
                ]
            }
    });
}
    

$scope.getPagas = function () {
    $scope.lstPagas = [];
    polizasRepository.getPagas($scope.selectedAnio.anio , $scope.selectedMes ).then(function (result) {
        if (result.data.length > 0) {
            $scope.lstPagas = result.data;    
            //$scope.getInfoNominas();
        }
});
}

$scope.getInfoNominas = function () {
    $scope.verDetalle = false;
    $scope.verDetalles = false;
    $('#mdlLoading').modal('show');
    polizasRepository.getInfoNominas($scope.paga.paga, $scope.tipopoliza, $scope.paga.frecuencia, $scope.lugarTrabajo,  $scope.selectedAnio.anio , $scope.selectedMes, $scope.empresa ).then(function (result) {
        if (result.data.length > 0) {
            $scope.verDetalle = true;
            $scope.fechapaga = result.data[0][0].fechaPaga;
            $scope.lstInfoNominas = result.data[1];
            $scope.totales = result.data[2][0];
            $('#mdlLoading').modal('hide');
        }
});
}


$scope.getInfoNominasXPagadora = function () {
    $scope.verDetalle = false;
    $scope.verDetalles = false;
    $('#mdlLoading').modal('show');
    polizasRepository.getInfoNominasXPagadora($scope.paga.paga, $scope.paga.frecuencia, $scope.lugarTrabajo,  $scope.selectedAnio.anio , $scope.selectedMes, $scope.empresa, 'PRESTADORA').then(function (result) {
        if (result.data.length > 0) {
            $scope.verDetalles = true;
            $scope.lstInfoNominasXPagadora = result.data;

            $('#mdlLoading').modal('hide');
        }
});
}


})