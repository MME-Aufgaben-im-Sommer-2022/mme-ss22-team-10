#### Observable

Extending `Observable` provides a class with basic pubSub functionality:
1. create a class that extends `Observable`
2. call `.addEventListener` on objects of that class to subscribe to events
3. call `notifyAll` to publish an event to all subscribers

For an example, see [Observable](../src/lib/events/Observable.ts)