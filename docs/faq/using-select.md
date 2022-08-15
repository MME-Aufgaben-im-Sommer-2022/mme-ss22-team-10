
## How do I use .select (or querySelector) correctly?

### Selecting

To select a single HTML element, use:
- `this.select("css-selector")` to select a single element (same as `this.root.querySelector(css-selector)`)
- `this.selectAll("css-selector")` to select multiple elements (same as `this.root.querySelectorAll(css-selector)`)

A list of all available css selectors can be found [here](https://www.w3schools.com/css/css_selectors.asp).

### Specifying the type

To specify the type of the selected element, you can:
- specify it when calling the function
    - e.g.: `this.select<HTMLElement>("css-selector")`
- or specify it as the type of variable you're assigning to
    - e.g.: `let myElement: HTMLElement = this.select("css-selector")`

A list of all basic HTML element types can be found [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.htmlelement.html).


### Dealing with null values

When selecting an element, you can get null values, e.g. when the element is in the dom.

To guarantee that an element you're selecting is **not null**, add a `!` after the selection:

- `this.select<HTMLElement>("css-selector")!`

If you're not sure if an element exists, simply check the return of the selector in an if statement:

- `if (this.select<HTMLElement>("css-selector")) {...}`
