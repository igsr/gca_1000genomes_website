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

    var searchExport = function(options) {
      var format = angular.isString(options.format) ? options.format : 'tsv';
      var filename = angular.isString(options.filename) ? options.filename : options.type;

      var url = p.baseUrl.concat('/', options.type, '/_search/', filename, '.', format);
      var form = document.createElement('form');
      form.action= url;
      form.method='POST';
      form.target="_self";
      var input = document.createElement("textarea");
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', 'json');
      input.value = JSON.stringify(options.body);
      form.appendChild(input);
      form.style.display = 'none';
      document.body.appendChild(form);
      form.submit();
    };

    return {
      getDoc: getDoc,
      search: search,
      searchExport: searchExport,
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
        var watcher = scope.$watch(iAttr.esId, esGet);
        iElement.on('$destroy', watcher);
      }
    }
  };
}]);

module.directive('esSearch', ['gcaElasticsearch', function(gcaElasticsearch) {
  return {
    scope: false,
    link: function(scope, iElement, iAttr) {
        
      var search = function(searchBody) {
        if (angular.isString(iAttr.esType) && angular.isObject(searchBody)) {
          gcaElasticsearch.search({type: iAttr.esType, body: searchBody}).then(
            function(resp) {
              if (angular.isString(iAttr.hitsAs)) {scope[iAttr.hitsAs] = resp.data.hits;}
              if (angular.isString(iAttr.aggsAs)) {scope[iAttr.aggsAs] = resp.data.aggs;}
            },
            function(reason) {if (angular.isString(iAttr.errorAs)) {scope[iAttr.errorAs] = reason;}}
          );
          
        }
        else {
          if (angular.isString(iAttr.hitsAs)) {scope[iAttr.hitsAs] = null};
          if (angular.isString(iAttr.aggsAs)) {scope[iAttr.aggsAs] = null};
          if (angular.isString(iAttr.errorAs)) {scope[iAttr.errorAs] = null};
        }
      }

      if (angular.isString(iAttr.searchBody)) {
        var watcher = scope.$watch(iAttr.searchBody, search);
        iElement.on('$destroy', watcher);
      }

    },
  }
}]);
