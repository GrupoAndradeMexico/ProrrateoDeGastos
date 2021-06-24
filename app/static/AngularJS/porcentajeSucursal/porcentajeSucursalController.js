registrationModule.controller('porcentajeSucursalController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, porcentajeSucursalRepository) {
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;
    $scope.verDetalle = false;
    $scope.verTotalPorcentaje = false;
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
                    $scope.getAnios();      
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
    


$scope.getInfoPorcentajes = function () {
    $scope.verDetalle = false;
    $scope.verTotalPorcentaje = false;
    $scope.verInserta = false;
    $('#mdlLoading').modal('show');
    porcentajeSucursalRepository.getInfoPorcentajes($scope.selectedAnio.anio, $scope.selectedMes).then(function (result) {
        if (result.data.length > 0) {  
            $scope.lstPorcentajes = result.data[0];
            $scope.totalPorcentaje = result.data[1][0].porcentajeTotal;
           
            $scope.verTotalPorcentaje = true;
            if($scope.totalPorcentaje < 100)
            {
                $scope.verInserta = true;
            }
            if($scope.lstPorcentajes.length > 0)
            {
                $scope.verDetalle = true;
            }
            $scope.totalPorcentaje = result.data[1][0].porcentajeTotal + '%';

            $('#mdlLoading').modal('hide');
        }

});
}

$scope.getLimpia = function () {
    $scope.verDetalle = false;
    $scope.verTotalPorcentaje = false;
    $scope.verInserta = false;
}

$scope.ModalActualizaPorcentaje = function (detalle)
{
        $scope.consecutivo = detalle.consecutivo;
        $scope.detSucursal = detalle.sucursal;
        $scope.detsMesAnio = detalle.mes + ' - ' + detalle.anio;
        $scope.detporcentaje = detalle.porcentaje;
        $('#actualizaPorcentaje').modal('show');
}

$scope.ModalInsertaPorcentaje = function ()
{
        $scope.getsucursales();
        $scope.InsMesAnio = $scope.selectedMes+ ' - ' + $scope.selectedAnio.anio;
        $scope.Insporcentaje = 0;
        $('#insertaPorcentaje').modal('show');
}


$scope.getsucursales = function () {
    porcentajeSucursalRepository.getsucursales().then(function (result) {
        if (result.data.length > 0) {
            $scope.lstSucursales = result.data;
        }
    });
}   

})