registrationModule.controller('prorrateoOrdenController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, prorrateoSucursalRepository, prorrateoOrdenRepository) {
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
            prorrateoOrdenRepository.getEmpresas().then(function (result) {
                if (result.data.length > 0) {
                    $scope.lstEmpresas = result.data;
                }
            });
        }
    }, 1500);

    $scope.getSucursales = function () {
        prorrateoOrdenRepository.getSucursales($scope.empresa.emp_idempresa).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstSucursales = result.data;    
            }
    });
    }

    $scope.getOrdenes = function () {
        $scope.getEsquemas();
        $scope.verDetalle = false;
        $('#mdlLoading').modal('show');
        if($scope.empresa == undefined || $scope.sucursal == undefined || $scope.fechaInicio  == undefined || $scope.fechaFin  == undefined)
        {
            $('#mdlLoading').modal('hide');
            alertFactory.warning('Todos los criterios de busqueda son obligatorios');
 
        }
        else{
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
                $('#mdlLoading').modal('hide');
                $scope.verDetalle = true;   
            }
            else
            {
                $('#mdlLoading').modal('hide');
                alertFactory.warning('No se encontraron resultados');
            }
        });
    }
    
    }

    $scope.getEsquemas = function () {
        prorrateoOrdenRepository.getEsquemas($scope.empresa.emp_idempresa, $scope.sucursal.suc_idsucursal,0,0).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstEsquemas = result.data;    
            }
            else
            {
                $scope.lstEsquemas = [];
            }
    });
    }

    /*
    $scope.GenerarProrrateo = function () {
        $scope.lstordenes;
        angular.forEach($scope.lstordenes, function (o, key) {
            if (o.prorrateable == true) {
                $('#mdlLoading').modal('show');
                prorrateoOrdenRepository.prorrateoOrden($scope.sucursal.suc_idsucursal, o.monto, $scope.esquema, o.orden).then(function (result) {
                    if (result.data.length > 0) {
                        $('#mdlLoading').modal('hide');
                        alertFactory.success('Polizas creadas correctamente orden: ' + o.orden);
                    }
                    else
                    {
                        $('#mdlLoading').modal('hide');
                        alertFactory.warning('Ocurrio un error');
                    }
            });
            }
        });
    }
    */

   $scope.GenerarProrrateo = async function () {
    var resolved = [];
    var errors = [];

    for (var i = 0; i < $scope.lstordenes.length; i++) {
        if($scope.lstordenes[i].prorrateable == true)
        {
            $('#mdlLoading').modal('show');
            try {
                let detalle = await promiseOrden($scope.sucursal.suc_idsucursal, $scope.lstordenes[i].monto, $scope.esquema, $scope.lstordenes[i].orden);
                var resR ={orden: $scope.lstordenes[i].orden, detalle: detalle }
                resolved.push(resR);
                //resolved.push(await promiseOrden($scope.sucursal.suc_idsucursal, $scope.lstordenes[i].monto, $scope.esquema, $scope.lstordenes[i].orden));
            }
            catch (e) {
                //errors.push(e);
                let detalle = e;
                var resE ={orden: $scope.lstordenes[i].orden, detalle: detalle }
                errors.push(resE);
            }
        }
    }
    if(resolved.length > 0)
    {
        angular.forEach(resolved, function (o, key) {
            alertFactory.success('Polizas creadas correctamente orden: ' + o.orden);
        });
    }

    if(errors.length > 0)
    {
        angular.forEach(errors, function (o, key) {
            alertFactory.success('Ocurrio un error con la siguiente Orden: ' + o.orden);
        });
        
    }
    $('#mdlLoading').modal('hide');

}

    async function promiseOrden(idSucursal, monto, esquema, orden) {
        return new Promise((resolve, reject) => {
            prorrateoOrdenRepository.prorrateoOrden(idSucursal, monto, esquema, orden).then(function (result) {
                if (result.data.length > 0) {
                resolve(result.data);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }
    

})