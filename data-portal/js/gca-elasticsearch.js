'use strict';

var module = angular.module('gcaElasticsearch', []);

module.provider('gcaElasticsearch', function() {
  var p = this;
  p.baseUrl = 'http://www.1000genomes.org/api';
  p.$get = ['$http', function($http) {
    var getDoc = function(options) {
      var url = p.baseUrl.concat('/', options.type, '/', options.id);
      return $http.get(url, {cache: true});
    };
    return {
      getDoc: getDoc,
    };

  }];
});

module.directive('gcaEsDoc', ['gcaElasticsearch', function(gcaElasticsearch) {
  return {
    scope: false,
    link: function(scope, iElement, iAttr) {
      var bindSourceAs = iAttr.gcaEsDoc || iAttr.bindSourceAs;
      var bindErrorAs = iAttr.bindErrorAs;
      var esType = iAttr.esType;

      var esGet = function(esId) {
        if (angular.isString(bindSourceAs)) {scope[bindSourceAs] = null};
        if (angular.isString(bindErrorAs)) {scope[bindErrorAs] = null};
        if (angular.isString(esId)) {
            gcaElasticsearch.getDoc({type: esType, id: esId}).then(
              function(resp) {if (angular.isString(bindSourceAs)) {scope[bindSourceAs] = resp.data._source;}},
              function(reason) {if (angular.isString(bindErrorAs)) {scope[bindErrorAs] = reason;}}
            );
        }
      };

      if (angular.isString(esType)) {
        scope.$watch(iAttr.esId, function(newId, oldId) {
          esGet(newId);
        });
      }
    }
  };
}]);
