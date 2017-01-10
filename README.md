# Scroll Pagination
A react component for pagination with scrolling.
It will execute the subscribing function after fetching function.
Scroll pagination can listen from different scroll provider (not only from window or first parent as is in the case other packages)

## Installation
```
npm install --save rc-scroll-pagination
```

## Your listing
```#js
    <ScrollPagination
        Loader={<Loader />}
        onSubscribe={(params, done) => Meteor.subscribe('myDocs', params, done)}
        onFetchData={() => myDocs.find().fetch()}
    >
        {(item) => {
            return <FileItem file={item} height={ROW_HEIGHT} />;
        }}
    </ScrollPagination>
```

## Connecting to layout (a element, which have scrollbar)
//Should be done once for every listings

```#js
<ScrollProvider>
    <main className="col-sm-12 no-side-paddings">
        <ScrollPagination onSubscribe onFetchData>
            { (item) => <div>{item.title}</div> }
        </ScrollPagination>
    </main>
</ScrollProvider>
```

## Custom using of ScrollProvider

```#js
<ScrollProvider eventName="menuScroll">
    <div style={{height: '10000px'}}>
    {/* ... */}
    </div>
</ScrollProvider>
```

- consumer (component, that is interested for observation of scroll):
```
import {ScrollProvider} from 'rc-scroll-pagination';

//----- Your Component:

constructor () {
    // Method that will be observer:
    this.updateMe = this.setState.bind(this);
}

componentWillMount () {
    //register method from your component as a observer:
    ScrollProvider.onScroll(this.updateMe, 'menuScroll');
}

componentWillUnmount () {
    //unregister observer methods:
    ScrollProvider.offScroll(this.updateMe, 'menuScroll');
}

```

## Parameters

### For ScrollPagination
- `step` *\(default `25`\)* count of loading data per one part
- `Loader` Component for waiting, until data will not be ready
- `onSubscribe` *\(default `() => {}`\)* Callback for moment when data should be subscribed, It must to return object with method stop
- `onFetchData` *\(required\)* Callback when data should be fetched
- `eventName` *\(default `contentScroll`\)* Name of event for proper scroll provider
- `children` *\(required\)* Mapper function for rendering of items 

### For ScrollProvider
- `eventName` *\(default `contentScroll`\)* Name of event under scroll will be provided
- `className, style`
