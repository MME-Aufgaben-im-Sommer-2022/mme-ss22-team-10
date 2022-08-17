#### State

`State` is a wrapper class that allows you to make any existing object observable (not just Models).

Usage:

1. use `new State(value)` to create a new `State` object
2. call `.addEventListener` to subscribe to changes
3. call `.value` to get the current value
4. call `.value = newValue` to update the value

Example:
```ts
let exampleState = new State("some data");

// listen for State.STATE_CHANGE_EVENT events
exampleState.addEventListener(State.STATE_CHANGE_EVENT, (data) => {}) 

// get the value of the State object and print it (-> "some data")
log(exampleState.value)

// set the value of the State object (-> automatically notifies all listeners)
exampleState.value = "new data" 
```

##### Creating new States from existing State values

Sometimes, it is necessary to create a new State from an existing State. E.g. when you only care about a specific part of the state value:

```ts
existingState = new State({
  randomProp = 0,
  interestingProp = "interesting" // <- this is the interesting part of the state
})
```

To create a new state from this existing state, which only contains the property "interestingProp", use the `.createSubState("propertyKey")` function:
```ts
// the propertyKey parameter is a string of what you would usually type 
// to get the property form the state object
// here, we want to get the existingState.value.interestingProp property,
// so we type "value.interestingProp"
newState = existingState.createSubState("value.interestingProp")
```

To access nested properties, use the dot notation:

```ts
existingState = new State({
  randomProp = 0,
  nestedObject : {
    interestingProp = "interesting" // <- the interesting part of the state
  };

// to access nested values, join them with a dot
newState = existingState.createSubState("value.nestedObject.interestingProp");
```

Accessing Array values also works via the dot notation:

```ts
existingState = new State({
  randomProp = 0,
  nestedArray : [
    "interesting", // <- the interesting part of the state
  ];

// access the first element of the array:
newState = existingState.createSubState("value.nestedArray.0");
```

