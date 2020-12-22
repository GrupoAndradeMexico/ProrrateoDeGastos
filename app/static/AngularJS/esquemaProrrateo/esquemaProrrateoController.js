registrationModule.controller('esquemaProrrateoController', function ($scope, $rootScope, localStorageService, esquemaProrrateoRepository) {

    $scope.listEmpresas = [];
    $scope.listEmpresaSucursales = [];
    $scope.empresa;
    $scope.sucursalEmp;
    $scope.panelCrear = true;
    $scope.esquemaDetalle = false;
    $scope.listSucursales= [];
    $scope.detalleEsquema= [];
    $scope.muestraTabla = false;
    $scope.encabezadoCreado = 0;
    $scope.nombreEsquema = ''
    $scope.porcentajeSucursal = 0
    $scope.sucursal;
    $scope.nuevoEsquema = false;
    $scope.btnGuardaEsquema = true;
    $scope.fechaSelect;
    $scope.esquemasEncontrados=[];
    $scope.esquemaSelected;
    $scope.detalleSelect = [];
    $scope.muestraEdicionDetalle = false;
    $scope.muestraEsquemasEncontrados = false;
    $scope.estatusEsquema = 'No activo'
    $scope.muestraFechas = false;
    $scope.cbConceptos = true;
    $scope.listConceptos = [];
    $scope.concepto;

    $scope.init = () => {
        $rootScope.userData = localStorageService.get('userData');
        $scope.idUsuario = $rootScope.userData.idUsuario;
        $scope.GetEmpresas();
    }

    $scope.GetEmpresas = () => {

        esquemaProrrateoRepository.getEmpresas().then(result => {

            if (result.data.length) {
                $scope.listEmpresas = result.data;
            }
        })
    }

    $scope.GetSucursales = function () {
        esquemaProrrateoRepository.getSucursales($scope.empresa.emp_idempresa).then(result => {
        
            if (result.data.length > 0) {
                $scope.listEmpresaSucursales = result.data;
   
            }
        });
    }

    $scope.HabilitaBoton = function (opcion){

        if(opcion === 1){
            $scope.btnGuardaEsquema = false;
        }else{
            $scope.muestraFechas = true;
        }

    }

    $scope.GuardaEncabezado = function () {
      
        esquemaProrrateoRepository.guardaEncabezado($scope.nombreEsquema,$scope.empresa.emp_idempresa,$scope.sucursalEmp.suc_idsucursal, $scope.idUsuario).then(result => {
            if(result.data.length >0){
               
                $scope.encabezadoCreado = result.data[0].folioEncabezado;
                $scope.nuevoEsquema = true;
               
                esquemaProrrateoRepository.getAllSucursal().then(result => {
                    if (result.data.length > 0) {
                        $scope.listSucursales = result.data;
                        $scope.esquemaDetalle = true;
                        $scope.btnGuardaEsquema = true;
                    }
                });
            }
        })
    }

    $scope.GuardaDetalle = function(valores){

        var data ={
            idEncabezado: $scope.encabezadoCreado,
            idEmpresa: $scope.sucursal.emp_idempresa,
            idSucursales: $scope.sucursal.suc_idsucursal,
            porcentaje: $scope.porcentajeSucursal,
            idUsuario: $scope.idUsuario,
            idConcepto:$scope.concepto
        }

        $scope.detalleEsquema = [];

        esquemaProrrateoRepository.guardaDetalle(data).then( result => {

            if(result.data.length > 0 ){

                if(result.data[0].estatus === 1){

                    esquemaProrrateoRepository.getDetalleEsquema($scope.encabezadoCreado).then(result => {

                        if(result.data.length >0){
            
                            $scope.detalleEsquema = result.data;
                            $scope.muestraTabla = true;
            
                        }
                        
                    })
                }else{
                    swal('Aviso',result.data[0].mensaje,'warning');
                }

            }
            

        })

    }

  
    $scope.GetSucursales = function () {
        esquemaProrrateoRepository.getSucursales($scope.empresa.emp_idempresa).then(result => {
            if (result.data.length > 0) {
                $scope.listEmpresaSucursales = result.data;
            }
        });
    }

    $scope.Limpiavariables = function(){
        $scope.esquemaDetalle = false;
        $scope.btnGuardaEsquema = false;
        $scope.muestraTabla = false;
        $scope.porcentajeSucursal = 0;
        $scope.nombreEsquema = '';
    }

    $scope.BuscarEsquemas = function(){
        var d = new Date($scope.fechaSelect);
        var mes = d.getMonth()+1;
        var anio = d.getFullYear();
        
        var data = {
            idEmpresa: $scope.empresa.emp_idempresa,
            idSucursal: $scope.sucursalEmp.suc_idsucursal,
            mes:mes,
            anio:anio
        }

        //alert(mes.toString()+'-'+anio.toString());
        esquemaProrrateoRepository.buscaEsquemas(data).then(result =>{

            if(result.data.length > 0){
                $scope.esquemasEncontrados = result.data;
                $scope.muestraEsquemasEncontrados = true;
            }
        })
    }

    $scope.GetDetallesEsquemaSelect = function(){


        var idCabecero = $scope.esquemaSelected.id;
        $scope.listSucursales = [];

        if($scope.esquemaSelected.activo){
            $scope.estatusEsquema ='Activo'
        }
        else{
            $scope.estatusEsquema ='No activo'
        }


        esquemaProrrateoRepository.getDetalleEsquema(idCabecero).then(result => {

            if(result.data.length >= 0){
                $scope.detalleSelect = result.data;

                for(let i = 0; i< $scope.detalleSelect.length; i++){
                    $scope.detalleSelect[i].select = false;
                }

                esquemaProrrateoRepository.getAllSucursal().then(result => {
                    if (result.data.length > 0) {
                        $scope.listSucursales = result.data;
                    }
                });

                $scope.muestraEdicionDetalle = true;
            }
        })


    }

    $scope.setSelectedAproach = function (data){

        $scope.sucursal = data.idSucursal;
        $scope.porcentajeSucursal = data.porcentaje;
        for(let i = 0; i< $scope.detalleSelect.length; i++){

            if($scope.detalleSelect[i].idSucursal !== data.idSucursal){
                $scope.detalleSelect[i].select = false;
            }
        }
      }

      $scope.ActualizaEsquema = function(){
          var datos = $scope.listSucursales.filter(x=> x.suc_idsucursal === $scope.sucursal)[0];
          var indiceDetalle = $scope.detalleSelect.filter(x=> x.select === undefined)[0]
          var data = {
              idDetalle:indiceDetalle.id,
              idUsuario:$scope.idUsuario,
              idEmpresa:datos.emp_idempresa,
              idSucursal:datos.suc_idsucursal,
              porcentaje: $scope.porcentajeSucursal,
              idConcepto:$scope.concepto.PAR_IDENPARA
          }
          console.log(datos);
          esquemaProrrateoRepository.actualizaEsquema(data).then(result => {
                if(result.data.length >0){
                    $scope.GetDetallesEsquemaSelect();
                }
          })
      }

      $scope.GuardaDetalleEdicion = function(){
        var datos = $scope.listSucursales.filter(x=> x.suc_idsucursal === $scope.sucursal)[0];

        var data ={
            idEncabezado: $scope.esquemaSelected.id,
            idEmpresa: datos.emp_idempresa,
            idSucursales: datos.suc_idsucursal,
            porcentaje: $scope.porcentajeSucursal,
            idUsuario: $scope.idUsuario,
            idConcepto:$scope.concepto
        }

        $scope.detalleEsquema = [];

        esquemaProrrateoRepository.guardaDetalle(data).then( result => {

            if(result.data.length > 0 ){

                if(result.data[0].estatus === 1){

                    $scope.GetDetallesEsquemaSelect();
                }else{
                    swal('Aviso',result.data[0].mensaje,'warning');
                }
            }
        })
    }

    $scope.EliminaDetalleEdicion = function(){

        var indiceDetalle = $scope.detalleSelect.filter(x=> x.select !== false)[0]

        esquemaProrrateoRepository.eliminaDetalleEdicion(indiceDetalle.id,$scope.idUsuario).then(result=>{

            if(result.data.length > 0){
                $scope.GetDetallesEsquemaSelect();
            }
        })
    }

    $scope.DesactivaEsquema = function(){


        esquemaProrrateoRepository.desactivaEsquema($scope.esquemaSelected.id, $scope.idUsuario).then(result => {
            if(result.data.length>0){
               swal('Aviso', result.data[0].mensaje, 'info');
               $scope.esquemaSelected.activo = false;
               $scope.GetDetallesEsquemaSelect()
            }
        })

    }

    $scope.Conceptos = function(opcion){
        $scope.listConceptos = [];
        var idSucursal  = 0
        $scope.cbConceptos = false;
        if(opcion === 1 ){
            idSucursal = $scope.sucursal.suc_idsucursal;
        }else{
            idSucursal = $scope.sucursal;
        }

        esquemaProrrateoRepository.getConceptos(idSucursal).then(result => {
            if(result.data.length > 0){
                $scope.listConceptos = result.data;
            }
        })
    }

})