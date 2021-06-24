// -- =============================================
// -- Author:      Gibran 
// -- Create date: 05/09/2016
// -- Description: Is the container of the application
// -- Modificó: 
// -- Fecha: 
// -- =============================================

var registrationModule = angular.module("registrationModule", ["ngRoute", "colorpicker.module", "LocalStorageModule", 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.moveColumns', 'angular.filter','ui.select','ngSanitize', 'ui.bootstrap', 'ui.bootstrap.modal'])

.config(function($routeProvider, $locationProvider) {

    /*cheange the routes*/
    $routeProvider.when('/', {
        templateUrl: 'AngularJS/Templates/login.html', //example 1
        controller: 'loginController'
    });
    $routeProvider.when('/polizaNomina', {
        templateUrl: 'AngularJS/Templates/polizaNomina.html', //FAL 19012017
        controller: 'polizaNominaController'
    });
    $routeProvider.when('/polizas', {
        templateUrl: 'AngularJS/Templates/polizas.html', 
        controller: 'polizasController'
    });
    $routeProvider.when('/prorrateoSucursal', {
        templateUrl: 'AngularJS/Templates/prorrateoSucursal.html', 
        controller: 'prorrateoSucursalController'
    });
   
    $routeProvider.when('/prorrateoOrden', {
        templateUrl: 'AngularJS/Templates/prorrateoOrden.html', 
        controller: 'prorrateoOrdenController'
    });

    $routeProvider.when('/esquemaProrrateo', {
        templateUrl: 'AngularJS/Templates/esquemaProrrateo.html', 
        controller: 'esquemaProrrateoController'
    });

    $routeProvider.when('/prorrateoFactura', {
        templateUrl: 'AngularJS/Templates/prorrateoFactura.html', 
        controller: 'prorrateoFacturaController'
    });

    $routeProvider.when('/plantillaProrrateo', {
        templateUrl: 'AngularJS/Templates/plantillaProrrateo.html', 
        controller: 'plantillaProrrateoController'
    });

    $routeProvider.when('/cargaUtilidad', {
        templateUrl: 'AngularJS/Templates/cargaUtilidad.html', 
        controller: 'cargaUtilidadController'
    });

    $routeProvider.when('/gastos', {
        templateUrl: 'AngularJS/Templates/gastosNoCentra.html', 
        controller: 'gastosNoCentraController'
    });

    $routeProvider.when('/porcentaje', {
        templateUrl: 'AngularJS/Templates/porcentajeSucursal.html', 
        controller: 'porcentajeSucursalController'
    });
    
    
    
    $routeProvider.otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

registrationModule.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() { element.css('height', (w.height() - 20) + 'px'); };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed             
        });
        changeHeight(); // when page loads          
    };
});
registrationModule.run(function($rootScope) {
    $rootScope.var = "full";

})
registrationModule.factory("utils", function($http) {
    return {
        b64toBlob: function(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {
                type: contentType
            });
            return blob;
        }
    }
});