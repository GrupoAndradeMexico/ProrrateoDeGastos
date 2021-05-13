registrationModule.controller('prorrateoSucursalController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizasRepository, polizaNominaRepository, prorrateoSucursalRepository) {
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
            polizasRepository.getEmpresasPagadoras($scope.idUsuario).then(function (result) {
                if (result.data.length > 0) {
                    $scope.lstEmpresasPagadoras = result.data;
                }
            });
        }
    }, 1500);

    $scope.getTipoComprobanteXPagadora = function () {
        prorrateoSucursalRepository.getTipoComprobanteXPagadora($scope.empresa).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstTipoComprobantes = result.data;    
            }
    });
    }

    $scope.getGastos = function () {
        $scope.getPlantillasXPagadora();
      
        $scope.verDetalle = false;
        $('#mdlLoading').modal('show');
        $scope.fechaGasto;
        var cargo = '';
        var abono = '';
        let dateObj = new Date($scope.fechaGasto);
        let month = dateObj.getMonth() + 1;
        for (var i = 1; i <= month; i++) 
        {
            let cargodet = 'CTA.CTA_CARGO' + i + '+';
            cargo += cargodet;
            let abonodet = 'CTA.CTA_ABONO' + i + '+'; 
            abono += abonodet;
        }
        cargo =  cargo.substring(0, cargo.length - 1);
        abono = abono.substring(0, abono.length - 1);
        cargomes = 'CTA.CTA_CARGO' + month;
        abonomes = 'CTA.CTA_ABONO' + month;
        let year = dateObj.getFullYear();
        $scope.getPorcentajesGastos(month, year);
        prorrateoSucursalRepository.getBalanza($scope.empresa, cargo, abono, cargomes, abonomes, year).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstDep = result.data[0];
                $scope.lstBalanza = result.data[1]; 
                for (i = 0; i < $scope.lstDep.length; i ++) {
                    $scope.lstDep[i].gastos = [];
                }
                angular.forEach($scope.lstDep, function (dep, key) {
                        angular.forEach($scope.lstBalanza, function (gt, key) {
                            if (dep.CUENTA == gt.DEPARTAMENTO) {
                               dep.gastos.push(gt)
                            }
                        });
                });

                $('#mdlLoading').modal('hide');
                $scope.verDetalle = true;   
            }
        });
    
    }

    $scope.getPlantillasXPagadora = function () {
        prorrateoSucursalRepository.getPlantillasXPagadora($scope.empresa).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstPlantillas = result.data;    
            }
    });
    }

    $scope.getPorcentajesGastos = function (mes, anio) {
        prorrateoSucursalRepository.getPorcentajesGastos(mes, anio).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstPorcentajesGastos = result.data[0];    
                $scope.lstPorcentajesSeminuevos = result.data[1]; 
                $scope.lstPorcentajesRefacciones = result.data[2]; 
            }
    });
    }

    $scope.abrirModalDetalle = function (departamento) {
    $scope.detalleAgenciaGasto = [];
    $scope.Gasto = departamento.DESCRIPCION;
    var detalleDep = departamento.gastos;   
    angular.forEach(detalleDep, function (det, key) {  
        det.CALCULOPORC = 0;
      });
    var flot = 'FLOT';    
    var casa = 'CASA'
    var semi = 'SEMI';

    if (departamento.DESCRIPCION.includes(flot))
    {

    }
    else if (departamento.DESCRIPCION.includes(casa)) 
    {
        angular.forEach($scope.lstPorcentajesRefacciones, function (agencia, key) {
            let data = {
                agencia:'',
                detalle:[],
                total:0,
                porcentaje:0
            }
            data.agencia = agencia.sucursal +' - '+ agencia.porcentaje;
            data.porcentaje = agencia.porcentaje;
           let tot = 0;
            angular.forEach(detalleDep, function (det, key) {  
              det.CALCULOPORC = Math.round(((det.CARGO - det.ABONO) * agencia.porcentaje) / 100);
              det.PORCENTAJE = agencia.porcentaje;
              tot += det.CALCULOPORC;
            });
            data.total = Math.round(tot);
            data.total = formatMoney(data.total);
            data.detalle = detalleDep;
            $scope.detalleAgenciaGasto.push(data);
        });

    }
    else if (departamento.DESCRIPCION.includes(semi)) 
    {
        angular.forEach($scope.lstPorcentajesSeminuevos, function (agencia, key) {
            let data = {
                agencia:'',
                detalle:[],
                total:0,
                porcentaje:0
            }
            data.agencia = agencia.sucursal +' - '+ agencia.porcentaje;
            data.porcentaje = agencia.porcentaje;
           let tot = 0;
            angular.forEach(detalleDep, function (det, key) {  
              det.CALCULOPORC = Math.round(((det.CARGO - det.ABONO) * agencia.porcentaje) / 100);
              det.PORCENTAJE = agencia.porcentaje;
              tot += det.CALCULOPORC;
            });
            data.total = Math.round(tot);
            data.total = formatMoney(data.total);
            data.detalle = detalleDep;
            $scope.detalleAgenciaGasto.push(data);
        });
    }
    else
    {
    angular.forEach($scope.lstPorcentajesGastos, function (agencia, key) {
        let data = {
            agencia:'',
            detalle:[],
            total:0,
            porcentaje:0
        }
        data.agencia = agencia.sucursal +' - '+ agencia.porcentaje;
        data.porcentaje = agencia.porcentaje;
       let tot = 0;
        angular.forEach(detalleDep, function (det, key) {  
          det.CALCULOPORC = Math.round(((det.CARGO - det.ABONO) * agencia.porcentaje) / 100);
          det.PORCENTAJE = agencia.porcentaje;
          tot += det.CALCULOPORC;
        });
        data.total = Math.round(tot);
        data.total = formatMoney(data.total);
        data.detalle = detalleDep;
        $scope.detalleAgenciaGasto.push(data);
    });

    }

    $('#modalDetalle').modal('show');

}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
};


})