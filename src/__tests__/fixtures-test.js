import checkPropTypes from 'check-prop-types';

import { filterlistProps } from '../fixtures';
import { filterlistPropTypes } from '../propTypes';

test('should be a correct props of component', () => {
  expect(
    checkPropTypes(
      filterlistPropTypes,
      filterlistProps,
      'prop',
      'TestComponentName',
    ),
  ).toBeFalsy();
});
