## 0.2.0 (October 16, 2017)

 * Now `filterlistPropTypes` are configurable. You can validate list items, additional data, errors and filters most strictly.
 * Added `filterlistProps` for most comfortable unit testing.
 * Added `react@^16.0.0` to peerDependencies.

### Breaking Changes
 * New `filterlistPropTypes` is incompatible with old `filterlistPropTypes`. For fast migration you can replace all `filterlistPropTypes` in your code to `filterlistPropTypes({})`.