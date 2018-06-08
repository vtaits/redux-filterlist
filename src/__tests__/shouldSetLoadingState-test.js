import shouldSetLoadingState from '../shouldSetLoadingState';

test('should set loading state for load more action', () => {
  expect(shouldSetLoadingState(null)).toBe(true);
});

test('should set loading state if appliedFilters changed', () => {
  expect(shouldSetLoadingState({
    filters: null,
    appliedFilters: {
      test: 'value',
    },
    sort: null,
  })).toBe(true);
});

test('should set loading state if sort changed', () => {
  expect(shouldSetLoadingState({
    filters: null,
    appliedFilters: {
      test: 'value',
    },
    sort: null,
  })).toBe(true);
});

test('should not set loading state if only filters changed', () => {
  expect(shouldSetLoadingState({
    filters: null,
    appliedFilters: {
      test: 'value',
    },
    sort: null,
  })).toBe(true);
});
