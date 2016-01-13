'use strict';

var dependencies = [
    'ngRoute',
    'ngSanitize',
];

var app = angular.module('searchResults', dependencies);

app.controller('SearchCtrl', ['$location', '$http', '$scope', function($location, $http, $scope) {
    var controller = this
    controller.siteHits = [];

    var searchEl = document.getElementById('search_id');

    var siteSearch = function(q) {
        var postBody = {
            _source: ['url', 'title'],
            query: {
                match_phrase: {
                    content: q
                }
            },
            highlight: {
                fields: {
                    content: {}
                },
                pre_tags: ['<em><strong>'], post_tags: ['</strong></em>']
            }
        }
        $http.post('/lines/api/sitemap/_search', postBody).then(
            function(response) {
                controller.siteHits = response.data.hits;
            }
        );
    }

    var search = function() {
        controller.searchPhrase = $location.search().q;
        searchEl.value = controller.searchPhrase || '';
        if (controller.searchPhrase) {
            siteSearch(controller.searchPhrase)
        }
        else {
            controller.siteHits = [];
        }
    };

    $scope.$on('$locationChangeStart', search);
    search();
}]);

