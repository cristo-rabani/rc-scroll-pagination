'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScrollProvider = exports.ScrollPagination = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('material-ui/List');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ScrollProvider = require('./ScrollProvider');

var _ScrollProvider2 = _interopRequireDefault(_ScrollProvider);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ONE_PART = 25;
var EXCLUSIVE_PROPS = ['children', 'step', 'Loader', 'onSubscribe', 'onFetchData', 'eventName', 'ContainerComponent', 'ItemComponent'];

var ScrollPagination = exports.ScrollPagination = function (_React$Component) {
    (0, _inherits3.default)(ScrollPagination, _React$Component);

    function ScrollPagination(props) {
        (0, _classCallCheck3.default)(this, ScrollPagination);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

        var _ref = _this.props || {},
            eventName = _ref.eventName,
            _ref$step = _ref.step,
            step = _ref$step === undefined ? ONE_PART : _ref$step;

        _this.eventName = eventName || 'contentScroll';
        _this.state = { items: {}, _ids: [], hasNextPart: true, skip: 0, limit: 0 };
        _this.handlers = [];
        _this.limit = step;
        _this.skip = 0;
        _this.items = {};
        var _scrollTop = void 0;
        var _scrollLeft = void 0;
        _this.loadMore = function (_ref2) {
            var scrollTop = _ref2.scrollTop,
                scrollLeft = _ref2.scrollLeft;

            if (!_this.state.hasNextPart || _scrollTop === scrollTop && _scrollLeft === scrollLeft) {
                return;
            }
            _scrollTop = scrollTop;
            _scrollLeft = scrollLeft;
            var _this$props = _this.props,
                children = _this$props.children,
                _this$props$step = _this$props.step,
                step = _this$props$step === undefined ? ONE_PART : _this$props$step,
                onSubscribe = _this$props.onSubscribe,
                onFetchData = _this$props.onFetchData;

            _this.handlers.push(onSubscribe({ limit: _this.limit + step, skip: _this.skip }, function () {
                var _ids = [];
                var data = onFetchData() || [];
                data.forEach(function (item) {
                    if (!_this.items[item._id]) {
                        _this.items[item._id] = _this.getItemComponent(children(item), item._id);
                    }
                    _ids.push(item._id);
                });
                _this.skip = _this.limit;
                _this.limit = _this.limit + step;
                _this.setState({
                    _ids: _ids,
                    hasNextPart: _this.skip < _ids.length,
                    isLoading: false
                });
            }));
        };

        return _this;
    }

    ScrollPagination.prototype.getItemComponent = function getItemComponent(children, key) {
        if (this.props.ItemComponent === null) {
            return children;
        }
        return _react2.default.createElement(this.props.ItemComponent || _List.ListItem, { key: key }, children);
    };

    ScrollPagination.prototype.componentDidMount = function componentDidMount() {
        _ScrollProvider2.default.onScroll(this.loadMore, this.eventName);
    };

    ScrollPagination.prototype.render = function render() {
        var _this2 = this;

        var _state = this.state,
            _ids = _state._ids,
            hasNextPart = _state.hasNextPart;

        var props = _lodash2.default.omit(this.props, EXCLUSIVE_PROPS);
        var items = _lodash2.default.take(_ids, this.limit).map(function (id) {
            return _this2.items[id];
        });
        if (hasNextPart) {
            items.push(this.getItemComponent(this.props.Loader || 'Loading ...', 'loader'));
        }

        return _react2.default.createElement(this.props.ContainerComponent || _List.List, props, items);
    };

    ScrollPagination.prototype.componentWillUnmount = function componentWillUnmount() {
        this.handlers.forEach(function (h) {
            return h.stop();
        });
        this.handlers = [];
        _ScrollProvider2.default.offScroll(this.loadMore, this.eventName);
    };

    return ScrollPagination;
}(_react2.default.Component);

ScrollPagination.defaultProps = {
    onSubscribe: function onSubscribe(params, done) {
        return done();
    },
    eventName: 'contentScroll'
};

ScrollPagination.propTypes = {
    Loader: _propTypes2.default.node,
    ContainerComponent: _propTypes2.default.func,
    ItemComponent: _propTypes2.default.func,
    step: _propTypes2.default.number,
    eventName: _propTypes2.default.string,
    onSubscribe: _propTypes2.default.func,
    children: _propTypes2.default.func.isRequired,
    onFetchData: _propTypes2.default.func.isRequired
};

exports.ScrollProvider = _ScrollProvider2.default;
exports.default = ScrollPagination;