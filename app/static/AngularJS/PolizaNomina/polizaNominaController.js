registrationModule.controller('polizaNominaController', function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce,polizaNominaRepository) {
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;
    //$scope.idUsuario = localStorage.getItem("idUsuario");
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
            // console.log('Error');
        });
    };
    ////////////////////////////Filtros
    $scope.selectedValueEmpresaID = 0;
    $scope.selectedValueAnioID = 0;
    $scope.lstEmpresaUsuario = [];
    $scope.lstAnios = [];
    $scope.gridDocumentos = [];
    setTimeout(function () {
        $(".cargando").remove();
        if ($scope.idUsuario != undefined) {
     

            polizaNominaRepository.getAnios().then(function (result) {
                if (result.data.length > 0) {
                    $scope.lstAnios = result.data;
                    $scope.selectedValueAnioID = result.data[result.data.length-1];
                    $scope.getOrganizaciones();
                }
            });


        }
    }, 1500);

    $scope.getOrganizaciones = function () {
        // $scope.lstAnios = [];
        // $scope.selectedValueAnioID = 0;
        $scope.lstOrganizacionUsuario=[];
        $scope.selectedValueOrganizacionID=0;
        $scope.lstEmpresaUsuario=[];
        $scope.selectedValueEmpresaID=0;
        $scope.lstFechas =[];
        $scope.selectedValueFechaID=0;
        $scope.TipoConceptos =[];
        $scope.gridDocumentos.data=[];
        polizaNominaRepository.getOrganizaciones($scope.idUsuario, $scope.selectedValueAnioID.anio).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstOrganizacionUsuario = result.data;
            }
        });
    }
    $scope.getEmpresas = function () {
        // $scope.lstOrganizacionUsuario=[];
        // $scope.selectedValueOrganizacionID=0;
        $scope.lstEmpresaUsuario=[];
        $scope.selectedValueEmpresaID=0;
        $scope.lstFechas =[];
        $scope.selectedValueFechaID=0;
        $scope.TipoConceptos =[];
        $scope.gridDocumentos.data=[];
        polizaNominaRepository.getEmpresas($scope.idUsuario, $scope.selectedValueAnioID.anio, $scope.selectedValueOrganizacionID.id_organizacion).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstEmpresaUsuario = result.data;
            }
        });
    }
    $scope.getFechas = function () {
        // $scope.lstEmpresaUsuario=[];
        // $scope.selectedValueEmpresaID=0;
        $scope.lstFechas =[];
        $scope.selectedValueFechaID=0;
        $scope.TipoConceptos =[];
        $scope.gridDocumentos.data=[];
        polizaNominaRepository.getFechas($scope.idUsuario, $scope.selectedValueAnioID.anio, $scope.selectedValueOrganizacionID.id_organizacion, $scope.selectedValueEmpresaID.id_empresa).then(function (result) {
            if (result.data.length > 0) {
                $scope.lstFechas = result.data;
            }
        });
    }
    ///////////////////////////grid
    //init grids
    $scope.gridDocumentos = polizaNominaRepository.gridDocumentosOptions();
    $scope.gridDocumentos.columnDefs = polizaNominaRepository.gridDocumentosColumns();
    $scope.gridDocumentos.multiSelect = false;
    $scope.EmpresaSeleccionada = false;
    $scope.tabs = [];
    $scope.getNomina = function () {
        $('#mdlLoading').modal('show');
        polizaNominaRepository.getTipoConceptos($scope.idUsuario, $scope.selectedValueAnioID.anio, $scope.selectedValueOrganizacionID.id_organizacion, $scope.selectedValueEmpresaID.id_empresa, $scope.selectedValueFechaID.fecha)
            .then(function (result) {
                $scope.TipoConceptos = result.data;
                if ($scope.TipoConceptos.length > 0) {
                    angular.forEach($scope.TipoConceptos, function (value, key) {
                        polizaNominaRepository.getConceptos($scope.idUsuario, $scope.selectedValueAnioID.anio, $scope.selectedValueOrganizacionID.id_organizacion, $scope.selectedValueEmpresaID.id_empresa, $scope.selectedValueFechaID.fecha, value.tipo).then(function (result) {
                            if (result.data.length > 0) {
                                $scope.tabs[value.tipo] = result.data;

                            }

                        });
                    });

                }
            })
        $scope.EmpresaSeleccionada = true;
        $scope.gridDocumentos.data = [];
        polizaNominaRepository.getNomina($scope.idUsuario, $scope.selectedValueAnioID.anio, $scope.selectedValueOrganizacionID.id_organizacion, $scope.selectedValueEmpresaID.id_empresa, $scope.selectedValueFechaID.fecha).then(function (result) {
            if (result.data.length > 0) {
                $scope.gridDocumentos.data = result.data;

            }
            $('#mdlLoading').modal('hide');

        });
    }
   
    ////////////////////tabsopciones
    $scope.verTabsRef = function () {

        $('#tabsOpciones').modal('show');

    };
    $scope.VerPolizas = function () {
      $('#mdlLoading').modal('show');
        console.log('GO!');
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
       
        $('reporteModalPdf').modal('show');
        //Genero la promesa para enviar la estructura del reporte 

        polizaNominaRepository.getReporteNomina($scope.idUsuario, $scope.selectedValueAnioID.anio, $scope.selectedValueOrganizacionID.id_organizacion, $scope.selectedValueEmpresaID.id_empresa, $scope.selectedValueFechaID.fecha)
        .then(function (result) {
            if (result.data.length > 0) {
                new Promise(function (resolve, reject) {
                    $scope.Reporte = result.data;

                    var rptDetalleConciliacionBancaria = [];
                    rptDetalleConciliacionBancaria =
                    { "empresa":[{
                        "TITULO": "REPORTE DE POLIZAS DE NÓMINA",
                        "ANIO": $scope.selectedValueAnioID.anio,
                        "ORGANIZACION": $scope.selectedValueOrganizacionID.organizacion,
                        "EMPRESA": $scope.selectedValueEmpresaID.empresa,
                        "FECHA": $scope.selectedValueFechaID.fecha,
                    }
                    ],   "datos": $scope.Reporte
                    };
                    var jsonData = {
                        "template": {
                            "name": "ReportePolizaNomina_rpt"
                        },
                        "data": rptDetalleConciliacionBancaria
                        
                    }
                    resolve(jsonData);

                }).then(function (jsonData) {
                    polizaNominaRepository.getReporte(jsonData).then(function (result) {
                        var file = new Blob([result.data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                        $('#mdlLoading').modal('hide');
                        $("<object id='embedReporteHistorico' data=" + $scope.rptResumenConciliacion + " style='width:800px;height:800px;'></object>").appendTo('#htmlReporteConciliacion');
                        $('#reporteModalPdf').modal('show');


                    });
                });





            };
            $("#reporteModalPdf").on('hidden.bs.modal', function () {
                $("#embedReporteHistorico").remove();
            });
        });
    }
    $scope.verDetallePunteo = function(detalle, opcion) {
        $scope.suma=0;
        polizaNominaRepository.getNominaDetalle($scope.idUsuario, detalle.id_anio,$scope.selectedValueFechaID.fecha,detalle.CME_ID_POSITION,detalle.CME_N_POSITION).then(function(result) {
            $('#Detalle').modal('show');
            $scope.detalle = result.data;
            angular.forEach($scope.detalle, function (value, key) {
                $scope.suma = $scope.suma+value.importe;
            });
        });
    };
    $scope.GuardarConcepto = function() 
    {
        $('#mdlLoading').modal('show');
        var valorstring='';
        angular.forEach($scope.TipoConceptos, function (value, key) 
        {
            angular.forEach( $scope.tabs[value.tipo], function (value, key) 
            {
                var check=0;
                if(value.value)
                check=1;
                valorstring=valorstring+$scope.idUsuario+','+value.id_concepto+','+check+'|'
           
             });
        });
        valorstring=valorstring.substring(0,valorstring.length-1);
        $('#tabsOpciones').modal('hide');
        polizaNominaRepository.getGuardarConceptos(valorstring).then(function (result) {
            polizaNominaRepository.getNomina($scope.idUsuario, $scope.selectedValueAnioID.anio, $scope.selectedValueOrganizacionID.id_organizacion, $scope.selectedValueEmpresaID.id_empresa, $scope.selectedValueFechaID.fecha).then(function (result) {
                if (result.data.length > 0) {
                    $scope.gridDocumentos.data = result.data;
    
                }
                $('#mdlLoading').modal('hide');
    
            });
           

         });
      
    
    };
    $scope.GuardaConcepto = function(value) {
     var check=0;
     if(value.value)
     check=1;
        polizaNominaRepository.getGuardarConcepto($scope.idUsuario,value.id_concepto,check).then(function (result) {
           console.log('result',result);

        });
    };


   
})