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

**Example:**
    
```
    composables/
    ├── useCounter.ts
    ├── useLocalStorage.ts
```

### Pages

**Description:** Pages lives under the `pages` folder, the page should be a folder, and they are registered in the app router.

**filename convention:** The filename of the page should be in `PascalCase` and must have the prefix `Page`.

**Rules:**

- The page should be a folder
- The page folder should have a `[PageName].vue` file inside
- Page local components should be inside the page `components` folder and should have the prefix of the page name
- Page local composables of the page should be inside the page `composables` folder

**Example:**
    
```
    pages/
    ├── HomePage/
    │   ├── HomePage.vue
    |   ├── composables/
    |   |   ├── useHomePage.ts
    |   |   └── useHomePage.spec.ts
    │   └── components/
    │       ├── HomePageHeader.vue
    │       └── HomePageFooter.vue
    ├── AboutPage/
    │   ├── AboutPage.vue
    │   └── components/
    │       ├── AboutPageHeader.vue
```