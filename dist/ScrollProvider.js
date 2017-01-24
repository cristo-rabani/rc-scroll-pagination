'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScrollProvider = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Events = new _events2.default();
Events.lastEventData = {};

var ScrollProvider = exports.ScrollProvider = function (_React$Component) {
    (0, _inherits3.default)(ScrollProvider, _React$Component);

    function ScrollProvider(params) {
        (0, _classCallCheck3.default)(this, ScrollProvider);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, params));

        var _ref = _this.props || {},
            eventName = _ref.eventName;

        _this.observeContentScroll = _lodash2.default.throttle(function () {
            var _ref2 = _this._section || {},
                clientHeight = _ref2.clientHeight,
                clientWidth = _ref2.clientWidth,
                scrollHeight = _ref2.scrollHeight,
                _ref2$scrollLeft = _ref2.scrollLeft,
                scrollLeft = _ref2$scrollLeft === undefined ? 0 : _ref2$scrollLeft,
                _ref2$scrollTop = _ref2.scrollTop,
                scrollTop = _ref2$scrollTop === undefined ? 0 : _ref2$scrollTop,
                scrollWidth = _ref2.scrollWidth;

            var _lastContentScroll = Events.lastEventData[eventName];
            var top = _lastContentScroll && _lastContentScroll.scrollTop || 0;
            var left = _lastContentScroll && _lastContentScroll.scrollLeft || 0;
            var isFirst = !_lastContentScroll && (clientHeight || clientWidth);
            if (isFirst || Math.abs(top - scrollTop) > 50 || Math.abs(left - scrollLeft) > 50) {
                _lastContentScroll = { clientHeight: clientHeight, clientWidth: clientWidth, scrollHeight: scrollHeight, scrollLeft: scrollLeft, scrollTop: scrollTop, scrollWidth: scrollWidth };
                Events.lastEventData[eventName] = _lastContentScroll;
                setTimeout(function () {
                    return Events.emit(eventName, _lastContentScroll);
                }, 0);
            }
        }, 100, { trailing: true });

        return _this;
    }

    ScrollProvider.prototype.render = function render() {
        var _this2 = this;

        return _react2.default.createElement(
            'section',
            {
                ref: function ref(r) {
                    _this2._section = r;
                    _this2.observeContentScroll();
                },
                className: this.props.className || '',
                style: (0, _assign2.default)({ height: '100%', overflowY: 'auto' }, this.props.style),
                onScroll: this.observeContentScroll
            },
            this.props.children
        );
    };

    return ScrollProvider;
}(_react2.default.Component);

ScrollProvider.defaultProps = {
    eventName: 'contentScroll'
};

ScrollProvider.onScroll = function (listener) {
    var eventName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contentScroll';

    Events.lastEventData[eventName] && listener(Events.lastEventData[eventName]);
    Events.on(eventName, listener);
};

ScrollProvider.offScroll = function (listener) {
    var eventName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contentScroll';
    return Events.removeListener(eventName, listener);
};

exports.default = ScrollProvider;