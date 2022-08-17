#### WebComponent


This class is used to create your custom web components.

Usage:
1. Create a html (and css) file for your component in a new folder
2. Create a new ts class that extends `WebComponent`
3. Use the component either in HTML or in TypeScript:
    - in HTML: `<my-component></my-component>`
    - in TypeScript: `const myComponent = new MyComponent()`
4. (don't forget to call `WebComponentLoader.loadAll().then(() => {...})` at the start of your application)

For examples, see the [ExampleWebComponent](../../src/components/ExampleComponent/)