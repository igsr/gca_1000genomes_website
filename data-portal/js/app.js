'use strict';

var dependencies = [
    'ngRoute',
    'ngSanitize',
    'ngResource',
];

var app = angular.module('igsrPortal', dependencies);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/beta/sample/:sample', {
        templateUrl: 'partials/sample-detail.html',
        controller: 'SampleCtrl',
        controllerAs: 'SampleCtrl',
    })
    .otherwise({
        redirectTo: '/beta/sample/NA12878',
    });
}]);

app.factory('API', ['$resource', function($resource) {
    return $resource('http://www.1000genomes.org/api/beta/:type/:ID', {}, {
        getObj: {
            method: 'GET',
            isArray: false,
        }
    });
}]);

app.controller('SampleCtrl', ['$routeParams', '$q', 'API', function($routeParams, $q, API) {
    var c = this;
    c.name = $routeParams.sample;
    c.data = API.getObj({type: 'sample', ID: $routeParams.sample})
        .$promise.then(function(resp) {c.data = resp._source}, function(reason) {c.error = reason});
}]);

