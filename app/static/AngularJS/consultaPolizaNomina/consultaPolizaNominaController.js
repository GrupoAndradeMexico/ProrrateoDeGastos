registrationModule.controller("consultaPolizaNominaController", function ($scope, $rootScope, $location, localStorageService, alertFactory, $http, $log, $timeout, uiGridConstants, $sce, polizasRepository, polizaNominaRepository, gastosNoCentraRepository, consultaPolizaNominaRepository) {
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
    $scope.bloqueaBoton = false;
    $scope.mesActual;
    $scope.idRol = 0;

    $scope.init = function () {
        console.log($rootScope.currentEmployee)
        if ($rootScope.datosUsuario.length > 0) {
            $scope.idRol = $rootScope.datosUsuario[0].idRol;
        }
    }

    $scope.seguridad = function () {
        polizaNominaRepository.seguridad($scope.idUsuario).then(function (result) {
            if (result.data.length > 0) {
                console.log("ok");
                $scope.btnAplicarReferencias = false;
            } else {
                $scope.btnAplicarReferencias = true;
                console.log("no trajo nada seguridad");
            }
        }, function (error) {});
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

                $scope.ObtieneFechasPagas();
                $scope.ObtieneFechasPagasBitacora();
            }
        });
    };

    $scope.ObtieneFechasPagas = function () {
        if (isNaN($scope.selectedMes) === false && isNaN($scope.selectedAnio.anio) === false) {
            $scope.verDetalle = false;
            consultaPolizaNominaRepository.FechasPagas($scope.selectedMes, $scope.selectedAnio.anio).then((resp) => {
                if (resp.data.length > 0) {
                    $scope.lstQuincenas = resp.data;
                    // console.log($scope.lstQuincenas)
                    $("#tablePagas").DataTable().clear();
                    $("#tablePagas").DataTable().destroy();

                    // setTimeout(() => {
                    // $("#tablePagas").DataTable({
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
                    // });
                    // $("#tablePagas_length").hide();
                    // });
                }
            });
        }
    };

    $scope.LimpiaTabla = function () {
        var fechaActual = new Date();
        $scope.lstGastos = [];
        $scope.verDetalle = false;

        if ($scope.fechaPagaSelected.fechasPaga < fechaActual.toISOString().slice(0, 10).replace(/-/g, "")) {
            $scope.btnGeneraPoliza = false;
        } else {
            $scope.btnGeneraPoliza = false;
        }
    };

    $scope.GetAsientoContable = function () {
        $scope.totalDebe = 0;
        $scope.totalHaber = 0;
        $scope.lstGastos = [];
        console.log($scope.fechaPagaSelected);
        $scope.verDetalle = false;
        $("#mdlLoading").modal("show");
        consultaPolizaNominaRepository.ObtieneAsientoContablePaga($scope.empresa, $scope.fechaPagaSelected.fechasPaga, $scope.fechaPagaSelected.tipo, $scope.fechaPagaSelected.frecuencia).then((resp) => {
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
            width: "700px",
            text: "Esta por solicitar la generación de la póliza de la paga seleccionada, ¿Deseas continuar?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            showConfirmButton: true,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $("#mdlLoading").modal("show");

                consultaPolizaNominaRepository.GeneraPoiizaIndividual($scope.empresa, $scope.fechaPagaSelected.fechasPaga, $scope.fechaPagaSelected.tipo, $scope.fechaPagaSelected.frecuencia).then((resp) => {
                    if (resp.data[0][0].estatus === 1) {
                        $("#mdlLoading").modal("hide");
                        swal("Atencion", "Se han dejado los datos en BPRO para la generación de la póliza solicitada", "success");
                    } else {
                        $("#mdlLoading").modal("hide");

                        setTimeout(() => {
                            swal("Atención", resp.data[0][0].msg, "error");
                        }, 500);
                    }
                });
            } else {
                $("#mdlLoading").modal("hide");
                swal("Atencion", "Se cancelo la generación de la póliza", "info");
            }
        });
    };

    $scope.ConsultaBitacoraPolizas = function () { // $("#mdlLoading").modal("show");
        $scope.lstBitacora = [];
        consultaPolizaNominaRepository.ConsultaBitacoraPolizas($scope.selectedMes, $scope.selectedAnio.anio).then((resp) => {
            if (resp.data.length > 0) {
                $scope.lstBitacora = resp.data;

                $("#tableBitacora").DataTable().clear();
                $("#tableBitacora").DataTable().destroy();

                setTimeout(() => { // $scope.$watch('$viewContentLoaded', function(){

                    $("#tableBitacora tfoot th").each(function (i) {
                        var title = $("#tableBitacora thead th").eq($(this).index()).text();
                        $(this).html('<input type="text" placeholder="' + title + '" data-index="' + i + '" />');
                    });

                    // DataTable
                    var table = $("#tableBitacora").DataTable({
                        scrollY: "450px",
                        scrollX: true,
                        scrollCollapse: true,
                        columnDefs: [
                            {
                                width: "25%",
                                targets: 0
                            },
                            {
                                width: "30%",
                                targets: 1
                            },
                            {
                                width: "5%",
                                targets: 2
                            },
                            {
                                width: "5%",
                                targets: 3
                            }, {
                                width: "10%",
                                targets: 4
                            }, {
                                width: "5%",
                                targets: 5
                            }, {
                                width: "15%",
                                targets: 6
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

                    $(table.table().container()).on("keyup", "tfoot input", function () {
                        table.column($(this).data("index")).search(this.value).draw();
                    });

                    // $("#tableBitacora").DataTable({
                    // scrollY: "450px",
                    // scrollX: true,
                    // scrollCollapse: true,
                    // columnDefs: [{ "width": "25%", "targets": 0 },{ "width": "30%", "targets": 1 },{ "width": "5%", "targets": 2 },{ "width": "5%", "targets": 3 },{ "width": "10%", "targets": 4 },{ "width": "5%", "targets": 5 },{ "width": "15%", "targets": 6 }],
                    // fixedColumns: true,
                    // destroy: true,
                    // responsive: true,
                    // searching: true,
                    // paging: false,
                    // autoFill: false,
                    // fixedColumns: false,
                    // pageLength: 15,
                    // dom: "Bfrtip",
                    // buttons: ["csv", "excel"],
                    // order: [[0, "asc"]],
                    // language: {
                    //     search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    //     searchPlaceholder: "Search",
                    //     oPaginate: {
                    //       sNext:
                    //         '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                    //       sPrevious:
                    //         '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                    //     },
                    // },
                    // });

                    // })

                    $("#tableBitacora_length").hide();
                }, 1500);
            }
        });
    };

    $scope.GeneraOrdenesMasivas = function (fechaNomina, tipoNomina, frecuencia) {
        swal({
            title: "Aviso",
            type: "warning",
            width: "700px",
            text: "Esta por generar el calculo de la información para las pólizas de nomina , ¿Deseas continuar?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            showConfirmButton: true,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $("#mdlLoading").modal("show");

                // GENERAMOS EL CALCULO DE LAS SUCURSALES QUE NO SEAN CORPORATIVO
                consultaPolizaNominaRepository.GeneraOrdenesMasivas($scope.selectedMes, $scope.selectedAnio.anio, fechaNomina, tipoNomina).then((resp) => {
                    // GENERAMOS EL CALCULO DE CORPORATIVO
                    // SE ELIMINA LA EJECUCION DE ESTA SECCION YA QUE CORPORATIVO DE OBTENERSE YA EN AL SP PRINCIPAL
                    // consultaPolizaNominaRepository
                    // .GeneraOrdenesMasivasCorpo(
                    //     $scope.selectedMes,
                    //     $scope.selectedAnio.anio,
                    //     fechaNomina,
                    //     tipoNomina
                    // )
                    // .then((respCorpo) => {
                    //     //SOLICITAMOS CONFIRMACION DE GENERACION DE POLIZAS MASIVA
                    //     $("#mdlLoading").modal("hide");
                    // });
                    swal({
                        title: "Aviso",
                        type: "warning",
                        width: "700px",
                        text: "¿Deseas generar las pólizas de todas las sucursales?, ¿Deseas continuar?",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                        showCancelButton: true,
                        showConfirmButton: true,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            consultaPolizaNominaRepository.GeneraPolizaMasiva(fechaNomina, tipoNomina, frecuencia).then(respPol => {
                                swal('Aviso', 'Se ha deja la información en BPRO para su procesamiento')
                                $("#mdlLoading").modal("hide");
                            })
                        } else {
                            $("#mdlLoading").modal("hide");
                        }
                    });

                    $("#mdlLoading").modal("hide");

                });
            } else {
                $("#mdlLoading").modal("hide");
                swal("Atencion", "Se cancelo la petición de generación de las pólizas", "info");
            }
        });
    };

    $scope.ObtieneFechasPagasBitacora = function () {
        if (isNaN($scope.selectedMes) === false && isNaN($scope.selectedAnio.anio) === false) {
            $scope.bloqueaBoton = $scope.selectedMes === $scope.mesActual ? false : true;

            $scope.verDetalle = false;
            $scope.lstQuincenas = [];
            consultaPolizaNominaRepository.FechasPagasBitacora($scope.selectedMes, $scope.selectedAnio.anio).then((resp) => {
                if (resp.data.length > 0) {
                    $scope.lstQuincenas = resp.data;

                    $("#tablePagas").DataTable().clear();
                    $("#tablePagas").DataTable().destroy();

                    setTimeout(() => {
                        $("#tablePagas").DataTable({
                            scrollY: "450px",
                            scrollX: true,
                            scrollCollapse: true,
                            columnDefs: [
                                {
                                    width: 150,
                                    targets: 1
                                }
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
                            buttons: [],
                            order: [
                                [1, "asc"]
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
                        $("#tablePagas_length").hide();
                    }, 1500);

                    $scope.ConsultaBitacoraPolizas();
                }
            });
        }
    };

    $scope.ConsultaPoliza = function (idLugarTrabajo, cabecero, sucursal) {
        var datosPoliza = {};
        var sinProcesar = "Pendiente de procesar";
        var procesado = "Póliza generada";
        var estatus;

        consultaPolizaNominaRepository.ConsultaPoliza(idLugarTrabajo, cabecero).then((resp) => {
            datosPoliza = resp.data[0];

            estatus = datosPoliza.ConsPol === 0 ? sinProcesar : procesado;

            swal({
                title: `Póliza generada en BPRO`,
                type: "info",
                width: "700px",
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
                <td>${
                    datosPoliza.AñoPol
                }</td>
                <td>${
                    datosPoliza.MesPol
                }</td>
                <td>${
                    datosPoliza.ConsPol
                }</td>
                <td>${
                    datosPoliza.Documento
                }</td>
              </tr>
            </tbody>
          </table>
            `,
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                allowOutsideClick: false,
                showCloseButton: true
            });
        });
    };

    $scope.GeneraPolizaMasivas = function (fechaNomina, tipoNomina, frecuencia) {
        swal({
            title: "Aviso",
            type: "warning",
            width: "700px",
            text: "¿Deseas generar las polizas de todas las sucursale?, ¿Deseas continuar?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            showConfirmButton: true,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                swal("aviso", "entro en generacion de polizas", "warning");
                consultaPolizaNominaRepository.GeneraPolizaMasiva(fechaNomina, tipoNomina, frecuencia).then(respPol => {
                    swal('Aviso', 'Se ha deja la información en BPRO para su procesamiento')
                    $("#mdlLoading").modal("hide");
                })
            } else {
                $("#mdlLoading").modal("hide");
            }
        });
    }

});
