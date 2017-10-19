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
