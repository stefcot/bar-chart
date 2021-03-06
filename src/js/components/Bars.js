'use strict';
var App = App || {};
App.Components = App.Components || {};

/**
 *
 */
App.Components.Bars = (function(){
    /**
     * Raw template for building a bar
     *
     * @type {string}
     * @private
     */
    var _barTemplate = '<div class="bar bar--{{name}}" style="width: {{width}}%"><div class="bar__name">{{name}} - {{score}} pts</div></div>\n';

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
     *
     * @param data {object}
     * @constructor
     */
    function Bars(data){
        this.data = data;
        this.name = '';
        this.isNull = (this.data.date === null);
        this.getTemplate();
    }

    /**
     *
     * @public
     */
    Bars.prototype.getTemplate = function(){
        var _this = this;

        App.Utils.Templates.getTemplate('Bars', this.data, '/templates').then(
            function(data){
                _this.render(data);
            }
        );
    };

    /**
     *
     * @param tmpl_str {string}
     * @public
     * @returns {string}
     */
    Bars.prototype.populateTemplate = function(tmpl_str){
        var str = tmpl_str,
            date = !this.isNull ? this.data.date.slice(0, 4) + '/' + this.data.date.slice(4,6) + '/' + this.data.date.slice(6) : '';
        // Populating template with date, adding css flag for easy component identification
        str = str
            .replace(/class="bar-chart__row"/,'class="bar-chart__row bars-' + this.data.index.toString() + '"')
            .replace(/{{date}}/,date);
        return str;
    };

    /**
     *
     * @param data {object}
     * @public
     * @returns {string}
     */
    Bars.prototype.insertBars = function(data){
        var obj = data, popinData,
            populatedFragment, selector, barsContainer, barElement, name;

        for ( var i = 0; i < obj.scores.length; i++ ) {
            name = obj.scores[i].name.charAt(0).toUpperCase() + obj.scores[i].name.slice(1);
            popinData = {};
            populatedFragment = _barTemplate
                                    .replace(/({{name}})/, obj.scores[i].name)
                                    .replace(/({{name}}\s-)/, name)
                                    .replace(/{{width}}/g, (obj.scores[i].score / 10).toString())
                                    .replace(/{{score}}/g, obj.scores[i].score);
            //
            selector         = '.bar-chart__row.bars-' + obj.index.toString() + ' .bars';
            barsContainer    = document.querySelector(selector);

            // Adding main fragment to the DOM
            barsContainer.insertAdjacentHTML('beforeend', populatedFragment);

            // Binding click action for opening detail popin
            selector         += ' .bar.bar--' + obj.scores[i].name;
            barElement       = document.querySelector(selector);

            // Storing data to be passed to the popin component through the event
            popinData.index = obj.index;
            popinData.date = obj.date;
            popinData.name = obj.scores[i].name;
            popinData.score = obj.scores[i].score;

            // binding event with handler dynamically set
            barElement.addEventListener("click", (function(p){
                return function(e) {
                    e.preventDefault();
                    // Notifying history module
                    _routerEvent = new CustomEvent('router.pushstate', { 'detail': {
                        state: {
                            index: p.index,
                            name: p.name,
                            score: p.score,
                            date: p.date
                        },
                        name : p.date + " " + p.name,
                        route : "/details/" + p.name + "/" + p.date
                    }});
                    // triggering event to push history state
                    document.dispatchEvent(_routerEvent);

                }
            })(popinData));
        }
    };

    /**
     *
     * @param tmpl_str {string} Raw template string
     * @public
     */
    Bars.prototype.render = function(tmpl_str){
        var populatedTemplate    = this.populateTemplate(tmpl_str),
            selector, barsContainer;
        // Caching raw HTML template for further use/evolution (view refresh for instance)
        _template                = tmpl_str !== undefined ? tmpl_str : _template;
        // Adding main fragment to the DOM
        document
            .querySelector('.bar-chart')
            .insertAdjacentHTML('beforeend', populatedTemplate);
        // Adding bars to the DOM Component
        if (!this.isNull) {
            this.insertBars(this.data);
        } else {
            selector         = '.bar-chart__row.bars-' + this.data.index.toString() + ' .bars';
            barsContainer    = document.querySelector(selector);
            barsContainer.classList.add("bars--empty");
        }
    };

    /**
     * exposing methods
     */
    return Bars
})();
