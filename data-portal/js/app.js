'use strict';

var dependencies = [
    'ngRoute',
    'ngSanitize',
    'gcaElasticsearch'
];

var app = angular.module('igsrPortal', dependencies);

app.config(['$locationProvider', '$routeProvider', 'gcaElasticsearchProvider',
            function($locationProvider, $routeProvider, gcaElasticsearchProvider) {
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

    gcaElasticsearchProvider.baseUrl = 'http://www.1000genomes.org/api/beta';

}]);

app.controller('SampleCtrl', ['$routeParams', 'gcaElasticsearch', function($routeParams, gcaElasticsearch) {
    var c = this;
    c.name = $routeParams.sample;
    c.data = null;
    c.error = null
    gcaElasticsearch.getDocSrc({type: 'sample', id: $routeParams.sample})
        .then(function(resp) {c.data = resp}, function(reason) {c.error = reason});
}]);

