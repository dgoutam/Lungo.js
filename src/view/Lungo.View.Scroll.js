/**
 * Wrapper of the third library iScroll
 *
 * @namespace LUNGO.View
 * @class Scroll
 * @requires iScroll
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

LUNGO.View.Scroll = (function(lng, undefined) {

    var DEFAULT_PROPERTIES = {
        hScroll: false,
        vScroll: false,
        useTransition: true,
        momentum: true,
        lockDirection: true,
        fixedScrollbar: true,
        fadeScrollbar: true,
        hideScrollbar: true
    };

    var HORIZONTAL_CLASS = 'horizontal';

    var CACHE_KEY = 'scrolls';

    var HEADER_FOOTER_BLEEDING = 90;

    /**
     * Creates a new iScroll element.
     *
     * @method create
     *
     * @param {string} Id of the container scroll.
     * @param {object} [OPTIONAL] Properties
     */
    var create = function(id, properties) {
        if (id) {
            refresh(id, properties);
        } else {
            lng.Core.log(3, 'ERROR: Impossible to create a <scroll> without ID');
        }
    };

    /**
     * Update iScroll element with new <markup> content.
     *
     * @method update
     *
     * @param {string} Id of the container scroll.
     * @param {string} Markup content
     */
    var update = function(id, content) {
        var scroll = lng.dom('#' + id);
        var container = scroll.children().first();

        if (container.length === 0) {
            scroll.html('<div id="' + id + '_scrl"></div>');
            container = scroll.children().first();
        }
        container.html(content);

        lng.View.Resize.scroll(scroll);
        _saveScrollInCache(id);
    };

    /**
     * Removes iScroll instance.
     *
     * @method refresh
     *
     * @param {Object} Id of the <section>
     */
    var refresh = function(id, properties) {
        var scroll = lng.dom('#' + id);
        if (_needScroll(scroll)) {
            properties = _mixProperties(scroll, properties);
            _saveScrollInCache(id, properties);
        }
    };

    /**
     * Removes iScroll instance.
     *
     * @method remove
     *
     * @param {string} Id of the <section>
     */
    var remove = function(id) {
        if (lng.Data.Cache.exists(CACHE_KEY)) {
            lng.Data.Cache.get(CACHE_KEY, id).destroy();
            lng.Data.Cache.remove(CACHE_KEY, id);
        }
    };

    /**
     * Removes iScroll instance.
     *
     * @method scrollIsHorizontal
     *
     * @param {Object} Id of the <section>
     */
    var isHorizontal = function(scroll) {
        return (scroll.hasClass(HORIZONTAL_CLASS)) ? true : false;
    };

    var _needScroll = function(scroll) {
        var element = scroll[0];
        return (element.clientHeight < element.scrollHeight);
    };

    var _saveScrollInCache = function(id, properties) {
        _createScrollIndexInCache();

        var scroll = lng.Data.Cache.get(CACHE_KEY);
        if (!scroll[id]) {
            scroll[id] = new iScroll(id, properties);
        } else {
            scroll[id].refresh();
            scroll[id].scrollTo(0,0,300);
        }
        lng.Data.Cache.set(CACHE_KEY, scroll);
    };

    var _createScrollIndexInCache = function() {
        if (!lng.Data.Cache.exists(CACHE_KEY)) {
            lng.Data.Cache.set(CACHE_KEY, {});
        }
    }

    var _mixProperties = function(scroll, properties) {
        var scroll_type = isHorizontal(scroll) ? 'hScroll' : 'vScroll';

        properties || (properties = {});
        properties[scroll_type] = true;
        properties = lng.Core.mix(DEFAULT_PROPERTIES, properties);

        return properties;
    };

    return {
        create: create,
        update: update,
        remove: remove,
        isHorizontal: isHorizontal,
        refresh: refresh
    };

})(LUNGO);