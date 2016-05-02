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

module.directive('esDoc', function(gcaElasticsearch) {
  return {
    scope: {},
    bindToController: {
        bindSourceAs: '@esDoc',
        bindErrorAs: '@errorAs',
        esType: '@',
        esId: '=',
        onSuccess: '&onSuccess'
    },
    controllerAs: 'esDocCtrl',
    transclude: true,
    controller: ['gcaElasticsearch', function(gcaElasticsearch) {
        var c = this;
        c.destroy = function() {
            c.watcher();
            c.transcludedScope.$destroy();
        };
        c.esGet = function(esId) {
          if (angular.isString(c.bindSourceAs)) {c.transcludedScope[c.bindSourceAs] = null};
          if (angular.isString(c.bindErrorAs)) {c.transcludedScope[c.bindErrorAs] = null};
          if (angular.isString(esId) && angular.isString(c.esType)) {
              gcaElasticsearch.getDoc({type: c.esType, id: esId}).then(
                function(resp) {
                    if (angular.isString(c.bindSourceAs)) {c.transcludedScope[c.bindSourceAs] = resp.data._source;}
                    c.onSuccess();
                },
                function(reason) {if (angular.isString(c.bindErrorAs)) {c.transcludedScope[c.bindErrorAs] = reason;}}
              );
          }
        };
    }],
    link: function(scope, iElement, iAttr, controller, $transclude) {
      $transclude(function(clone, transcludedScope) {
          iElement.append(clone);
          controller.transcludedScope = transcludedScope;
      });
      controller.watcher = scope.$watch('esDocCtrl.esId', controller.esGet);
      iElement.on('$destroy', controller.destroy);
    }
  };
});

module.directive('esSearch', ['gcaElasticsearch', function(gcaElasticsearch) {
  return {
    scope: true,
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

      if (angular.isString(iAttr.esSearch)) {
        var watcher = scope.$watch(iAttr.esSearch, search);
        iElement.on('$destroy', watcher);
      }

    },
  }
}]);
