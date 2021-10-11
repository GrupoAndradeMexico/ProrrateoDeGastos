registrationModule.controller("accesoController", function ($scope, $rootScope, $location, loginRepository, alertFactory, localStorageService, accesoRepository) {
    $rootScope.datosUsuario = "";
    $rootScope.menuTimbrado = false;
    $rootScope.menuBusqueda = false;
    $rootScope.menuCancela = false;
    $rootScope.menuDesbloqueo = false;
    $rootScope.menuTimbradoMasivo = false;
    $scope.init = function () {
        $rootScope.mostrarMenu = 0;

        setTimeout(function () {
            $(".cargando").remove();
        }, 500);
        // closeNav();
    };
    $scope.permisos = function (usuario, contrasena) {
        accesoRepository.getPermisos(usuario, contrasena).then(function (result) {
            if (result.data.length > 0) {
                if (result.data[0].estatus == 1) {
                    $rootScope.datosUsuario = result.data[0];
                    console.log("Datos Usuario: ");
                    console.log($rootScope.datosUsuario.idUsuario);

                    // $scope.getEmpleado($rootScope.datosUsuario.idUsuario);

                    loginRepository.getEmpleado($rootScope.datosUsuario.idUsuario).then(function (empleado) {
                        if (empleado.data.length > 0) {
                            $scope.empleadoDatos = empleado.data;
                            localStorageService.set("empleadoDatos", $scope.empleadoDatos);

                            if (result.data.length > 0) {
                                $scope.login = result.data[0];
                                // $scope.getEmpleado(usuario);
                                if ($scope.login == undefined) {
                                    alertFactory.error("No tienes acceso a esta aplicacion");
                                    setTimeout(function () {
                                        $(".cargando").remove();
                                    }, 500);
                                } else {
                                    if ($scope.login.idPerfil == 4) {
                                        $rootScope.polizaNominaAcceso = 1;
                                        $rootScope.conciliacionAccesso = 0;
                                        alertFactory.warning("Bienvenido a Carga Utilidades: " + result.data[0].nombreUsuario);
                                        location.href = $scope.login.pathUrl;
                                        localStorageService.set("userData", $scope.login);
                                    } else {
                                        if ($scope.login.idPerfil == 2) {
                                            $rootScope.polizaNominaAcceso = 1;
                                            $rootScope.conciliacionAccesso = 1;
                                            alertFactory.warning("Bienvenido a Prorrateo Sucursal: " + result.data[0].nombreUsuario);
                                            location.href = $scope.login.pathUrl;
                                            localStorageService.set("userData", $scope.login);
                                        } else {
                                            $rootScope.polizaNominaAcceso = 0;
                                            $rootScope.conciliacionAccesso = 1;
                                            alertFactory.warning("Bienvenido a Tesorería: " + result.data[0].nombreUsuario);
                                            location.href = $scope.empleadoDatos[0].pathUrl;
                                            localStorageService.set("userData", $scope.login);
                                        }
                                    }
                                }
                            } else {
                                alertFactory.error("El usuario y/o contraseña son incorrecta(s)");
                            }
                        } else {}
                    });
                } else {
                   // swal('Error', result.data[0].estatus, 'danger');
                    alertFactory.error("El usuario y/o contraseña son incorrecta(s)");
                }
            }

            // $location.url('/busqueda' + $scope.datosUsuario[0].idPerfil);
            // console.log(result)
            // location.href = '/busqueda'
        });
    };

    $scope.getEmpleado = function (usuario) {
        loginRepository.getEmpleado(usuario).then(function (empleado) {
            if (empleado.data.length > 0) {
                $scope.empleadoDatos = empleado.data;
                localStorageService.set("empleadoDatos", $scope.empleadoDatos);
            } else {}
        });
    };
});
