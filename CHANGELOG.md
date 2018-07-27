## 0.4.0 (July 27, 2018)

 * `loadItems` and `onBeforeRequest` can be defined in props of component.
 * Added `getStateFromProps` and `shouldRecountState`. It can be used for integration with `react-router`.

## 0.3.2 (May 15, 2018)

 * Added `redux@^4.0.0` to peerDependencies.

## 0.3.0 (January 3, 2018)

 * Migrate async flow from Promise to async/await.
 * Do not catch errors in `loadItems`.
 * Removed `catchRejects`.

 ### Breaking Changes
 * For set error state you should use `LoadListError`.

 ```
 // old

 return Promise.reject({
  error: 'Error',
  additional: null,
});

// new

throw new LoadListError({
  error: 'Error',
  additional: null,
});
 ```

## 0.2.6 (December 27, 2017)

 * Added `autoload` param to decorator for ability to prevent requesting items on component render.

## 0.2.5 (November 23, 2017)

 * Don't throw error if list with specified id is alreade registered on page for prevent ssr errors.

## 0.2.4 (November 12, 2017)

 * Added `resetSorting` prop to decorated component for reset sorting.
 * Added `saveFiltersOnResetAll` param to decorator for show previous list items while load request is pending.

## 0.2.3 (November 6, 2017)

 * Added `insertItem` prop to decorated component for inserting items to list state.

## 0.2.2 (October 19, 2017)

 * Allow set initial value of `additional` by param of decorator or prop of decorated component.

## 0.2.1 (October 18, 2017)

 * Added `deleteItem` prop to decorated component for deleting items from list state.
 * Added `updateItem` prop to decorated component for updating items in list state.

## 0.2.0 (October 16, 2017)

 * Now `filterlistPropTypes` are configurable. You can validate list items, additional data, errors and filters most strictly.
 * Added `filterlistProps` for most comfortable unit testing.
 * Added `react@^16.0.0` to peerDependencies.

### Breaking Changes
 * New `filterlistPropTypes` is incompatible with old `filterlistPropTypes`. For fast migration you can replace all `filterlistPropTypes` in your code to `filterlistPropTypes({})`.
