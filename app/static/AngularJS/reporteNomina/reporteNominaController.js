registrationModule.controller("reporteNominaController", function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce, polizasRepository, polizaNominaRepository, gastosNoCentraRepository, consultaPolizaNominaRepository,reporteNominaRepository) {
    
    $rootScope.userData = localStorageService.get("userData");
    $scope.idUsuario = $rootScope.userData.idUsuario;
    $scope.selectedAnio;
    $scope.selectedMes;
    $scope.selectedEmpresa;
    $scope.listEmpleadosProrrateo=[];
    $scope.totalEmpleadosProrrateados = 0;


    $scope.init = function () {
     
        if ($rootScope.datosUsuario.length > 0) {
            $scope.idRol = $rootScope.datosUsuario[0].idRol;
        }    
    }

    $scope.ObtieneConciliacion = function(){
            setTimeout(function () {

                consultaPolizaNominaRepository.LugaresTrabajo().then(function (result) {
                    if (result.data.length > 0) {
                        $scope.lstEmpresasPagadoras = result.data;
                        $scope.getAnios();
                    }
                });
        }, 1500);
    }

    $scope.getAnios = function () {
        let fechaActual = new Date();
        let anioActual = fechaActual.getFullYear();
        $scope.mesActual = fechaActual.getMonth() + 1;

        polizaNominaRepository.getAnios().then(function (result) {
            if (result.data.length > 0) {
                $scope.lstAnios = result.data;
                // $scope.selectedAnio = result.data[result.data.length-1];
                $scope.lstMeses = [
                    {
                        id: 1,
                        text: "Enero"
                    },
                    {
                        id: 2,
                        text: "Febrero"
                    },
                    {
                        id: 3,
                        text: "Marzo"
                    },
                    {
                        id: 4,
                        text: "Abril"
                    }, {
                        id: 5,
                        text: "Mayo"
                    }, {
                        id: 6,
                        text: "Junio"
                    }, {
                        id: 7,
                        text: "Julio"
                    }, {
                        id: 8,
                        text: "Agosto"
                    }, {
                        id: 9,
                        text: "Septiembre"
                    }, {
                        id: 10,
                        text: "Octubre"
                    }, {
                        id: 11,
                        text: "Noviembre"
                    }, {
                        id: 12,
                        text: "Diciembre"
                    },
                ];

                $scope.lstQuincenas = [];

           /**
           * SELECCIONAMOS EL AÑO ACTUAL
           */
                $scope.lstAnios.forEach((el) => {
                    if (el.anio === anioActual) {
                        $scope.selectedAnio = el;
                    }
                });

                /**
           * SELECCIONAMOS EL MES ACTUAL
           */
                $scope.lstMeses.forEach((el) => {
                    if (el.id === $scope.mesActual) {
                        $scope.mesActual = el.id;
                        $scope.selectedMes = $scope.mesActual;
                        $scope.bloqueaBoton = false;
                    } else {
                        $scope.bloqueaBoton = true;
                    }
                });

            }
        });
    };

    $scope.GetReporteConciliacion = function(){
        $("#mdlLoading").modal("show");
        reporteNominaRepository.empleadosProrrateadosSucursal($scope.selectedEmpresa.toString()).then(resp =>{
            console.log(resp.data[0]);
            $scope.totalEmpleadosProrrateados = resp.data[0].idRH
        })
        $scope.listData = [];
        reporteNominaRepository.conciliacion($scope.selectedEmpresa.toString(), $scope.selectedMes, $scope.selectedAnio.anio).then(resp =>{
            console.log(resp)
            $scope.listData = resp.data;

            $("#TConciliacion").DataTable().clear();
            $("#TConciliacion").DataTable().destroy();

            setTimeout(() => {
                $("#TConciliacion").DataTable({
                    scrollY: "450px",
                    scrollX: true,
                    scrollCollapse: true,
                    columnDefs: [
                        {
                            width: "10%",
                            targets: 0
                        }, {
                            width: "35%",
                            targets: 2
                        },
                    ],
                    fixedColumns: true,
                    destroy: true,
                    responsive: true,
                    searching: true,
                    paging: false,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15,
                    dom: "Bfrtip",
                    buttons: [
                        "csv", "excel"
                    ],
                    order: [
                        [0, "asc"]
                    ],
                    language: {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: "Search",
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
            }, 1000);

            $("#TConciliacion_length").hide();

            $("#TConciliacionAcumulado").DataTable().clear();
            $("#TConciliacionAcumulado").DataTable().destroy();

            setTimeout(() => {
                $("#TConciliacionAcumulado").DataTable({
                    scrollY: "450px",
                    scrollX: true,
                    scrollCollapse: true,
                    columnDefs: [
                        {
                            width: "10%",
                            targets: 0
                        }, {
                            width: "35%",
                            targets: 2
                        },
                    ],
                    fixedColumns: true,
                    destroy: true,
                    responsive: true,
                    searching: true,
                    paging: false,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15,
                    dom: "Bfrtip",
                    buttons: [
                        "csv", "excel"
                    ],
                    order: [
                        [0, "asc"]
                    ],
                    language: {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: "Search",
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
            }, 1000);

            $("TConciliacionAcumulado_length").hide();

            $("#mdlLoading").modal("hide");

        });
    }

    $scope.ObtieneEmpleados = function(){
        $scope.getAnios();
    }

    $scope.consultaEmpleados = function(){


        $("#mdlLoading").modal("show");
            
        reporteNominaRepository.empleados($scope.selectedMes, $scope.selectedAnio.anio).then(resp =>{
            $scope.listDataEmpleados = resp.data;

            
            $("#TEmpleados").DataTable().clear();
            $("#TEmpleados").DataTable().destroy();

            setTimeout(() => {
                $("#TEmpleados").DataTable({
                    scrollY: "450px",
                    scrollX: true,
                    scrollCollapse: true,
                    columnDefs: [
                        {
                            width: "10%",
                            targets: 0
                        }, {
                            width: "35%",
                            targets: 2
                        },
                    ],
                    fixedColumns: true,
                    destroy: true,
                    responsive: true,
                    searching: true,
                    paging: false,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15,
                    dom: "Bfrtip",
                    buttons: [
                        "csv", "excel"
                    ],
                    order: [
                        [0, "asc"]
                    ],
                    language: {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: "Search",
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
            }, 1000);

            $("#TEmpleados_length").hide();

            $("#mdlLoading").modal("hide");
            
        })
    }

    $scope.ObtieneEmpleadosProrrateados = function(){
        reporteNominaRepository.empleadosProrrateados().then(resp => {
            $scope.listEmpleadosProrrateo = resp.data

            $("#TEmpleadosProrrateados").DataTable().clear();
            $("#TEmpleadosProrrateados").DataTable().destroy();

            setTimeout(() => {
                $("#TEmpleadosProrrateados").DataTable({
                    scrollY: "450px",
                    scrollX: true,
                    scrollCollapse: true,
                    columnDefs: [
                        {
                            width: "10%",
                            targets: 0
                        }, {
                            width: "35%",
                            targets: 2
                        },
                    ],
                    fixedColumns: true,
                    destroy: true,
                    responsive: true,
                    searching: true,
                    paging: false,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15,
                    dom: "Bfrtip",
                    buttons: [
                        "csv", "excel"
                    ],
                    order: [
                        [0, "asc"]
                    ],
                    language: {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: "Search",
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
            }, 1000);

            $("#TEmpleadosProrrateados_length").hide();
        })
    }

    $scope.ObtieneConcentrado = function(){
        $scope.getAnios();
    }

    $scope.GetReporteConcentrado = function(){
        let concentrado = []
        var datosGrupo = []
        $("#mdlLoading").modal("show");
        reporteNominaRepository.ReporteConcentrado($scope.selectedMes, $scope.selectedAnio.anio).then(resp=>{
            console.log(resp.data);
            concentrado = resp.data;

              datosGrupo = concentrado.reduce((r, { Tipo: name, ...object }) => {
                var temp = r.find(o => o.name === name);
                if (!temp) r.push(temp = { name, children: [] });
                temp.children.push(object);
                return r;
            }, []);

            for (let j = 0; j < datosGrupo.length; j++) {
        

                for (let k = 0; k < datosGrupo[j].children.length; k++) {
                    datosGrupo[j].children[k]= {...datosGrupo[j].children[k],Tipo:datosGrupo[j].name};
                    
                }
                
            }

            console.log(datosGrupo);

            for (let i = 0; i < datosGrupo.length; i++) {
                let result = datosGrupo[i].children.reduce((sums, obj) => Object.keys(obj).reduce((s, k) => {    
                    (k === 'Concepto' || k == 'name') || (s[k] = (s[k]|| 0) + +obj[k])
                    
                    return s;
                }, sums), {});
    
                console.log(result);
                result = {...result,Concepto:'Totales',Tipo:''}
                datosGrupo[i].children.push(result);
    
                console.log(datosGrupo);
                
            }



            $("#mdlLoading").modal("hide");
            agregarTabla(datosGrupo)
        })
    }

    function agregarTabla(arreglo){

        

        var len 
        var myTableDiv = document.getElementById("myDynamicTable");
        var tablas = document.getElementById('TConcentrado')
        var espacios = document.getElementById('TEspacios')

        myTableDiv.className ='divTabla';

        //si existe la tabla la borramos
        if (tablas !== null){
            var garbage //= myTableDiv.removeChild(tablas)
            garbage = myTableDiv.removeChild(espacios)
            $("#TConcentrado").DataTable().clear();
            $("#TConcentrado").DataTable().destroy();

            tablas.parentNode.removeChild(tablas)
        }
 
        var table = document.createElement('TABLE');



        // table = document.createElement('TABLE');

        table.border='1';
        table.id = "TConcentrado";
      

        var br = document.createElement('br');
        br.id='TEspacios';

        let titulos= []
        let titulo=''

        titulos = Object.keys(arreglo[0].children[0])
        

        titulos.splice(titulos.indexOf('Tipo'),1)
        titulos.splice(titulos.indexOf('Concepto'),0,'Tipo')


        // creamos el HEAD
        var thead = document.createElement('thead');

        //CREAMOS LA FILA PARA LAS COLUMNAS DE CABECERO Y LAS ACREGAMOS AL HEAD
        let trh = document.createElement('TR');
        thead.appendChild(trh)

        table.appendChild(thead);
        table.className='table table-bordered table-sm tabledisplay'

        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);

        for (let index = 0; index < titulos.length; index++) {
            
            if(titulos[index] !== 'name'){
                let th = document.createElement("th")
                th.className = 'headTable'
               // thead.appendChild(th).appendChild(document.createTextNode(titulos[index]));
                thead.rows[0].appendChild(th).appendChild(document.createTextNode(titulos[index]));
            }

        }

        for (let c = 0; c < arreglo.length; c++) {
            
            len = arreglo[c].children;
            for (var i=0; i<len.length; i++){

                // You set i here, presumably to get each row in your dataset
        
                let tr = document.createElement('TR');
                //tr.className = "rowEditData";
       
                tableBody.appendChild(tr);
                
    
                for (var j=0; j<titulos.length; j++){
    
                    if(titulos[j] !== 'name'){
    
                        titulo = titulos[j]
                        var data = arreglo[c].children[i][titulo];
                        
                        if(titulo !== 'Concepto' && titulo !=='Tipo'){

                            const options2 = { style: 'currency', currency: 'USD' };
                            const numberFormat2 = new Intl.NumberFormat('en-US', options2);
                           data =  numberFormat2.format(data)

                         //   td.className = "datosMontos";
                        //    tr.appendChild(td);
                       
                        }

                        if(data === null && titulo === 'Concepto'){
                            return
                        }

                        var td = document.createElement('TD');
                        td.className = "mdl-data-table__cell--non-numeric";
                

                        if(data ==='Totales'){
                            tr.className = "totales";
                            tableBody.appendChild(tr);
                        }
                       

                        td.appendChild(document.createTextNode(data));
                        tr.appendChild(td);
                    }
    
    
                }
            }
            
        }

        myTableDiv.appendChild(br);
        myTableDiv.appendChild(table);

        setTimeout(()=>{
          formatTable();
        },1000)
      
    
    }

    function formatTable(){
         
        

        setTimeout(() => {
            $("#TConcentrado").DataTable(  {      
                "order": [],
                dom: 'Bfrtip',
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdfHtml5'
                ]
        });
        }, 1000);

        $("#TTConcentrado_length").hide();

        $("#mdlLoading").modal("hide");
    }

});