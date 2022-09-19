## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn vite
```

## Base Assumptions

The application is a list of items, containing the item description, priority, and a switch with "yes" and "no" values. The goal is to submit the list of items after marking all items as "yes" or marking one of the items as "no". You can only mark an item if the previous item has already been marked as "yes", otherwise the current item will be disabled. <br />
The application should allow the navigation of the list with keyboard keys, abiding by the same constraints presented above.

<br />

## Architectural Decisions

### Framework/Library Choices

I decided to go with `Vite` as `build system`. It provides a blazing fast development environment. Instantaneous `HMR`, really fast `test runner(vitest)`, support for `typescript` and `fully typed APIs`.

Paired with strict `typescript`, it delivers a powerful environment, giving more confidence and speed to the developers.

Regarding styling, I decided to go with `css modules` because it's simpler and already has native support. But another competitive choice would be `Tailwind`, due to its capabilities in defining styles directly in your `html`, without the addition of extra code(\*as it would be with inline styles) and its `built-in tree shaking`. It also helps with dead code elimination, as most of the styles will be no longer created in dispersed css files.

For global state management and effect handling my choice is `tanstack-query`. The `useQuery` hook allows for a very declarative experience including built-in caching and cache invalidation strategies. The `useMutation` hook is very useful, allowing optimistic updates, and global and unitary cache invalidation at diverse moments of the request lifecycle. [Tanstack Query Docs](https://tanstack.com/query/v4)
<br/>

For testing, I went with `react-testing-library` as it has neat `APIs` for testing user interaction and `DOM` changes. Combined with `vitest`, provided a really pleasant and responsive way to write tests, updating test results almost instantaneously.<br />
As this application doesn't have any API calls and instead mocks the fetch with a `timeout + promise` combo, a library for handling requests wasn't necessary. But to achieve a similar testing experience to this, I would recommend the `Mock Service Worker` library. This way you can avoid mocking and going around API calls as much as possible and focus on the user flows that need to be tested. [React Testing Library Docs](https://testing-library.com/docs/), [Vitest Docs](https://vitest.dev/guide), [Mock Service Worker Docs](https://mswjs.io/docs)

### Folder Structure

The main concept of this folder structure is to keep things simple. As we only have one page, all the components are going to be in there, but as we move forward and have more pages/components, it would be good to split the components/hooks/effects/etc used in more than one page, into less scoped folders (`src/*foldername*`).

<br />

## Implementation Details

### Available Items Logic

It uses the data of the selected items as a baseline for how the requested data should be sliced.

If there's any item selected as NO, then it should only enable the items before and including that one.<br/>
If there are no items selected as NO, then it should enable the item after the last selected item.<br/>
If there are no selected items at all, it should enable only the first one

Implementation:

```
const enabledOptions = useMemo(() => {
    if (!selectedOptionsSorted) return;
    const optionNoSelectedIndex = selectedOptionsSorted.findIndex(
      ({ result }) => result === NO_OPTION
    );

    const hasOptionNoSelected = optionNoSelectedIndex !== -1;
    const EXTRA_OPTION = 1;

    return data?.slice(
      0,
      (hasOptionNoSelected
        ? optionNoSelectedIndex
        : selectedOptionsSorted.length) + EXTRA_OPTION
    );
  }, [data, selectedOptionsSorted]);
```

it uses `selectedOptionsSorted` because it's already memoized and sorted, having no need to redo the calculation just to get the values.

### Keyboard Navigation

The keyboard navigation is separated from the main verification component, as a hook. Currently, it lives inside `verification/effects.ts`, as no other component uses it, but if it's necessary for other places, should be moved under a file under the `src/hooks` folder.

The logic inside the hook is simple. As parameters, it receives the items available for navigation, an object with the currently selected items, and a state setter to set the new items. It also has an inner `useState` that manages the tracking of the focused item.

It has an `useEffect` that takes care of listening for `keydown` events, that fires `handleKeyNavigation`, and then it takes care of firing the events assigned to each key while respecting the constraints specified in the base assumptions.

This hook returns the inner useState value and state setter, so it can be used to track focus and programmatically focus an item.

By default, the first item of the list is focused, to keep it unfocused until the first item is selected by click, the solution is changing the type of `focusedOptionIndex` to `number | undefined` and initializing it as `undefined`. Then inside `handleKeyNavigation`, adding `|| focusedOptionIndex === undefined` to `if (!options) return` and finally adding focusedOptionIndex as an dependency to the `useEffect` that listens for `keydown`.

### Mouse Navigation

The mouse navigation follows the same constraints as the keyboard navigation. The logic for available items is contained inside the `enabledOptions` constant. The special part about mouse navigation is that when the user selects an option, these options should be focused, and that's why we call `setFocusedOptionIndex` from the click handler.

### Submit button

The button is enabled when the selected items array has the same length as the requested data array or if there's a item with a "NO" value inside of the selected items array.

## Mentions

### XState

Potentially a better solution to this problem as it already takes care of the constraints and encapsulates them. It would be simpler to use a state machine to nail the logic used to solve this issue. I didn't use it because I did not have enough knowledge on generating machines based on dynamic data(or if it's even possible).

### Error Boundaries

In our case, we have a pretty well-typed return from the "server", but in a real-life scenario, I would wrap the module in an Error Boundary component just in case the data returned from the server had some funky typing. We must handle failures gracefully and avoid hard crashes as much as possible.
