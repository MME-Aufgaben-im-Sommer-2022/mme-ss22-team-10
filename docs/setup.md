# Setup

## 👨‍💻 Code setup

To download the project, follow these steps:

1. Clone the repository (via GitHub desktop or command line)
2. In the root of the cloned directory, run `npm install`

## 📝 Editor setup

To integrate the project with your editor, follow these steps (after the code setup):

### VS Code

#### Code Linting

1. Install the extension [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), then:
   1. Use `Ctrl+Shift+P` or `Cmd+Shift+P` to open the command palette
   2. Type `Preferences: Open Settings (JSON)` and press `Enter`
   3. Paste `"eslint.validate": ["typescript"],` into the root of the JSON file

#### Code Formatting

1. Install the extension [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), then:
   1. Use `Ctrl+Shift+P` or `Cmd+Shift+P` to open the command palette
   2. Type `Preferences: Open Settings (JSON)` and press `Enter`
   3. Paste `"editor.formatOnSave": true,` and `"editor.defaultFormatter": "esbenp.prettier-vscode",` into the root of the JSON file

### WebStorm (less setup required)

#### Code Linting

1. Open the settings via `Ctrl+Alt+S` (win) `cmd + ,` (mac)
2. Go to `Editor` -> `Inspections` -> `JavaScript and Typescript`
3. Uncheck everything, except the following:
   - `Code quality tools`
   - `Typescript`

#### Code Formatting

1. Open the settings via `Ctrl+Alt+S` (win) `cmd + ,` (mac)
2. Go to `Language & Framework` -> `JavaScript` -> `Prettier`
3. Check `On "Reformat Code" action` and `On save`