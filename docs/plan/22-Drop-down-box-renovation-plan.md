This is a plan to transform the drop-down box in `JobsPage.tsx` into a universal drop-down selection component based on `StatusSelect.tsx` (using Headless UI Listbox) and apply it to other pages of the project.

**Goal:**

1. **Create a universal drop-down selection component:** Based on the implementation of `StatusSelect.tsx`, abstract a more general and reusable drop-down selection component (for example, named `GenericListbox.tsx` or `ReusableSelect.tsx`).
2. **Parameterization and customization:** Enable universal components to accept different types of data sources, customize rendering options, and handle different selection logic.
3. **Replace existing dropdown box:** Replace the existing native `<select>` or other dropdown box implementation with the new generic component in `JobsPage.tsx`.
4. **Promote application:** Identify other scenarios in the project where this universal drop-down component can be used, and replace it to unify the UI style and interactive experience.

**Planning Steps:**

**Phase 1: Analysis and Design of Generic Drop-down Component (GenericListbox.tsx)**

1. **Analysis `StatusSelect.tsx`:**
      * **Core functions:** Understand how `StatusSelect.tsx` uses the `Listbox` of Headless UI to display and select status.
      * **Props:** Identifies the props it receives, such as `value`, `onChange`, `statuses` (data source), `disabled`, etc.
      * **Rendering logic:** Analyze how it renders `Listbox.Button` and `Listbox.Option`, especially how to display the color, icon and text of the state.
      * **Styles:** Pay attention to its Tailwind CSS styles and make sure new components inherit these styles or can easily customize them.
2. **Props that define the generic component (`GenericListbox.tsx`):**
      * `options`: `T[]` (generic array, replaces `statuses`), each option contains at least `id` (or unique `value`) and `label`. Allows passing in more complex object structures.
      * `value`: `T | null` (the currently selected item).
      * `onChange`: `(value: T | null) => void` (callback function when selection changes).
      * `placeholder?`: `string` (placeholder text when no item is selected).
      * `label?`: `string` (the label of the drop-down box).
      * `renderOption?`: `(option: T, active: boolean, selected: boolean) => React.ReactNode` (custom option rendering function, allowing the caller to control how each option is displayed, such as adding icons, different styles, etc.). If not provided, default rendering is used (e.g. just showing `option.label`).
      * `renderButtonLabel?`: `(selectedOption: T | null) => React.ReactNode` (function to display selected text on custom button). If not provided, `selectedOption.label` or `placeholder` is displayed.
      * `disabled?`: `boolean`.
      * `className?`: `string` (allows external passing of additional CSS class names for style fine-tuning).
      * `buttonClassName?`: `string` (specific style for `Listbox.Button`).
      * `optionsClassName?`: `string` (specific style for `Listbox.Options` container).
      * `optionClassName?`: `string` (specific style for a single `Listbox.Option`).
      * `name?`: `string` (for form submission).
      * `required?`: `boolean` (for form validation).
3. **Design component structure:**
      * File location: It is recommended to place it in the `src/components/common/` directory.
      * Use Headless UI's `Listbox` as the core.
      * Utilize Tailwind CSS for styling to ensure responsiveness and theme (light/dark mode) compatibility. Reference the style of `StatusSelect.tsx`, but make it more general.
      * Provides default option rendering and button label rendering logic, while allowing overriding through props.
      * Contains necessary ARIA attributes to ensure accessibility.

**Phase 2: Implementing the universal drop-down component (`GenericListbox.tsx`)**

