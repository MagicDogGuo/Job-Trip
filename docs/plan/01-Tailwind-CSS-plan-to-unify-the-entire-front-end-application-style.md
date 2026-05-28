A detailed plan, based on the style of `JobsPage.tsx`, fully embraces Tailwind CSS to unify the style of the entire front-end application. This plan will cover all the key points you mentioned: removing/replacing MUI, componentization and custom classes, unifying layout containers, unifying interaction element styles, ensuring responsiveness and dark mode, and continuing to use the `lucide-react` icon library.

* *Overall Goal:**

Achieve consistency in visual style and code implementation for the entire front-end application, with Tailwind CSS as the core, improving development efficiency and maintainability.

* *Core Principles:**

1. **Tailwind First**: New and refactored components give priority to using the Tailwind CSS tool class.
2. **Native first, componentized as secondary**: Prioritize the use of native HTML elements with Tailwind CSS. When style combinations become complex or need to be reused in multiple places, encapsulate them into independent React components.
3. **Reduce CSS files**: The goal is to minimize independent `.css` files at the page level or component level. Necessary global styles or complex component base classes that are difficult to implement with pure Tailwind can be defined using `@apply` in a global CSS file (such as `index.css` or a new `theme.css`/`base.css`).
4. **MUI Gradual Stripping**: Systematically replace Material-UI components used in the project.
5. **Consistency**: Ensure that all interactive elements (buttons, forms, cards, etc.), layout containers, spacing, typography, and colors maintain a consistent style throughout the entire application, refer to the implementation of `JobsPage.tsx`.
6. **Responsiveness and Dark Mode**: All components and pages must consider and implement responsive layout and dark mode support from the start.

* *Detailed planning steps:**

* *Phase 1: Infrastructure construction and specification formulation (overall level)**

1. **Analyze and extract the common style pattern of `JobsPage.tsx`**:
    * **Containers**:
        * Determine the specific Tailwind implementation of `.container-lg` or similar container class used in `JobsPage.tsx` (possibly in global CSS). If it does not exist, define a standard container class in global CSS (such as `src/index.css` or `src/styles/global.css`), such as:
            ```css
            /* src/index.css or src/styles/global.css */
            .container-main {
@apply mx-auto px-4 sm:px-6 lg:px-8; /* Adjust as needed */
            }
.container-lg { /* If JobsPage already exists, use this as the standard or adjust */
              @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
            }
            ```
    * **Sections**:
        * Define standard page section styles, such as `.section` in `JobsPage.tsx` (if it is custom), including top and bottom spacing, etc. For example:
            ```css
            .section {
@apply py-8 sm:py-12; /* Example spacing */
            }
            .section-title {
@apply text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6; /* Unified block title */
            }
            ```
    * **Cards**:
        * Extract the Tailwind class combination of cards (such as a container for job list items) from `JobsPage.tsx` and define a reusable `.card-base` class in global CSS:
            ```css
            .card-base {
              @apply bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md ring-1 ring-gray-900/5 dark:ring-white/10 transition-all duration-300;
            }
            .card-interactive {
              @apply hover:shadow-lg hover:ring-gray-900/10 dark:hover:ring-white/20;
            }
/* You can add .card-header, .card-body, .card-footer and other auxiliary classes as needed */
            ```
    * **Buttons**:
        * Define a standard set of button styles (primary button, secondary button, danger button, ghost button, icon button, etc.) using the `@apply` Tailwind class. For example:
            ```css
            .btn {
              @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150;
            }
            .btn-primary {
              @apply btn bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
            }
            .btn-secondary {
              @apply btn bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500 dark:bg-indigo-700/30 dark:text-indigo-300 dark:hover:bg-indigo-700/50;
            }
.btn-icon { /* For pure icon buttons, such as in Sidebar */
              @apply p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors;
            }
/* ... other button types ... */
            ```
    * **Forms**:
        * Define unified basic styles for input boxes (`.form-input`), selection boxes (`.form-select`), and text areas (`.form-textarea`).
            ```css
            .form-input, .form-select, .form-textarea {
              @apply block w-full h-10 px-3 py-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border-0 ring-1 ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm text-sm;
            }
            .form-label {
              @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
            }
/* ... other form related styles ... */
            ```
    * **Typography**:
        * Although Tailwind provides a wealth of typesetting tool classes, you can consider defining some semantic heading classes, such as `.heading-xl`, `.heading-lg`, `.body-text`, `.caption-text`, etc., if the project has strict requirements for a specific font, size, and line height combination.
            ```css
            .heading-xl {
              @apply text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl;
            }
            /* ... */
            ```

2. **Configure Tailwind CSS Theme**:
    * In the `tailwind.config.js` file, check and unify the project's theme color (especially the `indigo`-related colors to see if they are consistent with `JobsPage.tsx`), fonts, breakpoints, etc.
    * Make sure the dark mode configuration (`darkMode: 'class'`) is enabled.

3. **Update global CSS files**:
    * Add the custom class defined in step 1 to the global CSS file (such as `src/index.css` or the newly created `src/styles/theme.css` / `src/styles/base-components.css`).
    * Clean up existing global CSS for styles that conflict with or are redundant to the new specification.

4. **Documentation**:
    * Create simple documentation or share with your team for newly defined global custom classes and style specifications to ensure everyone understands and follows them.

* *Phase 2: Gradual reconstruction of pages and components**

1. **Select pilot page/component**:
    * Start with pages that have large differences in styles or are relatively simple (for example, if there are some custom classes in `WelcomePage.tsx` that are not clearly defined, you can normalize it first).
    * Alternatively, choose a page that uses an MUI but has less complex functionality as a pilot for replacing the MUI.

