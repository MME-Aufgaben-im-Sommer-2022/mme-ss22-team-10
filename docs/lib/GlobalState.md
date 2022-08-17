#### GlobalState

`GlobalState` is a singleton, where States, which are needed in many Components, should be stored.
That way, they can be accessed from anywhere in the application.
1. import the `GlobalState` singleton
2. use `GlobalState.addModel(model)` to add a model to the store
3. use GlobalState.findModel(), GlobalState.findModels() and GlobalState.getModelById() retrieve models from the store
4. (don't forget to call GlobalState.init() at the start of the application)

Example: 
```ts
GlobalState.addState(new State("hi there"));

const retrievedState = GlobalState.findState(
	(state) => state.value === "hi there",
	string
);
```