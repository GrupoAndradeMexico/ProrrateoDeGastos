registrationModule.controller('departamentosController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, porcentajeSucursalRepository, departamentosRepository) {
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;
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
                $scope.getDepartamentos();      
        }
    }, 1500);


$scope.getDepartamentos = function () {
    $('#mdlLoading').modal('show');
    departamentosRepository.getInfoDepartamentos().then(function (result) {
        if (result.data.length > 0) {  
            $scope.lstDepartamentos = result.data;           
            $('#mdlLoading').modal('hide');
        }
        else
        {
            $('#mdlLoading').modal('hide');
        }

});
}




$scope.ModalActualizaPorcentaje = function (detalle)
{
        $scope.consecutivo = detalle.consecutivo;
        $scope.detSucursal = detalle.sucursal;
        $scope.detsMesAnio = detalle.mes + ' - ' + detalle.anio;
        $scope.detporcentaje = detalle.porcentaje;
        $('#actualizaPorcentaje').modal('show');
}


$scope.actualizarPorcentaje = function(detalle){
    let estatus = detalle.activo == true ? 'Inactivo' : 'Activo';
    let dep = detalle.departamento;
    let est = detalle.activo == true ? 0 : 1;
    swal({
        title: dep,
        //title: '¿Deseas enviar el Reembolso?',
        text: 'Actualizar el estatus del departamento a  ' + estatus,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:'Aceptar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
    function (isConfirm) {
        if (isConfirm) {
            departamentosRepository.actualizarPorcentaje(detalle.id_departamento, est, $scope.idUsuario).then(function (result) {
                if (result.data[0].estatus == 1 ) {  
                    $scope.getDepartamentos();     
                    alertFactory.info(result.data[0].msj);
                }
                else
                {
                    alertFactory.warning(result.data[0].msj);
                }
        });
        }}
        );

}

})