2. **Refactoring Strategy**:
    * **MUI Replacement**:
        * Identify the MUI components used in the page.
        * For each MUI component, find its corresponding native HTML structure and Tailwind CSS implementation. For example:
            *   MUI `Button` -> HTML `<button className="btn btn-primary">`
            *   MUI `Card` -> HTML `<div className="card-base">`
            *   MUI `TextField` -> HTML `<label className="form-label">...</label><input type="text" className="form-input" />`
            * MUI `Typography` -> HTML `<p className="text-gray-700 dark:text-gray-200 text-base">` (or use a defined typography class)
            * MUI `Box`, `Grid` -> HTML `div` cooperates with Tailwind Flexbox/Grid tool class.
        * Replace step by step and convert to the Tailwind class using the styles in the `sx` prop as a reference.
    * **Dedicated CSS file handling (`.css` / `.module.css`)**:
        * Analyze rules in CSS files.
        * Move rules that can be implemented with Tailwind directly into the component's `className`.
        * For reusable component-level styles, consider whether to abstract them into global custom classes (see Phase 1) or React components.
        * The goal is to eventually remove these specialized CSS files.
    * **Inline Styles and `style` Prop**: Try to avoid using the inline `style` prop and replace it with the Tailwind class.

3. **Create reusable components**:
    * During the refactoring process, if it is found that certain UI patterns (such as a specific style of input box containing icons and text, a complex card structure) are repeated in multiple places, and their Tailwind class combination is very lengthy, then they will be encapsulated into a new React component.
    * For example, you can create an `InputWithIcon` component, or a `StyledCard` component. These components use Tailwind CSS internally.

4. **Unify existing Tailwind usage**:
    * For pages that are already using Tailwind, check whether their usage is consistent with the style of `JobsPage.tsx` and the newly defined global class. For example, do the buttons all use `.btn .btn-primary` or similar specifications.

5. **Ensure Responsiveness and Dark Mode**:
    * When refactoring each component and page, you must use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) and dark mode prefixes (`dark:`) to ensure that the display effect on all devices and modes complies with `JobsPage.tsx` standards.

6. **icon**:
    * Continue to use the `lucide-react` icon library uniformly. Make sure the size and color of the icon are controlled through the Tailwind class and coordinated with surrounding elements.

* *Phase Three: Testing and Iteration**

1. **Visual regression testing**: After modifying each page or component, perform a thorough visual test to ensure that it looks consistent with the style of `JobsPage.tsx` and behaves correctly across different screen sizes and dark/light modes.
2. **Functional Testing**: Ensure that style changes do not break the original functionality of the component or page.
3. **Code Review**: Code review among team members to ensure that new style specifications and Tailwind CSS best practices are followed.
4. **Iterative Optimization**: Make necessary adjustments and optimizations based on test and review results.

* *Specific page processing example (high level):**

* **`UserProfilePage.tsx` (MUI hard-hit area)**:
    * Replace MUI components such as `Tabs`, `Tab`, `Card`, `TextField`, `Button`, `List`, `Dialog` with equivalent components or custom components implemented by Tailwind CSS.
    * For example, Tabs can be implemented with a set of styled `button` or `div`; Dialog can create a custom modal box component and use Tailwind internally.
    * This is a heavy-duty page that requires careful planning.

* **`ResumeFormPage.tsx` (with dedicated CSS)**:
    * Open `ResumeFormPage.css`.
    * Analyze the CSS rules one by one and try to replace them directly in the JSX of `ResumeFormPage.tsx` with the Tailwind class.
    * If some styles are common form element styles, see if they can be overridden by `.form-input`, `.form-label`, etc. defined in stage one.
    * The final goal is to delete `ResumeFormPage.css`.

* **`WelcomePage.tsx` (already has Tailwind, but has custom classes)**:
    * Check where `.welcome-banner`, `.title-lg`, etc. custom classes are defined (possibly in global CSS).
    * Evaluate whether these custom classes are necessary or can be replaced with pure Tailwind utility classes or global custom classes (such as `.section-title`) defined in Phase 1.
    * Make sure the Tailwind class it uses is consistent with the style of `JobsPage.tsx` (such as button style).

* *Tools and Resources:**

* **Tailwind CSS IntelliSense (VS Code extension)**: Improve the efficiency of writing Tailwind classes.
* **Browser Developer Tools**: Used to inspect existing styles and debug Tailwind classes.
* **Tailwind CSS Documentation**: Check out available tool classes at any time.

This plan is ambitious and requires time and sustained effort. It is recommended to proceed step by step by module and page.

* *Implementation Checklist (High Level):**

1. **[Global]** Analyze the style pattern of `JobsPage.tsx` and define reusable custom classes (containers, blocks, cards, buttons, form elements, layout) in global CSS.
2. **[Global]** Configure `tailwind.config.js` to unify theme colors, fonts, and breakpoints.
3. **[Global]** Clean up existing global CSS for styles that conflict with or are redundant to the new specification.
4. **[Global]** Create a style specification document.
5. **[Page Level]** For each target page:
    * Remove or replace MUI components with native HTML + Tailwind CSS or custom Tailwind components.
    * Migrate styles in private CSS files to Tailwind classes or global custom classes, and delete private CSS files.
    * Unify page layout, container, and interactive element styles to make them consistent with global specifications and `JobsPage.tsx` style.
    * Ensure responsive layout and dark mode support.
    * Use the `lucide-react` icon uniformly.
6. **[Component Level]** For reusable UI patterns identified in refactoring, create standalone React components, using Tailwind CSS internally.
7. **[Testing]** Visual and functional testing of every refactored page and component.
8. **[Review]** Conduct code reviews to ensure compliance with specifications.
