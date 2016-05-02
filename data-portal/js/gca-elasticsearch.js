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

module.directive('esDoc', function() {
  return {
    scope: {},
    bindToController: {
        source: '=esDoc',
        error: '=errorAs',
        esType: '@',
        esId: '=',
    },
    controllerAs: 'esDocCtrl',
    controller: ['gcaElasticsearch', function(gcaElasticsearch) {
        var c = this;
        c.esGet = function(esId) {
          c.source = null;
          c.error = null;
          if (angular.isString(esId) && angular.isString(c.esType)) {
              gcaElasticsearch.getDoc({type: c.esType, id: esId}).then(
                function(resp) {
                    c.source = resp.data._source;
                },
                function(reason) {c.error = reason;}
              );
          }
        };
    }],
    link: function(scope, iElement, iAttr, controller, $transclude) {
      var watcher = scope.$watch('esDocCtrl.esId', controller.esGet);
      iElement.on('$destroy', watcher);
    }
  };
});

module.directive('esSearch', function() {
  return {
    scope: {},
    bindToController: {
        searchBody: '=esSearch',
        error: '=errorAs',
        hits: '=hitsAs',
        aggs: '=aggsAs',
        esType: '@',
    },
    controllerAs: 'esSearchCtrl',
    controller: ['gcaElasticsearch', function(gcaElasticsearch) {
      var c = this;
      c.search = function() {
        if (!angular.isString(c.esType) || !angular.isObject(c.searchBody)) {
          c.hits = null;
          c.aggs = null;
          c.error = null;
          return;
        }
        gcaElasticsearch.search({type: c.esType, body: c.searchBody}).then(
          function(resp) {
            c.hits = resp.data.hits;
            c.aggs = resp.data.aggs;
            c.error = null;
          },
          function(reason) {
            c.hits = null;
            c.aggs = null;
            c.error = reason;
          }
        );
      }

    }],
    link: function(scope, iElement, iAttr, controller, $transclude) {
      var watcher = scope.$watch('esSearchCtrl.searchBody', controller.search);
      iElement.on('$destroy', watcher);
    },
  }
});
