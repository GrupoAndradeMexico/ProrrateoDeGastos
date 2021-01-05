var prorrateoFacturaURL = global_settings.urlCORS + 'api/prorrateoFactura/';

registrationModule.factory('prorrateoFacturaRepository', function($http) {
    return {
        
        getFacturas: function() {
            return $http({
                url: prorrateoFacturaURL + 'facturas/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
