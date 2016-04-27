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

    var search = function(options) {
      var url = p.baseUrl.concat('/', options.type, '/_search');
      return $http.post(url, options.body);
    };

    return {
      getDoc: getDoc,
      search: search,
    };

  }];
});

module.directive('esDoc', ['gcaElasticsearch', function(gcaElasticsearch) {
  return {
    scope: false,
    link: function(scope, iElement, iAttr) {
      var bindSourceAs = iAttr.esDoc || iAttr.sourceAs;
      var bindErrorAs = iAttr.errorAs;
      var esType = iAttr.esType;

      var esGet = function(esId) {
        if (angular.isString(bindSourceAs)) {scope[bindSourceAs] = null};
        if (angular.isString(bindErrorAs)) {scope[bindErrorAs] = null};
        if (angular.isString(esId)) {
            gcaElasticsearch.getDoc({type: esType, id: esId}).then(
              function(resp) {
                  if (angular.isString(bindSourceAs)) {scope[bindSourceAs] = resp.data._source;}
                  scope.$eval(iAttr.onSuccess);
              },
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

module.directive('esSearch', ['gcaElasticsearch', function(gcaElasticsearch) {
  return {
    scope: {
        searchBody: '=',
        hitsAs: '@',
        aggsAs: '@',
        errorAs: '@',
        esType: '@',
    },
    link: function(scope, iElement, iAttr) {
        
      var search = function() {
        if (angular.isString(scope.esType) && angular.isObject(scope.searchBody)) {
          gcaElasticsearch.search({type: scope.esType, body: scope.searchBody}).then(
            function(resp) {
              if (angular.isString(scope.hitsAs)) {scope.$parent[scope.hitsAs] = resp.data.hits;}
              if (angular.isString(scope.aggsAs)) {scope.$parent[scope.aggsAs] = resp.data.aggs;}
            },
            function(reason) {if (angular.isString(scope.errorAs)) {scope.$parent[scope.errorAs] = reason;}}
          );
          
        }
        else {
          if (angular.isString(scope.hitsAs)) {scope.$parent[scope.hitsAs] = null};
          if (angular.isString(scope.aggsAs)) {scope.$parent[scope.aggsAs] = null};
          if (angular.isString(scope.errorAs)) {scope.$parent[scope.errorAs] = null};
        }
      }

      scope.$watch('searchBody', search);

    },
  }
}]);
