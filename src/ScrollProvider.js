import React from 'react';
import _ from 'lodash';
import EventEmitter from 'events';

const Events = new EventEmitter();
Events.lastEventData = {};

export class ScrollProvider extends React.Component {
    constructor (params) {
        super(params);
        const {eventName} = this.props || {};
        this.observeContentScroll = _.throttle(() => {
            const {clientHeight, clientWidth, scrollHeight, scrollLeft = 0, scrollTop = 0, scrollWidth}
                = this._section || {};
            let _lastContentScroll = Events.lastEventData[eventName];
            const top = (_lastContentScroll && _lastContentScroll.scrollTop) || 0;
            const left = (_lastContentScroll && _lastContentScroll.scrollLeft) || 0;
            const isFirst = !_lastContentScroll && (clientHeight || clientWidth);
            if (isFirst || (Math.abs(top - scrollTop) > 50 || Math.abs(left - scrollLeft) > 50)) {
                _lastContentScroll = {clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth};
                Events.lastEventData[eventName] = _lastContentScroll;
                setTimeout(() => Events.emit(eventName, _lastContentScroll), 0);
            }
        }, 100);

    }

    render () {
        return (
            <section
                ref={r => {
                    this._section = r;
                    this.observeContentScroll();
                }}
                className={this.props.className || ''}
                style={Object.assign({height: '100%', overflowY: 'auto'}, this.props.style)}
                onScroll={this.observeContentScroll}
            >
                {this.props.children}
            </section>
        );
    }
}

ScrollProvider.defaultProps = {
    eventName: 'contentScroll'
};

ScrollProvider.onScroll = (listener, eventName = 'contentScroll') => {
    Events.lastEventData[eventName] && listener(Events.lastEventData[eventName]);
    Events.on(eventName, listener);
};

ScrollProvider.offScroll = (listener, eventName = 'contentScroll') => Events.off(eventName, listener);


export default ScrollProvider;
