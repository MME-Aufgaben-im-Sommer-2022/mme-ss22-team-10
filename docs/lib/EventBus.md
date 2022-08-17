#### EventBus

If you wish to send global events, you can use the `EventBus` class:
1. import the `EventBus` singleton
2. call `.addEventListener` to subscribe to events
3. call `.notifyAll` to publish an event to all subscribers

For an example, see [EventBus](../../src/lib/events/EventBus.ts)