1. **Initialize component file:** Create `src/components/common/GenericListbox.tsx`.
2. **Introduce dependencies:** `@headlessui/react`, `lucide-react` (may be used for the default drop-down arrow icon).
3. **Implement Props type definition (TypeScript). **
4. **Build component skeleton:**
    ```tsx
    import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'; // or Lucide icon
    import React, { Fragment } from 'react';

// Define the Option type, which requires at least id and label
    export interface SelectOption {
      id: string | number;
      label: string;
[key: string]: any; // Allow other custom attributes
    }

    interface GenericListboxProps<T extends SelectOption> {
      options: T[];
      value: T | null;
      onChange: (value: T | null) => void;
      placeholder?: string;
      label?: string;
      renderOption?: (option: T, active: boolean, selected: boolean) => React.ReactNode;
      renderButtonLabel?: (selectedOption: T | null) => React.ReactNode;
      disabled?: boolean;
      className?: string;
      buttonClassName?: string;
      optionsClassName?: string;
      optionClassName?: string;
      name?: string;
      required?: boolean;
    }

    function GenericListbox<T extends SelectOption>({
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      renderOption,
      renderButtonLabel,
      disabled = false,
      className = '',
      buttonClassName = '',
      optionsClassName = '',
      optionClassName = '',
      name,
      required,
    }: GenericListboxProps<T>) {
// ... implement Listbox logic ...
// Refer to the structure of StatusSelect.tsx, but use common props
// For example:
      // const displayValue = renderButtonLabel
      //   ? renderButtonLabel(value)
      //   : value?.label || placeholder;

      return (
        <div className={`w-full ${className}`}>
          {label && (
            <Listbox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </Listbox.Label>
          )}
          <Listbox value={value} onChange={onChange} disabled={disabled} name={name}>
            <div className="relative">
              <Listbox.Button
                className={`relative w-full cursor-default rounded-md bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${buttonClassName}`}
              >
                <span className="block truncate">
                  {renderButtonLabel ? renderButtonLabel(value) : (value?.label || placeholder)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ${optionsClassName}`}
                >
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${optionClassName} ${
                          active ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'
                        }`
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          {renderOption ? (
                            renderOption(option, active, selected)
                          ) : (
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {option.label}
                            </span>
                          )}
                          {selected ? (
                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-indigo-600 dark:text-white' : 'text-indigo-600 dark:text-indigo-300'}`}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      );
    }

    export default GenericListbox;
    ```
5. **Write unit tests:** Make sure various props (including custom render functions) work as expected.

**Phase 3: Replace the existing dropdown box in `JobsPage.tsx`**

1. **Identify the drop-down box in `JobsPage.tsx`:**
* Locates `JobFilterPanel.tsx` (if filtering is in this component) or `JobsPage.tsx` itself.
* Determine the data source, current value and `onChange` handler for each drop-down box. Currently `JobFilterPanel.tsx` uses the native `select` element.
2. **Introduce `GenericListbox.tsx`. **
3. **Prepare `options` data:** Convert the existing drop-down box data to the format required by `GenericListbox` (for example `[{ id: 'option1', label: 'Option 1' }, ...]`).
* For example, for the filters "Sort by", "Job Type", "Work Mode", "Experience Level".
4. **Replacement implementation:**
* Remove old `<select>` element.
* Use `<GenericListbox />` instead.
* Pass in `options`, `value`, `onChange` and other props.
* If a specific style or option rendering is required (for example, a small dot of status color in `StatusSelect`), the `renderOption` and `renderButtonLabel` functions are provided. For a simple text dropdown in `JobFilterPanel.tsx`, complex custom rendering may not be necessary.
5. **Test the functionality of `JobsPage.tsx`:** Make sure the filtering functionality is working as before and the UI is as expected.

**Phase 4: Promote common components to other pages**

1. **Code Review:** Search for other places in the project where native `<select>` or custom drop-down boxes are used.
* Possible scenarios: form pages (`JobFormPage.tsx`, `ProfilePage.tsx` each form, `SettingsPage.tsx`), other filter panels, etc.
2. **Replace one by one:**
* Repeat the replacement steps in stage three for each drop-down box of شناسایی شده.
* Adjust the props of `GenericListbox` according to specific needs.
3. **Maintain consistency:** Make sure that all places where `GenericListbox` is used are visually and interactively consistent (unless there is a specific reason to customize it through `renderOption` etc.).
4. **Documentation (optional but recommended):**
* A brief description of its purpose, Props, and usage examples at the top of the `GenericListbox.tsx` file or in the project's component documentation.

**Phase 5: Testing and Optimization**

1. **Comprehensive Testing:**
* Test the functionality of all replaced dropdown boxes.
* Cross-browser testing (Chrome, Firefox, Safari, Edge).
* Responsive testing (different screen sizes).
* Accessibility testing (keyboard navigation, screen reader compatibility).
2. **Performance optimization:**
* For drop-down boxes with a large number of options, check if there are any performance bottlenecks (although headless UI usually performs well).
3. **Code Review:** Conduct code reviews on all modifications to ensure quality and consistency.

**Potential risks and precautions:**

* **Complex data structures:** If the data structure of `options` is very complex, the implementation of `renderOption` and `renderButtonLabel` may require more work.
* **Style Override:** Ensure that the default styles of common components can easily be overridden or extended by the needs of specific scenarios without conflict.
* **State Management:** Ensure that `value` and `onChange` are properly integrated with the state management logic of each page (such as React `useState`, Redux, etc.).
* **Internationalization (i18n):** If `placeholder` or `label` needs to be internationalized, ensure that the generic component can handle or allow externally passed in translated text. Currently both your `StatusSelect` and `JobFilterPanel` are using the `t` function, new generic components should consider this as well, or have the parent component pass translated strings.

