registrationModule.controller('porcentajeSucursalServicioController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, porcentajeSucursalServicioRepository, consultaPolizaNominaRepository) {
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
                    $scope.getInfoPorcentajesServicio();      
        }
    }, 1500);

    


$scope.getInfoPorcentajesServicio = function () {
    $('#mdlLoading').modal('show');
    porcentajeSucursalServicioRepository.getInfoPorcentajesServicio().then(function (result) {
        if (result.data.length > 0) {  
            $scope.lstPorcentajes = result.data;           
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
    $scope.lstServicioEstatus = [
        { id:1, text:'Activo'},
        { id:0, text:'Inactivo'}]
        $scope.consecutivo = detalle.consecutivo;
        $scope.detSucursal = detalle.lugar;
        $scope.selectedEstatusServicio = detalle.activo == true ? 1 : 0;
        $scope.detporcentaje = detalle.porcentaje;
        $('#actualizaPorcentaje').modal('show');
}


$scope.actualizarPorcentaje = function(){
    $('#mdlLoading').modal('show');
    porcentajeSucursalServicioRepository.actualizarPorcentaje($scope.consecutivo, $scope.detporcentaje, $scope.idUsuario).then(function (result) {
        if (result.data[0].estatus == 1 ) {  
            $scope.getInfoPorcentajesServicio();
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
        $scope.getLugaresTrabajo();
        $scope.Insporcentaje = 0;
        $scope.selectedSucursal= null
        $('#insertaPorcentaje').modal('show');
}


$scope.getLugaresTrabajo = function () {
    consultaPolizaNominaRepository.LugaresTrabajo().then(function (result) {
        if (result.data.length > 0) {
          $scope.lstLugares = result.data;
        }
      });
}   

$scope.guardarPorcentaje = function(){
    if($scope.selectedSucursal == undefined || $scope.selectedSucursal == null)
    {
        alertFactory.warning('La sucursal es requerida');
    }
    else if  ($scope.Insporcentaje == 0)
    {
        alertFactory.warning('El porcentaje es requerido');
    }
    else{
    $('#mdlLoading').modal('show');
    porcentajeSucursalServicioRepository.guardarPorcentaje($scope.Insporcentaje,  $scope.idUsuario, $scope.selectedSucursal ).then(function (result) {
        if (result.data[0].estatus == 1 ) {  
            $scope.getInfoPorcentajesServicio();
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