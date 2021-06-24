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


$scope.actualizarPorcentaje = function(){
    $('#mdlLoading').modal('show');
    porcentajeSucursalRepository.actualizarPorcentaje($scope.consecutivo,$scope.selectedAnio.anio, $scope.selectedMes, $scope.detporcentaje,  $scope.idUsuario).then(function (result) {
        if (result.data[0].estatus == 1 ) {  
            $scope.getInfoPorcentajes();
            alertFactory.info(result.data[0].msj);
            $('#mdlLoading').modal('hide');
            $('#actualizaPorcentaje').modal('hide');
        }
        else
        {
            $('#mdlLoading').modal('hide');
            alertFactory.warning(result.data[0].msj);
        }

});

}

$scope.ModalInsertaPorcentaje = function ()
{
        $scope.getsucursales();
        $scope.InsMesAnio = $scope.selectedMes+ ' - ' + $scope.selectedAnio.anio;
        $scope.Insporcentaje = 0;
        $scope.selectedSucursal= null
        $('#insertaPorcentaje').modal('show');
}


$scope.getsucursales = function () {
    porcentajeSucursalRepository.getsucursales().then(function (result) {
        if (result.data.length > 0) {
            $scope.lstSucursales = result.data;
        }
    });
}   

$scope.guardarPorcentaje = function(){
    if($scope.selectedSucursal == undefined || $scope.selectedSucursal == null)
    {
        alertFactory.warning('La sucursal es requerida');
    }
    else{
    $('#mdlLoading').modal('show');
    porcentajeSucursalRepository.guardarPorcentaje($scope.selectedAnio.anio, $scope.selectedMes, $scope.Insporcentaje,  $scope.idUsuario, $scope.selectedSucursal ).then(function (result) {
        if (result.data[0].estatus == 1 ) {  
            $scope.getInfoPorcentajes();
            alertFactory.info(result.data[0].msj);
            $('#mdlLoading').modal('hide');
            $('#insertaPorcentaje').modal('hide');
        }
        else if (result.data[0].estatus == 2)
        {
            $('#mdlLoading').modal('hide');
            alertFactory.warning(result.data[0].msj);
        }
        else
        {
            $('#mdlLoading').modal('hide');
            alertFactory.warning(result.data[0].msj);
        }
});
}
}


})