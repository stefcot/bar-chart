'use strict';
/**
 * APP ENTRY POINT, SINGLETON PATTEN
 */
var App = (function () {
    /**
     * Prevent from conflict
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false;

    /**
     * Due to a mistyped response caused by the promise polyfill,
     * involving string response instead of an object,
     * This snippet of browser sniffing does the job quite nicely.
     *
     * @see http://stackoverflow.com/questions/29141337/is-it-possible-to-detect-all-versions-of-ie-with-javascript-how
     * @return {boolean}
     * @private
     */
    var _manageJsonResponse = function (response) {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');
        var edge = ua.indexOf('Edge/');

        if (msie > 0) {
            return JSON.parse(response)
        } else if (trident > 0) {
            return JSON.parse(response)
        } else if (edge > 0) {
            return JSON.parse(response)
        } else {
            return response
        }
    };

    /**
     * Initialize all importants app
     * modules
     *
     * @private
     */
    var _initComponents = function () {
        App.Components.BarChart.init();
        App.Components.Popin.init();
        App.Utils.Router.init();
        App.Utils.Navigation.init();
    };

    /**
     * Replaces the title
     * @private
     */
    var _render = function () {
        document.querySelector('h1').innerHTML = App.Model.settings.label;
    };

    /**
     *
     * @private
     */
    var _start = function () {
        if(!_initialized){
            App.Utils.Promise.getPromise({
                url: App.API_URL,
                method: 'GET',
                dataType: 'json'
            }).then(
                function(response){
                    // Storing data into the model
                    App.Model = _manageJsonResponse(response);
                    // Replaces the title
                    _render();
                    // Now that we have the whole story,
                    // we can initialize components
                    _initComponents();
                },
                function(errorObject){
                    console.log(errorObject);
                }
            );

            _initialized = true;
        }
    };

    /**
     * exposing methods
     */
    return {
        start: _start,
        API_URL: 'http://cdn.55labs.com/demo/api.json',
        API_LOCAL_URL: '/api.json',
        Model : {}
    }
})();

/**
 * LAUNCHING APPLICATION ON DOM READY
 */
document.addEventListener("DOMContentLoaded", function() {
    App.start();
});