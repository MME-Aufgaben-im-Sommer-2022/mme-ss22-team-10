#### DataManager

`DataManager` is a singleton, in which you define functions to fetch/save Models.
1. import the `DataManager` singleton
2. use any of the `DataManager` functions to retrieve data as Models
3. (don't forget to call DataManager.init() at the start of the application)

Example:

```ts
import DataManager from "./DataManager";

DataManager.getExampleModel()
  .then((exampleModel) => {
    log(exampleModel) // logs the ExampleModel
  })
```