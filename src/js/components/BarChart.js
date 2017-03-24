'use strict';
var App = App || {};
App.Components = App.Components || {};
/**
 * BAR CHART COMPONENT, SINGLETON PATTERN
 */
App.Components.BarChart = (function(){
    /**
     * Prevent from conflict
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false;

    /**
     *
     * @type {Array}
     * @private
     */
    var _transformedData = [],

    /**
     *
     * @type {Array}
     * @private
     */
    _bars =  [];

    /**
     *
     * @private
     */
    var _transformData = function(){
        var daily            = App.Model.data.DAILY,
            dates            = daily.dates,
            players          = daily.dataByMember.players,
            playersToArray   = [];

        // one grade flattening, a little crapy but enough
        for(var name in players) {
            players[name] = players[name].points;
        }

        // Transforming the object into an Array by reducing its key list
        playersToArray = Object.keys(players).reduce(function (previous, key) {
            var obj  = {};
            obj[key] = players[key];

            previous.push(obj);

            return previous;
        }, []);

        // Then filtering this array with the proper index each time,
        // pushing an object with adapted schema for each bar component.
        for ( var i = 0; i < dates.length; i++ ) {
            _transformedData.push({
                index: i,
                date: dates[i],
                scores: (function(){
                    var reducedData  = [];
                    var tempKeys     = [];

                    for ( var j = 0; j < playersToArray.length; j++ ) {
                        var tempObj      = {};
                        tempKeys         = Object.keys(playersToArray[j]);
                        tempObj['name']  = tempKeys[0];
                        tempObj['score'] = playersToArray[j][tempKeys[0]][i];
                        reducedData.push(tempObj);
                    }

                    return reducedData;
                })()
            });
        }

        // finally storing the transformed data into the model
        App.Model.transformedData = _transformedData;

        // Pre-caching the template before bars instantiation
        App.Utils.Templates.getTemplate('Bars', {}, 'templates').then(
            function(data){
                _render(data);
            }
        );
    };

    /**
     * Renders each bar sets based on the previously
     * transformed data above
     *
     * @private
     */
    var _render = function(tmpl_src){
        console.log('BarChart::render - tmpl_src : ', tmpl_src);
        // Rendering each set of bars
        for ( var i = 0; i < _transformedData.length; i++ ) {
            console.log('BarChart::render - _transformedData['+i+'] : ', _transformedData[i]);
            // Caching created bars instances for further use
            _bars.push(new App.Components.Bars(_transformedData[i]));
        }
    };

    /**
     *
     * @private
     */
    var _init = function(){
        if(!_initialized){
            _transformData();
            _initialized = true;
        }
    };

    /**
     * exposing methods
     */
    return {
        init: _init
    };
})();