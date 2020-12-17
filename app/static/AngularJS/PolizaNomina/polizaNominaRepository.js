var polizaNominaURL = global_settings.urlCORS + 'api/polizaNomina/';

registrationModule.factory('polizaNominaRepository', function($http) {
    return {
        prevSession: {
            isFirstTime: true,
            ddlBancoDisabled: null,
            ddlCuentaDisabled: null,
            txtFechasDisabled: null,
            btnBuscarDisabled: null,
            carteraControlsDisabled: null,
            selectedValueEmpresaID: null,
            selectedValueBancoID: null,
            selectedValueCuentaID: null,
            selectedValueFechaInicio: null,
            selectedValueFechaFin: null,
            btnSwitchIsEnable: null,
            selectedValueSucursaID: null,
            selectedValueDepartamentoID: null,
            selectedValueCarteraFechaInicio: null,
            selectedValuecarteraFechaFin: null,
            showUserSearchPanel: null,
            searchType: null,
            searchTypeID: null,
            searchValue: null,
            searchClienteID: null
        },
        seguridad: function(idUsuario) {
            return $http({
                url: polizaNominaURL + 'seguridad/',
                method: "GET",
                params: {idUsuario: idUsuario},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrganizaciones: function(idUsuario,anio) {
            return $http({
                url: polizaNominaURL + 'Organizaciones/',
                method: "GET",
                params: {idUsuario: idUsuario,
                    anio: anio},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getEmpresas: function(idUsuario,anio,id_organizacion) {
            return $http({
                url: polizaNominaURL + 'Empresas/',
                method: "GET",
                params: {idUsuario: idUsuario,
                    anio: anio,
                    id_organizacion:id_organizacion},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getAnios: function() {
            return $http({
                url: polizaNominaURL + 'Anio/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getFechas: function(idUsuario,anio,id_organizacion,idEmpresa) {
            return $http({
                url: polizaNominaURL + 'Fechas/',
                method: "GET",
                params: {idUsuario: idUsuario,
                         anio:anio,
                    id_organizacion:id_organizacion,
                         idEmpresa: idEmpresa},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getNomina: function(idUsuario,anio,id_organizacion,idEmpresa,fecha) {
            return $http({
                url: polizaNominaURL + 'Nomina/',
                method: "GET",
                params: {idUsuario: idUsuario,
                         anio:anio,
                         id_organizacion:id_organizacion,
                         idEmpresa: idEmpresa,
                         fecha: fecha},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getNominaDetalle: function(idusuario,anio,fecha,CME_ID_POSITION,CME_N_POSITION) {
            return $http({
                url: polizaNominaURL + 'DetalleNomina/',
                method: "GET",
                params: {idusuario:idusuario,
                         anio:anio,
                         fecha: fecha,
                         CME_ID_POSITION:CME_ID_POSITION,
                         CME_N_POSITION:CME_N_POSITION
                        },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getReporteNomina: function(idUsuario,anio,id_organizacion,idEmpresa,fecha) {
            return $http({
                url: polizaNominaURL + 'ReporteNomina/',
                method: "GET",
                params: {idUsuario: idUsuario,
                         anio:anio,
                         id_organizacion:id_organizacion,
                         idEmpresa: idEmpresa,
                         fecha: fecha},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTipoConceptos: function(idUsuario,anio,id_organizacion,idEmpresa,fecha) {
            return $http({
                url: polizaNominaURL + 'TipoConceptos/',
                method: "GET",
                params: {idUsuario: idUsuario,
                         anio:anio,
                         id_organizacion:id_organizacion,
                         idEmpresa: idEmpresa,
                         fecha: fecha},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getGuardarConcepto: function(idUsuario,id_concepto,value) {
            return $http({
                url: polizaNominaURL + 'GuardarConcepto/',
                method: "GET",
                params: {idUsuario: idUsuario,
                    id_concepto:id_concepto,
                    value: value},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getGuardarConceptos: function(value) {
            return $http({
                url: polizaNominaURL + 'GuardarConceptos/',
                method: "GET",
                params: {value: value},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getConceptos: function(idUsuario,anio,id_organizacion,idEmpresa,fecha,tipo) {
            return $http({
                url: polizaNominaURL + 'Conceptos/',
                method: "GET",
                params: {idUsuario: idUsuario,
                         anio:anio,
                         id_organizacion:id_organizacion,
                         idEmpresa: idEmpresa,
                         fecha: fecha,
                        tipo:tipo},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        gridDocumentosOptions: function() {
            return {
                enableRowSelection: false,
                enableSelectAll: false,
                enableColumnResize: true,
                enableGridMenu: true,
                enableFiltering: true,
                showGridFooter: true,
                height: 900
            };
        },
        gridDocumentosColumns: function() {
            return [
             
                { name: 'paga', displayName: 'Tipo', cellClass: 'gridCellLeft', minwidth: 100 },
                { name: 'CME_ID_POSITION', displayName: 'Id Posición', cellClass: 'gridCellLeft', width: 150 },
                { name: 'CME_N_POSITION', displayName: 'Posición', cellClass: 'gridCellLeft', width: 250 },
                { name: 'u_organizativa', displayName: 'Organización', cellClass: 'gridCellLeft', width:250 },
                { name: 'importe', displayName: 'Importe', cellFilter: 'currency', cellClass: 'gridCellRight', width: 150 },
                {
                    name: 'verdetalle',
                    displayName: 'Ver detalle',
                    cellEditableCondition: true,
                    visible: true,
                    enableCellEdit : false,
                    cellClass: 'gridCellCenter',
                    cellTemplate :'<button class="btn btn-info btn-xs" ng-show="row.entity.CME_ID_POSITION>0" ng-click="grid.appScope.verDetallePunteo(row.entity)"><i class="ti-eye"></i></button>',
                    width: 100
                }          
            ];
        } , getReporte: function(myJson) {
            console.log(myJson);
            return $http({
                url: 'http://192.168.20.89:5488/api/report',
                method: "POST",
                data: {
                    template: { name: myJson.template.name },
                    data: myJson.data
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        },
    };
});
