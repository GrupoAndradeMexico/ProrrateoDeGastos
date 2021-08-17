registrationModule.controller(
  "consultaPolizaNominaController",
  function (
    $scope,
    $rootScope,
    $location,
    localStorageService,
    alertFactory,
    $http,
    $log,
    $timeout,
    uiGridConstants,
    $sce,
    polizasRepository,
    polizaNominaRepository,
    gastosNoCentraRepository,
    consultaPolizaNominaRepository
  ) {

    $rootScope.userData = localStorageService.get("userData");
    $scope.idUsuario = $rootScope.userData.idUsuario;
    $scope.selectedAnio;
    $scope.selectedMes;
    $scope.fechaPagaSelected;
    $scope.lstGastos;
    $scope.verDetalle = false;
    $scope.empresa;
    $scope.btnGeneraPoliza = true;
    $scope.lstBitacora = [];

    $scope.seguridad = function () {
      polizaNominaRepository.seguridad($scope.idUsuario).then(
        function (result) {
          if (result.data.length > 0) {
            console.log("ok");
            $scope.btnAplicarReferencias = false;
          } else {
            $scope.btnAplicarReferencias = true;
            console.log("no trajo nada seguridad");
          }
        },
        function (error) {}
      );
    };

    setTimeout(function () {
      $(".cargando").remove();
      if ($scope.idUsuario != undefined) {
        consultaPolizaNominaRepository.LugaresTrabajo().then(function (result) {
          if (result.data.length > 0) {
            $scope.lstEmpresasPagadoras = result.data;
            $scope.getAnios();
          }
        });
      }
    }, 1500);

    $scope.getAnios = function () {
      let fechaActual = new Date();
      let anioActual = fechaActual.getFullYear();
      let mesActual = fechaActual.getMonth() + 1;

      polizaNominaRepository.getAnios().then(function (result) {
        if (result.data.length > 0) {
          $scope.lstAnios = result.data;
          //$scope.selectedAnio = result.data[result.data.length-1];
          $scope.lstMeses = [
            { id: 1, text: "Enero" },
            { id: 2, text: "Febrero" },
            { id: 3, text: "Marzo" },
            { id: 4, text: "Abril" },
            { id: 5, text: "Mayo" },
            { id: 6, text: "Junio" },
            { id: 7, text: "Julio" },
            { id: 8, text: "Agosto" },
            { id: 9, text: "Septiembre" },
            { id: 10, text: "Octubre" },
            { id: 11, text: "Noviembre" },
            { id: 12, text: "Diciembre" },
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
            if (el.id === mesActual) {
              $scope.selectedMes = el.id;
            }
          });

          $scope.ObtieneFechasPagas();
          $scope.ObtieneFechasPagasBitacora();

        }
      });



    };

    $scope.ObtieneFechasPagas = function () {
        if (
          isNaN($scope.selectedMes) === false &&
          isNaN($scope.selectedAnio.anio) === false
        ) {
          $scope.verDetalle = false;
          consultaPolizaNominaRepository
            .FechasPagas($scope.selectedMes, $scope.selectedAnio.anio)
            .then((resp) => {
              if (resp.data.length > 0) {
                $scope.lstQuincenas = resp.data;

                $("#tablePagas").DataTable().clear();
                $("#tablePagas").DataTable().destroy();
  
                // setTimeout(() => {
                //   $("#tablePagas").DataTable({
                //     scrollY: "450px",
                //     scrollX: true,
                //     scrollCollapse: true,
                //     columnDefs: [{ width: 150, targets: 1 }],
                //     fixedColumns: true,
                //     destroy: true,
                //     responsive: true,
                //     searching: true,
                //     paging: false,
                //     autoFill: false,
                //     fixedColumns: false,
                //     pageLength: 15,
                //     dom: "Bfrtip",
                //     buttons: ["csv", "excel"],
                //     order: [[0, "asc"]],
                //     language: {
                //       search: '<i class="fa fa-search" aria-hidden="true"></i>',
                //       searchPlaceholder: "Search",
                //       oPaginate: {
                //         sNext:
                //           '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                //         sPrevious:
                //           '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                //       },
                //     },
                //   });
                //   $("#tablePagas_length").hide();
                // });
              }
            });


        }
      };

      $scope.LimpiaTabla = function () {
        var fechaActual = new Date();
        $scope.lstGastos = [];
        $scope.verDetalle = false;

        if (
          $scope.fechaPagaSelected.fechasPaga <
          fechaActual.toISOString().slice(0, 10).replace(/-/g, "")
        ) {
          $scope.btnGeneraPoliza = false;
        } else {
          $scope.btnGeneraPoliza = false;
        }
      };

      $scope.GetAsientoContable = function () {
        $scope.totalDebe = 0;
        $scope.totalHaber = 0;
        $scope.lstGastos = [];
        console.log($scope.fechaPagaSelected)
        $scope.verDetalle = false;
        $("#mdlLoading").modal("show");
        consultaPolizaNominaRepository
          .ObtieneAsientoContablePaga(
            $scope.empresa,
            $scope.fechaPagaSelected.fechasPaga,
            $scope.fechaPagaSelected.tipo,
            $scope.fechaPagaSelected.frecuencia
          )
          .then((resp) => {
            if (resp.data.length > 2) {
              $scope.lstGastos = [];
              $scope.lstGastos = resp.data[1];

              $scope.lstGastos.forEach((el) => {
                $scope.totalDebe += el.debe;
                $scope.totalHaber += el.haber;
              });

              $scope.verDetalle = true;

              $("#tableGastos").DataTable().clear();
              $("#tableGastos").DataTable().destroy();

              setTimeout(() => {
                $("#tableGastos").DataTable({
                  scrollY: "450px",
                  scrollX: true,
                  scrollCollapse: true,
                  columnDefs: [{ width: 150, targets: 1 }],
                  fixedColumns: true,
                  destroy: true,
                  responsive: true,
                  searching: true,
                  paging: false,
                  autoFill: false,
                  fixedColumns: false,
                  pageLength: 15,
                  dom: "Bfrtip",
                  buttons: ["csv", "excel"],
                  order: [[0, "asc"]],
                  language: {
                    search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    searchPlaceholder: "Search",
                    oPaginate: {
                      sNext:
                        '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                      sPrevious:
                        '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                    },
                  },
                });
                $("#tableGastos_length").hide();
              });
              $("#mdlLoading").modal("hide");
            } else {
              $("#mdlLoading").modal("hide");
            }
          });
      };

      $scope.GeneraPolizaIndividual = function () {
        console.log("empresa ", $scope.empresa);
        console.log("año ", $scope.selectedAnio);
        console.log("mes ", $scope.selectedMes);
        console.log("Fecha selected ", $scope.fechaPagaSelected);

        swal({        
              title: "Aviso",
              type: "warning",
              width:'700px',
              text: "Esta por solicitar la generación de la póliza de la paga seleccionada, ¿Deseas continuar?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar",
              showCancelButton: true,
              showConfirmButton: true,
              allowOutsideClick:false
        }).then((result) => {
          if (result.value) {
            $("#mdlLoading").modal("show");

          consultaPolizaNominaRepository
            .GeneraPoiizaIndividual(
              $scope.empresa,
              $scope.fechaPagaSelected.fechasPaga,
              $scope.fechaPagaSelected.tipo,
              $scope.fechaPagaSelected.frecuencia
            )
            .then((resp) => {
              if (resp.data[0][0].estatus === 1) {
                $("#mdlLoading").modal("hide");
                swal(
                  "Atencion",
                  "Se han dejado los datos en BPRO para la generación de la póliza solicitada",
                  "success"
                );
              }else{
                $("#mdlLoading").modal("hide");

                setTimeout(()=>{swal('Atención',resp.data[0][0].msg, 'error')},500)
                  
              }
            });
        } else {
            $("#mdlLoading").modal("hide");
          swal("Atencion", "Se cancelo la generación de la póliza", "info");

        }
        });
      };

      $scope.ConsultaBitacoraPolizas = function(){

       // $("#mdlLoading").modal("show");
       $scope.lstBitacora = [];
        consultaPolizaNominaRepository.ConsultaBitacoraPolizas($scope.selectedMes,$scope.selectedAnio.anio).then(resp =>{
            if(resp.data.length > 0){
 
              $scope.lstBitacora = resp.data;


              $("#tableBitacora").DataTable().clear();
              $("#tableBitacora").DataTable().destroy();

              setTimeout(() => {
                $("#tableBitacora").DataTable({
                  scrollY: "450px",
                  scrollX: true,
                  scrollCollapse: true,
                  columnDefs: [{ width: 150, targets: 1 }],
                  fixedColumns: true,
                  destroy: true,
                  responsive: true,
                  searching: true,
                  paging: false,
                  autoFill: false,
                  fixedColumns: false,
                  pageLength: 15,
                  dom: "Bfrtip",
                  buttons: ["csv", "excel"],
                  order: [[0, "asc"]],
                  language: {
                    search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    searchPlaceholder: "Search",
                    oPaginate: {
                      sNext:
                        '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                      sPrevious:
                        '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                    },
                  },
                });
                $("#tableBitacora_length").hide();
              },1500);


            }
        });
      }

      $scope.GeneraOrdenesMasivas = function(fechaNomina, tipoNomina){
        $("#mdlLoading").modal("show")
        consultaPolizaNominaRepository.GeneraOrdenesMasivas($scope.selectedMes,$scope.selectedAnio.anio, fechaNomina, tipoNomina).then(resp =>{
            $("#mdlLoading").modal("hide");
        });
      }

      $scope.ObtieneFechasPagasBitacora = function () {
        if (
          isNaN($scope.selectedMes) === false &&
          isNaN($scope.selectedAnio.anio) === false
        ) {
          $scope.verDetalle = false;
          $scope.lstQuincenas = [];
          consultaPolizaNominaRepository
            .FechasPagasBitacora($scope.selectedMes, $scope.selectedAnio.anio)
            .then((resp) => {
              if (resp.data.length > 0) {
                $scope.lstQuincenas = resp.data;

                $("#tablePagas").DataTable().clear();
                $("#tablePagas").DataTable().destroy();
  
                setTimeout(() => {
                  $("#tablePagas").DataTable({
                    scrollY: "450px",
                    scrollX: true,
                    scrollCollapse: true,
                    columnDefs: [{ width: 150, targets: 1 }],
                    fixedColumns: true,
                    destroy: true,
                    responsive: true,
                    searching: true,
                    paging: false,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15,
                    dom: "Bfrtip",
                    buttons: [],
                    order: [[0, "asc"]],
                    language: {
                      search: '<i class="fa fa-search" aria-hidden="true"></i>',
                      searchPlaceholder: "Search",
                      oPaginate: {
                        sNext:
                          '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        sPrevious:
                          '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                      },
                    },
                  });
                  $("#tablePagas_length").hide();
                },1500);

                $scope.ConsultaBitacoraPolizas();
              }
            });


        }
      };


      $scope.ConsultaPoliza = function (idLugarTrabajo, cabecero ,sucursal){

        var datosPoliza = {};
        var sinProcesar = 'Pendiente de procesar';
        var procesado='Póliza generada';
        var estatus;

        consultaPolizaNominaRepository.ConsultaPoliza(idLugarTrabajo,cabecero).then(resp=>{

          datosPoliza = resp.data[0];

          estatus = datosPoliza.ConsPol === 0?sinProcesar:procesado;

          swal({
            title: `Póliza generada en BPRO`,
            type: 'info',
            width:'700px',
            html: `<strong> Sucursal:</strong> ${sucursal} <br> <strong>estado de la póliza: </strong>${estatus} <br>
            <table
            id="tablePoliza"
            class="table table-bordered"
            cellspacing="0"
            width="100%"
          >
            <thead>
              <tr>
                <th>Año Póliza</th>
                <th>Mes Póliza</th>
                <th>Consecutivo</th>
                <th>Documento</th>
              </tr>
            </thead>
            <tbody>
              <tr">
                <td>${datosPoliza.AñoPol}</td>
                <td>${datosPoliza.MesPol}</td>
                <td>${datosPoliza.ConsPol}</td>
                <td>${datosPoliza.Documento}</td>
              </tr>
            </tbody>
          </table>
            `,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            showCloseButton: true,
          });

        });
      } 

  }
);
