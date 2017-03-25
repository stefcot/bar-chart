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
     *
     * @private
     */
    var _start = function () {
        if(!_initialized){
            App.Utils.Promise.getPromise({
                url: App.API_URL,
                method:'GET',
                dataType: 'json'
            }).then(
                function(response){
                    // Storing data into the model
                    App.Model = response;
                    // Now that we have the whole story,
                    // we can initialize components
                    _initComponents();
                },
                function(errorObject){}
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