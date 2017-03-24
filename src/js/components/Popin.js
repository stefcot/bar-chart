'use strict';
var App = App || {};
App.Components = App.Components || {};
/**
 * POPIN COMPONENT, SINGLETON PATTERN
 */
App.Components.Popin = (function(){
    /**
     * Raw template for building a score row
     * @type {string}
     *
     * @private
     */
    var _scoreTemplate = '<div class="popin__content__row popin__content__row--{{number}}">' +
                         '    <div class="popin__content__label">{{date}}</div>' +
                         '    <div class="popin__content__value">{{score}} pts</div>' +
                         '</div>';

    /**
     * Cache original raw template
     * @type {string}
     *
     * @private (static)
     */
    var _template = '';

    /**
     * Cache original raw template
     * @type {string}
     *
     * @private
     */
    var _data = '';

    /**
     * Prevent from conflict
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false;

    /**
     * Attach an event to a given DOM Element
     *
     * @private
     */
    var _initEvents = function () {
        document.addEventListener('open.popin', _getTemplate);
    };

    /**
     * Load the Popin.html
     * @private
     */
    var _getTemplate = function(ev){
        _data = ev.detail.data;
        // Loading Template
        App.Utils.Templates.getTemplate('Popin', {}, 'templates').then(
            function(data){
                _render(data);
            }
        );
    };

    /**
     *
     * @param value
     * @returns {boolean}
     * @private
     */
    var _filterData = function(value){
        return value !== null
    };

    /**
     *
     * @private
     */
    var _closePopin = function(e){
        var body = document.body, btnElement, selector;
        // Takin the click over
        e.preventDefault();
        //
        selector         = '.popin__content__close';
        btnElement       = document.querySelector(selector);
        // For ghost event prevention, detaching handlers
        document.querySelector('.popin')
            .removeEventListener("click", _closePopin);
        btnElement
            .removeEventListener("click", _closePopin);
        // Removing popin
        body.removeChild(body.querySelector('.popin'));
        // Locking body scroll
        body.classList.remove('body--popin-opened');
    };

    /**
     *
     * @param tmpl_str {string}
     * @public
     * @returns {string}
     */
    var _populateTemplate = function(tmpl_str){
        var str = tmpl_str,
            date = _data.date.slice(0, 4) + '/' + _data.date.slice(4,6) + '/' + _data.date.slice(6);
        // Populating template with date, adding css flag for easy component identification
        str = str
                .replace(/{{date}}/,date)
                .replace(/{{name}}/g,_data.name)
                .replace(/{{score}}/,_data.score);
        return str;
    };

    /**
     *
     * @param data {object}
     * @public
     * @returns {string}
     */
    var _insertScores = function(data){
        var daily = data,
            dates = daily.dates.filter(_filterData),
            scores = daily.dataByMember.players[_data.name].filter(_filterData),
            populatedFragment, selector, scoresContainer, btnElement;
        // Creating score list
        for ( var i = 0; i < dates.length; i++ ) {
            populatedFragment = _scoreTemplate
                .replace(/{{date}}/,dates[i])
                .replace(/{{score}}/,scores[i])
                .replace(/{{number}}/,(function(idx){
                    return function(match){
                        if(idx%2 === 0) {
                            return 'odd'
                        }
                        return 'even'
                    }
                })(i));
            //
            selector            = '.popin__content__scroll .popin__content__infos';
            scoresContainer     = document.querySelector(selector);
            // Adding score fragment to the score list
            scoresContainer.insertAdjacentHTML('beforeend', populatedFragment);
        }
    };

    /**
     *
     * @param tmpl_str {string}
     *
     * @private
     */
    var _render = function(tmpl_str){
        var populatedTemplate    = _populateTemplate(tmpl_str);
        // Caching raw HTML template for further use/evolution (view refresh for instance)
        _template                = tmpl_str !== undefined ? tmpl_str : _template;
        // Prepending the popin component to the DOM
        document.body.insertAdjacentHTML('afterbegin', populatedTemplate);
        // Locking body scroll
        document.body.classList.add('body--popin-opened');
        // Adding scores to the DOM Component
        _insertScores(App.Model.data.DAILY);
        // Binding click action for closing detail popin
        document.querySelector('.popin').addEventListener("click", _closePopin);
        document.querySelector('.popin__content__close').addEventListener("click", _closePopin);
    };

    /**
     *
     * @private
     */
    var _init = function(){
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
    };
})();