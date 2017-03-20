import React from 'react';
import {List, ListItem} from 'material-ui/List';
import _ from 'lodash';
import ScrollProvider from './ScrollProvider';

const ONE_PART = 25;
const EXCLUSIVE_PROPS = [
    'children', 'step', 'Loader', 'onSubscribe', 'onFetchData', 'eventName', 'ContainerComponent', 'ItemComponent'
];

export class ScrollPagination extends React.Component {

    constructor (props) {
        super(props);
        const {eventName, step = ONE_PART} = this.props || {};
        this.eventName = eventName || 'contentScroll';
        this.state = {items: {}, _ids: [], hasNextPart: true, skip: 0, limit: 0};
        this.handlers = [];
        this.limit = step;
        this.skip = 0;
        this.items = {};
        let _scrollTop;
        let _scrollLeft;
        this.loadMore = ({scrollTop, scrollLeft}) => {
            if (!this.state.hasNextPart || _scrollTop === scrollTop && _scrollLeft === scrollLeft) {
                return;
            }
            _scrollTop = scrollTop;
            _scrollLeft = scrollLeft;
            const {children, step = ONE_PART, onSubscribe, onFetchData} = this.props;
            this.handlers.push(onSubscribe({limit: this.limit + step, skip: this.skip}, () => {
                const _ids = [];
                const data = onFetchData() || [];
                data.forEach(item => {
                    if (!this.items[item._id]) {
                        this.items[item._id] = this.getItemComponent(children(item), item._id);
                    }
                    _ids.push(item._id);
                });
                this.skip = this.limit;
                this.limit = this.limit + step;
                this.setState({
                    _ids,
                    hasNextPart: this.skip < _ids.length,
                    isLoading: false
                });
            }));
        };


    }

    getItemComponent (children, key) {
        if (this.props.ItemComponent === null) {
            return children;
        }
        return React.createElement(
            this.props.ItemComponent || ListItem,
            {key},
            children
        )
    }

    componentDidMount () {
        ScrollProvider.onScroll(this.loadMore, this.eventName);
    }

    render () {
        const {_ids, hasNextPart} = this.state;
        const props = _.omit(this.props, EXCLUSIVE_PROPS);
        const items = _.take(_ids, this.limit).map(id => this.items[id]);
        if (hasNextPart) {
            items.push(this.getItemComponent(this.props.Loader || 'Loading ...', 'loader'));
        }

        return React.createElement(
            this.props.ContainerComponent || List,
            props,
            items
        );
    }

    componentWillUnmount () {
        this.handlers.forEach(h => h.stop());
        this.handlers = [];
        ScrollProvider.offScroll(this.loadMore, this.eventName);
    }
}

ScrollPagination.defaultProps = {
    onSubscribe: (params, done) => done(),
    eventName: 'contentScroll'
};

ScrollPagination.propTypes = {
    Loader: React.PropTypes.node,
    ContainerComponent:  React.PropTypes.func,
    ItemComponent:  React.PropTypes.func,
    step: React.PropTypes.number,
    eventName: React.PropTypes.string,
    onSubscribe: React.PropTypes.func,
    children: React.PropTypes.func.isRequired,
    onFetchData: React.PropTypes.func.isRequired
};

export {ScrollProvider};
export default ScrollPagination;
