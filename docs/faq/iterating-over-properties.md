## How do I iterate over Object properties

You can get an Array of all property names an Object has by using the `Object.keys(yourObject)` method:

Example:

```ts
myObject = {
 "2022": {
   "1": ["1","3"],
   "2": ["8","19"],
  },
  "2023": {
    "5": ["8","19"],
  },
}

// the below code will print "2022" and "2023":
Object.keys(myObject).forEach(key => {
  console.log(key);
});
```

### Accessing Object properties dynamically

If you wish to access an Object property via the key value (as shown above), you can use the `myObject[key]` notation.

Example:

```ts
myObject = {
 "2022": {
   "1": ["1","3"],
   "2": ["8","19"],
  },
  "2023": {
    "5": ["8","19"],
  },
}

// the below code will print 
// {
//   "1": ["1","3"],
//   "2": ["8","19"],
// }
// and
// {
//   "5": ["8","19"],
// }
Object.keys(myObject).forEach(key => {
  console.log(myObject[key]); // <- this prints the myObject.2022 and myObject.2023 properties
});
```

