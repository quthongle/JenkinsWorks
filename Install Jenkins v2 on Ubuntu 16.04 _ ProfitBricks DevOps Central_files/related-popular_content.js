/**
 * This widget will retrieve tutorials from Elasticsearch and render them within
 * a <div> element based on the "id" attribute. Support is in place for related
 * and popular tutorials and communtiy questions.
 *
 * Usage:
 *
 * <div id="related_tutorials"></div>
 * <div id="popular_tutorials"></div>
 *
 * <div id="related_community"></div>
 * <div id="popular_community"></div>
 *
 * Options:
 *
 * Elasticsearch settings are inherited from the base.html. The additional
 * options below can be modified under "Global Variables".
 *
 * resultSize - [int] Number of results to return.
 * startListTemplate - [string] HTML template for start of list.
 * itemListTemplate - [string] HTML template for list item.
 * endListTemplate - [string] HTML template for end of list.
 */

(function() {
    // Global Variables
    var options = {
        'esproto': site_settings.ES_PROTO || 'http',
        'eshost': site_settings.ES_HOST || 'localhost',
        'esport': site_settings.ES_PORT || '80',
        'espath': site_settings.ES_PATH || '/',
        'resultSize': 5,
        'startListTemplate': '<ul>',
        'itemListTemplate': '<li><a href="URL" title="DESCRIPTION">TITLE</a></li>',
        'endListTemplate': '</ul>'
    };

    // Elasticsearch fields that will be returned and used in item list template.
    // If the fields are adjusted, then displayResults() will also need to be
    // updated.
    var esFields = ['url', 'description', 'title', 'views'];

    // ES query filter to exclude the currently loaded page from the search
    // results.
    var filter = {
        'not': {
            'term': { 'url': window.location.href }
        }
    };

    // Elasticsearch query for related tutorials.
    var relatedTutorialsQuery = {
        'query': {
            'bool': {
                'must': [
                    {
                        'multi_match': {
                            'query': fetchKeywords(),
                            'fields': ['title', 'description', 'keywords']
                        }
                    },
                    { 
                        'match' : { 'category': 'Tutorials' } 
                    }
                ]
            }
        },
        filter
    };

    // Elasticsearch query for popular tutorials.
    var popularTutorialsQuery = {
        'query': {
            'match': {
                'category': 'Tutorials' 
            }
        },
        'sort': {
            'views': { 'order': 'desc' }
        },
        filter
    };

    // Elasticsearch query for related community questions.
    var relatedCommunityQuery = {
        'query': {
            'bool': {
                'must': [
                    {
                        'multi_match': {
                            'query': fetchKeywords(),
                            'fields': ['title', 'description', 'keywords']
                        }
                    },
                    {
                        'match' : { 'category': 'Community' }
                    }
                ]
            }
        },
        filter
    };

    // Elasticsearch query for popular community questions.
    var popularCommunityQuery = {
        'query': {
            'match': {
                'category': 'Community'
            }
        },
        'sort': {
            'views': { 'order': 'desc' }
        },
        filter
    };

    // Retrieve and display related tutorials.
    showContent('related_tutorials', relatedTutorialsQuery);

    // Retrieve and display popular tutorials based on page views.
    showContent('popular_tutorials', popularTutorialsQuery);

    // Retrieve and display related community questions.
    showContent('related_community', relatedCommunityQuery);

    // Retrieve and display popular community questions based on page views.
    showContent('popular_community', popularCommunityQuery);

    // Primary method for retrieving and displaying results of Elasticsearch.
    function showContent(elementId, esQuery) {
        esEndpoint = constructEndpoint(esFields);
        $.ajax({
            url: esEndpoint,
            success: function(data) { displayResults(data, elementId); },
            error: displayError,
            cache: false,
            contentType: 'application/json',
            data: JSON.stringify(esQuery),
            dataType: 'json',
            type: 'POST'
        });
    }

    // Construct the Elasticsearch endpoint URL from the settings previously
    // specified.
    function constructEndpoint(fields) {
        var url = options['esproto'] + '://' +
            options['eshost'] +':' +
            options['esport'] +
            options['espath'] +
            '/community/web/_search'
        var urlParams = '?_source=' + fields.toString() + '&size=' + options['resultSize'];
        return url + urlParams;
    }

    // Render the Elasticsearch results within HTML template mapping.
    function displayResults(response, elementId) {
        var htmlBody = options['startListTemplate'];
        var hits = response.hits.hits;
        for (var i = 0; i < hits.length; i++) {
            var properties = {
                'url': hits[i]._source.url,
                'author': hits[i]._source.author,
                'views': hits[i]._source.views,
                'title': hits[i]._source.title.split(/\s+\|\s+/)[0],
                'description': hits[i]._source.description
            }
            htmlBody += templateMapping(properties);
        }
        htmlBody += options['endListTemplate']
        $('#'+elementId).html(htmlBody);
    }

    // Replace template variables with Elasticsearch properties.
    function templateMapping(properties) {
        mapping = {};

        // Generate dynamic template mapping from list of properties.
        for (var key in properties) {
            mapping[key.toUpperCase()] = properties[key]
        }

        // Replace template values based on mapping.
        var re = new RegExp(Object.keys(mapping).join("|"),"g");
        return options['itemListTemplate'].replace(re, function(matched) {
                return mapping[matched];
        });
    }

    // Render error message.
    function displayError(response) {
        $('#related_tutorials').html('Unable to retrieve related tutorials');
    }

    // Retrieve keywords from <meta name="keywords"> element for use in
    // Elasticsearch query.
    function fetchKeywords() {
        return $('meta[name=keywords]')[0].getAttribute('content');
    }
})();
