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

module.directive('esSearch', [function() {
  return {
    controller: ['gcaElasticsearch', '$scope', function(gcaElasticsearch, $scope) {
      var c = this;
      c.search = function(searchBody) {
        if (angular.isString(c._config.bindHitsAs)) {$scope[c._config.bindHitsAs] = null};
        if (angular.isString(c._config.bindAggsAs)) {$scope[c._config.bindAggsAs] = null};
        if (angular.isString(c._config.bindErrorAs)) {$scope[c._config.bindErrorAs] = null};
        if (angular.isString(c._config.type) && angular.isObject(searchBody)) {
          gcaElasticsearch.search({type: c._config.type, body: searchBody}).then(
            function(resp) {
                if (angular.isString(c._config.bindHitsAs)) {$scope[c._config.bindHitsAs] = resp.data.hits;}
                if (angular.isString(c._config.bindAggsAs)) {$scope[c._config.bindAggsAs] = resp.data.aggs;}
            },
            function(reason) {if (angular.isString(c._config.bindErrorAs)) {$scope[c._config.bindErrorAs] = reason;}}
          );
          
        }
      }
    }],
    link: function(scope, iElement, iAttr, ctrl) {
      ctrl._config = {};
      ctrl._config.bindHitsAs = iAttr.hitsAs;
      ctrl._config.bindAggsAs = iAttr.aggsAs;
      ctrl._config.bindErrorAs = iAttr.errorAs;
      ctrl._config.type = iAttr.esType;

      var bindCtrlAs = iAttr.esSearch || iAttr.name;
      if (angular.isString(bindCtrlAs)) {
          scope[bindCtrlAs] = ctrl;
      }

      if (angular.isString(iAttr.onInit)) {
          scope.$eval(iAttr.onInit);
      }

    },
  }
}]);
