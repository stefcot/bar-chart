'use strict';
var App = App || {};
App.Utils = App.Utils || {};

/**
 * Handles history and routing issues.
 * Simple use of HTML5 History API in HTML5 mode
 */
App.Utils.Router = (function(d){
    /**
     * Prevent from conflict
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false,

    /**
     * @type {CustomEvent}
     * @private
     */
    _navEvent;

    /**
     *
     * @param event {CustomEvent}
     * @private
     */
    var _onPushState = function(event) {
        // Pushing state into history stack
        history.pushState( event.detail.state, event.detail.name, event.detail.route);
        // Routing
        _route( event.detail.route, event.detail.state);
    };

    /**
     *
     * @param event {CustomEvent}
     * @private
     */
    var _onPageNotFound = function() {
        // Changing location path name
        d.location.pathname = '/';
        // Replacing state in history stack
        history.replaceState( {}, 'home', '/');
        // Then routing
        _route( '/', {});
    };

    /**
     *
     * @param event {CustomEvent}
     * @private
     */
    var _onPopState = function(event) {
        var state = event.state,
            route = d.location.pathname;
        // Routing
        _route( route, state);
    };

    /**
     * Called when state object is empty,
     * user is supposed to have typed the path in the location bar
     * and go directly to the screen/state to be discribed from data
     *
     * @private
     */
    var _buildStateObject = function() {
        var route = d.location.pathname,
            stateObject = {};

        // If typed URL is detail URL, and no state object exists,
        // then extracting proper data from previous created
        // data object by BarChart component on init.
        if(/^\/details/.test(route)) {
            var r = route.split('/'),
                name = r[r.length-2],
                data = (function(arr){
                    var r = route.split('/'),
                        d = r[r.length-1],
                        data = arr.filter(function(item){
                            return item.date === d;
                        });
                    return data[0] || data.push({});
                })(App.Model.transformedData),
                sc = (function(d){
                    var scores = [];
                    if (d){
                        scores = d.filter(function(item){
                            return item.name === name;
                        });
                    }
                    return scores[0] || scores.push({});
                })(data.scores);

            stateObject = {
                index: data.index,
                date: data.date,
                name: name,
                score: sc.score
            };
        }

        // Then some other cases for additional route can be developed here ....

        return stateObject;
    };

    /**
     *
     * @param route
     * @param state
     * @private
     */
    var _route = function (route, state) {
        var state = state;

        if(state === null){
            // when typing the URL in the location bar
            state = _buildStateObject();
        }

        // Evaluating URL route value for routing
        switch(true) {
            case /^\/$/.test(route):
                // Creating event
                _navEvent = new CustomEvent('navigation.home', { detail: {state: state}});
                // Notifying navigation to perform actions to go to home screen
                d.dispatchEvent(_navEvent);
                break;
            case /^\/details/.test(route):
                // If anything goes wrong, then redirecting to home screen
                if(!state.name || !state.date || state.index === null || state.index === undefined || !state.score){
                    _onPageNotFound();
                }
                // Creating event
                _navEvent = new CustomEvent('navigation.details', { detail: {state: state}});
                // Notifying navigation to perform actions to go to details screen
                d.dispatchEvent(_navEvent);
                break;
            case /^\/nuts$/.test('nuts'):
                console.log('Router::route - GOING NUTS - FORTEST');
                break;
            default:
                // If the address doesn't exists, redirecting to home screen
                _onPageNotFound();
        }
    };

    /**
     * Get and parse url on window refresh for necessary redirection
     * This will 'break' server side redirection.
     *
     * See the gulp config, applying server middleware to prevent GET error
     *
     * @type  event {CustomEvent}
     *
     * @private
     */
    var _onRefresh = function (event) {
        var state = history.state,
            route = d.location.pathname;

         _route( route, state);
    };

    /**
     *
     * @private
     */
    var _initEvents = function () {
        window.onpopstate = _onPopState;

        d.addEventListener('router.refresh', _onRefresh);
        d.addEventListener('router.pushstate', _onPushState);
        d.addEventListener('router.notfound', _onPageNotFound);
    };

    /**
     *
     * @private
     */
    var _init = function () {
        if(!_initialized){
            _initEvents();
            _initialized = true;
        }
    };

    /**
     * exposing methods
     */
    return {
        init: _init
    }
})(document);