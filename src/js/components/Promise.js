'use strict';
var App = App || {};
App.Utils = App.Utils || {};
/**
 * XhrRequest, Xhr Utils
 * Returns a promise instance wrapping a XHR invoked on DOM ContentLoaded
 *
 */
App.Utils.Promise = (function(){
    /**
     * @type {XMLHttpRequest}
     * @private
     */
    var _xhr;

    /**
     *
     * @type {{0: string}}
     * @private (static)
     */
    var _readyStateMap = {
        0: 'UNSENT',
        1: 'OPENED',
        2: 'HEADERS_RECEIVED',
        3: 'LOADING',
        4: 'DONE'
    };

    /**
     *
     * @type {{0: string}}
     * @private
     */
    var _getReadyState = function (value) {
        return _readyStateMap[value];
    };

    /**
    *
    * @constructor
    */
    var _promise = function (settings) {

        return new Promise(function(resolve, reject) {

            _xhr = new XMLHttpRequest();
            _xhr.open(settings.method, settings.url);
            _xhr.responseType = settings.dataType;

            _xhr.onload = function() {
                if (_xhr.status === 200) {
                    resolve(_xhr.response);
                } else {
                    reject({xhr: _xhr, statusText: _xhr.statusText, responseText: 'XhrRequest::onload - Error : ' + _xhr.responseText});
                }
            };

            _xhr.onprogress = function () {
                console.log('Loading file, ', _xhr.readyState);
            };

            _xhr.onreadystatechange = function () {
                if(_xhr.readyState === XMLHttpRequest.DONE && _xhr.status === 200) {
                    console.log('XhrRequest - Ready state changed, status: ' + _getReadyState(_xhr.readyState));
                }
            };

            _xhr.onerror = function() {
                reject({xhr: _xhr, statusText: _xhr.statusText, responseText: 'XhrRequest::onerror - Error : ' + _xhr.responseText});
            };

            _xhr.send(null);
        });
    };

     /**
      *
      */
    return {
        getPromise: _promise
    };
})();