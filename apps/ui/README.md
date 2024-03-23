# App

This is an PWA application built with Vue 3 and Vite.

## Project setup

### Install dependencies
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

## Important Notes

- Currently we are changing the project structure to simplify the development process and support, so the project structure is not stable yet and patterns are not migrated yet.


## Project patterns

### Global components

**Description:** Global components lives under the `components` folder and they are automatically registered in the application using auto-import.

**filename convention:** The filename of the component should be in `PascalCase` and must have the prefix `Is`.

**Rules:**
- Component should use typescript

**Example:**

```
    components/
    ├── IsButton.vue
    ├── IsInput.vue
    └── IsSelect.vue
```

### Global composables

**Description:** Global composables lives under the `composables` folder. They are automatically registered in the application using auto-import.

**filename convention:** The filename of the composable should be in `camelCase`

**Rules:**
- Composables should export a function

**Example:**
    
```
    composables/
    ├── useCounter.ts
    ├── useLocalStorage.ts
```

### Modules

**Description:** Modules lives under the `modules` folder and they can have their own components, composables, pages, services, etc.

**filename convention:**

- module: Modules folder name must be in should be in `camelCase`
- components: The filename of the component should be in `PascalCase` and must have the prefix of the module name. Example: `ModuleNameComponentName.vue`
- composables: The filename of the composable should be in `camelCase` and they not need to have the prefix of the module name.

**Rules**

- Module should have a `index.ts` with a default export using `defineAppModule` function to register the module in the application.

**Example:**
    
```
    modules/
    ├── myModule/
    |   ├── composables/
    |   |   ├── useModuleComposable.ts
    |   |   └── useAnotherModuleComposable.spec.ts
    |   ├── components/
    |   |   ├── MyModuleComponent.vue
    |   |   └── AnotherModuleComponent.vue
    |   ├── pages/
    |   |   ├── MyModulePage.vue
    |   |   └── AnotherModulePage.vue
    |   ├── services/
    |   |   ├── myModuleService.ts
    |   |   └── anotherModuleService.ts
```