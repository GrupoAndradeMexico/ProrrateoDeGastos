registrationModule.controller('comisionesFlotillasController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository,  comisionesFlotillasRepository, porcentajeSucursalRepository) {
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
    comisionesFlotillasRepository.getInfoDepartamentosComisiones().then(function (result) {
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

$scope.ModalInsertaPorcentaje = function (flotilla)
{
        $scope.getsucursales();
        //$scope.InsMesAnio = $scope.selectedMes+ ' - ' + $scope.selectedAnio.anio;
        $scope.Insporcentaje = 0;
        $scope.selectedSucursal= null
        $scope.IdFlotilla = flotilla.id_departamento;
        $scope.flotillaIns = flotilla.departamento;
        $('#insertaPorcentaje').modal('show');
}

$scope.getsucursales = function () {
    porcentajeSucursalRepository.getsucursales().then(function (result) {
        if (result.data.length > 0) {
            $scope.lstSucursales = result.data;
        }
    });
}   




$scope.ModalDetalles = function (det)
{
    $scope.detalles = det;
    $scope.getdetalleFlotillas();
    $('#modalDetalle').modal('show');
}

$scope.getdetalleFlotillas = function() {
    comisionesFlotillasRepository.detalleFlotillas($scope.detalles.id_departamento).then(function(result) {
        $scope.flotillaDetalles = result.data;
    });
            
}


$scope.EliminaSucFlotilla = function(suc) {
    comisionesFlotillasRepository.eliminaSucFlotilla(suc.IdDetalleFlotilla,$scope.idUsuario).then(function(result) {
        if (result.data.length > 0) {
            if(result.data[0].estatus == 1)
            {
                $scope.getDepartamentos();  
                alertFactory.success('Se elimino de manera correcta');
                $('#modalDetalle').modal('hide');
            }
        }

    });
            
}

$scope.guardarPorcentaje = function() {
    if($scope.selectedSucursal == undefined || $scope.selectedSucursal == null)
    {
        alertFactory.warning('La sucursal es requerida');
    }
    else if  ($scope.Insporcentaje == 0)
    {
        alertFactory.warning('El porcentaje es requerido');
    }
    else{
    comisionesFlotillasRepository.insertarSucFlotilla($scope.IdFlotilla, $scope.selectedSucursal, $scope.Insporcentaje, $scope.idUsuario).then(function(result) {
        
        if (result.data.length > 0) {
            if(result.data[0].estatus == 1)
            {
                $scope.getDepartamentos();  
                alertFactory.success(result.data[0].msj);
                $('#insertaPorcentaje').modal('hide');
            }
            else if(result.data[0].estatus == 2)
            {
                alertFactory.warning(result.data[0].msj);
            }
            else
            {
                alertFactory.warning(result.data[0].msj);
            }
         
        }

    });
}
}



})