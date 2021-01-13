registrationModule.controller('plantillaProrrateoController', function ($scope, $rootScope, localStorageService, esquemaProrrateoRepository,prorrateoOrdenRepository,plantillaProrrateoRepository) {

    $scope.listDetalleOrden = [];
    $scope.ordenCompra = '';
    $scope.relacion = {
        idEmpresaOrden:0,
        idSucursalOrden:0,
        sucursalOrden:'',
        idAreaOrden:'',
        areaOrden:'',
        idConceptoOrden:'',
        conceptoOrden:'',
        idEmpresaPro:0,
        idSucursalPro:0,
        idAreaPro:'',
        areaPro:'',
        idConcepto:'',
        conceptoPro:'',
        iva: 16,
        monto: 0
    }
    $scope.esquemaSelected;
    $scope.esquema;
    $scope.sucursalSelect;
    $scope.areaSelected
    $scope.conceptoSelected
    $scope.detalleSeleccionado = false;
    $scope.listaRelaciones = [];
    $scope.nombreRelacion;
    $scope.frecuenciaSelected = "0";


    $scope.init = () => {
        $rootScope.userData = localStorageService.get('userData');
        $scope.idUsuario = $rootScope.userData.idUsuario;
        $scope.ordenCompra = sessionStorage.getItem('Orden'); //'AU-AU-CUA-OT-PE-4245';
        LeeDetalleOrden($scope.ordenCompra)
      
    }

    LeeDetalleOrden = function(orden){
        $scope.listDetalleOrden = [];
        
        
        prorrateoOrdenRepository.detalleOrden(orden).then(result => {
            if (result.data.length > 0){
               
                var datos = result.data[0];

                ObtieneEsquemas(datos.idEmpresa, datos.idSucursal);

                $scope.listDetalleOrden = result.data;
                for (i = 0; i < $scope.listDetalleOrden.length; i++) {
                    $scope.listDetalleOrden[i].select = false;
                }
            }
        })
    }

    ObtieneEsquemas = function(idEmpresa,idSucursal){
        var d = new Date();
        var mes = d.getMonth()+1;
        var anio = d.getFullYear();

        var data = {
            idEmpresa: idEmpresa,
            idSucursal: idSucursal,
            mes:mes,
            anio:anio
        }

        esquemaProrrateoRepository.buscaEsquemas(data).then(result =>{

            if(result.data.length > 0){
                $scope.esquemasEncontrados = result.data;
                $scope.muestraEsquemasEncontrados = true;
            }
        })
    }

    $scope.GetDetallesEsquemaSelect = function(){

        $scope.esquema = $scope.esquemaSelected.id;

        esquemaProrrateoRepository.getDetalleEsquema($scope.esquema).then(result => {
            if (result.data.length > 0) {
                $scope.listDetalleEsquema = result.data;
    
                $scope.listDetalleEsquema = $scope.listDetalleEsquema.filter(x => x.nombreSucursal !== 'TOTAL');
            }
        })
    }

    $scope.GetAreaConceptos = function () {

        if($scope.sucursalSelect === null){
            for (i = 0; i < $scope.listDetalleOrden.length; i++) {
                $scope.listDetalleOrden[i].select = false;
            }
        }

        prorrateoOrdenRepository.getAreaAfectacion($scope.sucursalSelect.idEmpresa, $scope.sucursalSelect.idSucursal).then(result => {
            if (result.data.length > 0) {
                $scope.listAreasAfectacion = result.data;
            }
        });

        prorrateoOrdenRepository.getConceptosProrrateo($scope.sucursalSelect.idEmpresa, $scope.sucursalSelect.idSucursal).then(result => {
            if (result.data.length > 0) {
                $scope.listConeptosVentas = result.data;
            }
        });

    }

    $scope.DetalleSelected = function (opcion) {

        for (var i = 0; i < $scope.listDetalleOrden.length; i++) {
            if ($scope.listDetalleOrden[i].area !== opcion.area) {
                $scope.listDetalleOrden[i].select = false;
            }
            else {
                $scope.detalleSeleccionado = true;
            }
        }

        /* Obtenemos la lista de relaciones */

    }

    $scope.GuardaRelacion = function(){

        var detalleOrdenSelected = $scope.listDetalleOrden.filter(x => x.select !== false)[0];

        $scope.relacion = {
            idEmpresaOrden:detalleOrdenSelected.idEmpresa,
            idSucursalOrden:detalleOrdenSelected.idSucursal,
            sucursalOrden: detalleOrdenSelected.nombreSucursal,
            idAreaOrden:'',
            areaOrden:detalleOrdenSelected.area,
            idConceptoOrden:'',
            conceptoOrden:detalleOrdenSelected.conceptos,
            idEmpresaPro:$scope.sucursalSelect.idEmpresa,
            idSucursalPro:$scope.sucursalSelect.idSucursal,
            sucursalPro: $scope.sucursalSelect.nombreSucursal,
            idAreaPro:$scope.areaSelected.PAR_IDENPARA,
            areaPro:$scope.areaSelected.PAR_DESCRIP1,
            idConcepto: $scope.conceptoSelected.PAR_IDENPARA,
            conceptoPro:$scope.conceptoSelected.PAR_DESCRIP1
        }

        $scope.listaRelaciones.push($scope.relacion)

        $scope.relacion = {
            idEmpresaOrden:0,
            idSucursalOrden:0,
            idAreaOrden:'',
            areaOrden:'',
            idConceptoOrden:'',
            conceptoOrden:'',
            idEmpresaPro:0,
            idSucursalPro:0,
            idAreaPro:'',
            areaPro:'',
            idConcepto:'',
            conceptoPro:''
        }
    }

    $scope.ConfirmarRelacion =  function(){

        var esPlantilla = $('input.checkbox_check').is(':checked');
        var fecha = $("#start").val()

        console.log($scope.frecuenciaSelected)
        var ordenCompra = $scope.ordenCompra === undefined || $scope.ordenCompra === null ? '': $scope.ordenCompra;
        let conceptosPlantilla = [];

       conceptosPlantilla = Array.from(new Set($scope.listaRelaciones.map(s=>s.areaOrden)))
                                 .map(areaOrden => {
                                     return{
                                         areaOrden:areaOrden,
                                         conceptoOrden: $scope.listaRelaciones.find(s => s.areaOrden === areaOrden).conceptoOrden 
                                        }
                                    });

        var dataCabecero ={
            nombreRelacion: $scope.nombreRelacion,
            ordencompra: $scope.ordenCompra,
            idEsquema: $scope.esquemaSelected.id,
            idEmpresa: $scope.listDetalleOrden[0].idEmpresa,
            idSucursal:$scope.listDetalleOrden[0].idSucursal,
            Frecuencia: Number($scope.frecuenciaSelected),
            fechaInicio: fecha,
            idUsuario: $scope.idUsuario,
            esplantilla: esPlantilla === true? 1:0
        }

        plantillaProrrateoRepository.guardaCabecero(dataCabecero).then( async result =>{


            if(result.data.length > 0){
                var dataDetalle={
                    idPlantilla: result.data[0].folio_cabecero,
                    idArea:'',
                    areaDescripcion:'',
                    idConcepto:'',
                    conceptoDescripcion:'',
                    idUsuario:$scope.idUsuario
    
                }

                let resultDetalle;
                let resultRelacion;
                let resultProrrateo

                for (let J = 0; J < conceptosPlantilla.length; J++) {
                    const element = conceptosPlantilla[J];
                    dataDetalle.idArea = ' ';
                    dataDetalle.areaDescripcion = element.areaOrden;
                    dataDetalle.idConcepto = ' ';
                    dataDetalle.conceptoDescripcion = element.conceptoOrden;

                    resultDetalle = await guardaDetalleCabecero(dataDetalle);
                    console.log(resultDetalle);
                }

                for(var i = 0; i < $scope.listaRelaciones.length; i++){

                    resultRelacion = await guardaRelacion($scope.listaRelaciones[i]);
                    console.log(resultRelacion)

                    resultProrrateo = await guardaProrrateo($scope.esquema,ordenCompra,$scope.listaRelaciones[i]);
                    console.log(resultRelacion)

                }

                swal('OK','Se guardo la relación área - concepto para reealizar el prorrateo','info')
            }
        })
    }

    function guardaDetalleCabecero(data){
        return new Promise((resolve, reject) =>{
            plantillaProrrateoRepository.guardaDetalleCabecero(data).then(result => {
                if(result.data.length > 0){
                    resolve(result.data)
                }
            }).catch(err =>{
                reject(false)
            })
        })
    }

    function guardaRelacion(data){
        return new Promise((resolve, reject) =>{
            plantillaProrrateoRepository.guardaRelacion(data).then(result => {
                if(result.data.length > 0){
                    resolve(result.data)
                }
            }).catch(err =>{
                reject(false)
            })
        })
    }

    function guardaProrrateo(idEsquema,orden,data){
        return new Promise((resolve, reject) =>{
            plantillaProrrateoRepository.guardaProrrateo(idEsquema, orden,data).then(result => {
                if(result.data.length > 0){
                    resolve(result.data)
                }
            }).catch(err =>{
                reject(false)
            })
        })
    }

    $scope.EliminaSeleccion = function (indice){
        console.log(indice);
        $scope.listaRelaciones.splice(indice,1);
    }


})