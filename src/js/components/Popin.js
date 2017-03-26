'use strict';
var App = App || {};
App.Components = App.Components || {};
/**
 * Popin component, singleton pattern.
 */
App.Components.Popin = (function(d){

    /**
     * Prevent from conflict
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false;

    /**
     * Raw template for building a score row
     *
     * @type {string}
     * @private
     */
    var _scoreTemplate = '<div class="popin__content__row popin__content__row--{{number}}">\n' +
                         '\t<div class="popin__content__label">{{date}}</div>\n' +
                         '\t<div class="popin__content__value">{{score}} pts</div>\n' +
                         '</div>\n';

    /**
     * Cache original raw template
     *
     * @type {string}
     * @private (static)
     */
    var _template = '';

    /**
     *
     * @type {CustomEvent}
     * @private
     */
    var _routerEvent;

    /**
     * Stores data locally
     *
     * @type {object}
     * @private
     */
    var _data = {};

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
     * Get first name and last name into the model,
     * concats both and returns the result.
     *
     * @param name {string}
     * @returns {string}
     * @private
     */
    var _getFullName = function(name){
        var fullName = '';

        for (var prop in App.Model.settings.dictionary) {
            if(App.Model.settings.dictionary[prop].firstname.toLowerCase() === name){
                fullName = App.Model.settings.dictionary[prop].firstname + ' ';
                fullName += App.Model.settings.dictionary[prop].lastname;
            }
        }

        return fullName;
    };

    /**
     *
     * @private
     */
    var _btnCloseClick = function(e){
        // Taking the click over
        e.preventDefault();
        // Notifying history module
        _routerEvent = new CustomEvent('router.pushstate', { detail: {
            state: {},
            name : 'home',
            route : '/'
        }});
        // Triggering event to push history state
        d.dispatchEvent(_routerEvent);
    };

    /**
     *
     * @private
     */
    var _close = function () {
        var body = d.body;

        if(d.querySelector('.popin') !== null){
            // For ghost event prevention, detaching handlers
            d.querySelector('.popin')
                .removeEventListener("click", App.Components.Popin.closePopin);
            d.querySelector('.popin__content__close')
                .removeEventListener("click", App.Components.Popin.closePopin);
            // Removing popin
            body.removeChild(body.querySelector('.popin'));
            // Locking body scroll
            body.classList.remove('body--popin-opened');
        }
    };

    /**
     * Load the Popin.html, initialize the data object
     *
     * @param ev
     * @private
     */
    var _open = function(ev){
        _data = ev.detail.state;
        // Loading Template through native promise
        App.Utils.Templates.getTemplate('Popin', {}, '/templates').then(
            function(data){
                _render(data);
            }
        );
    };

    /**
     *
     * @param tmpl_str {string}
     * @public
     * @returns {string}
     */
    var _populateTemplate = function(tmpl_str){
        var str = tmpl_str,
            date = _data.date.slice(0, 4) + '/' + _data.date.slice(4,6) + '/' + _data.date.slice(6),
            fullName             = _getFullName(_data.name);
        // Populating template with date, adding css flag for easy component identification
        str = str
                .replace(/{{date}}/,date)
                .replace(/{{name}}/, _data.name)
                .replace(/<h2>{{name}}<\/h2>/, '<h2>' + fullName + '</h2>')
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
            populatedFragment, selector, scoresContainer;
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
            scoresContainer     = d.querySelector(selector);
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
        //

        // Caching raw HTML template for further use/evolution (view refresh for instance)
        _template                = tmpl_str !== undefined ? tmpl_str : _template;
        // Prepending the popin component to the DOM
        d.body.insertAdjacentHTML('afterbegin', populatedTemplate);
        // Locking body scroll
        d.body.classList.add('body--popin-opened');
        // Adding scores to the DOM Component
        _insertScores(App.Model.data.DAILY);
        // Binding click action for closing detail popin
        d.querySelector('.popin').addEventListener("click", _btnCloseClick);
        d.querySelector('.popin__content__close').addEventListener("click", _btnCloseClick);
    };

    /**
     * Attach an event to a given DOM Element
     *
     * @private
     */
    var _initEvents = function () {
        d.addEventListener('open.popin', _open);
        d.addEventListener('close.popin', _close);
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
})(document);