'use strict';
var App = App || {};
App.Utils = App.Utils || {};

/**
 * Manage navigation actions
 * Singleton patern,
 * Actions and events can be easily created.
 */
App.Utils.Navigation = (function(d){
    /**
     * Prevent from conflict
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false;

    /**
     *
     * @type {CustomEvent}
     * @private
     */
    var _openPopinEvent;

    /**
     *
     * @param event {CustomEvent}
     * @private
     */
    var _goToDetails = function (event) {
        // creating event on the fly to send dynamic parameters
        _openPopinEvent = new CustomEvent('open.popin', { 'detail': {state: event.detail.state}});
        // triggering event to open detailed popin
        d.dispatchEvent(_openPopinEvent);
    };

    /**
     *
     * @param event {CustomEvent}
     * @private
     */
    var _goToHome = function (event) {
        // creating event on the fly to send dynamic parameters
        _openPopinEvent = new CustomEvent('close.popin');
        // triggering event to open detailed popin
        d.dispatchEvent(_openPopinEvent);
    };

    /**
     *
     * @private
     */
    var _initEvents = function () {
        d.addEventListener('navigation.home', _goToHome);
        d.addEventListener('navigation.details', _goToDetails);
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
