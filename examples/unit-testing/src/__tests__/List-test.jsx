import React from 'react';
import { shallow } from 'enzyme';
import { ListComponent } from '../List';
import { filterlistProps } from 'redux-filterlist/lib/fixtures';

test('should render without crash', () => {
  shallow(
    <ListComponent
      {...filterlistProps}
    />
  );
});

test('should not render preloader in not loading state', () => {
  const wrapper = shallow(
    <ListComponent
      {...filterlistProps}
    />
  );

  expect(wrapper.find('#preloader').length).toBe(0);
});

test('should render preloader in loading state', () => {
  const wrapper = shallow(
    <ListComponent
      {...filterlistProps}
      listState={{
        ...filterlistProps.listState,
        loading: true,
      }}
    />
  );

  expect(wrapper.find('#preloader').length).toBe(1);
});

test('should render items', () => {
  const wrapper = shallow(
    <ListComponent
      {...filterlistProps}
      listState={{
        ...filterlistProps.listState,
        items: [
          {
            id: 1,
            brand: 'Audi',
            owner: 'Tom',
            color: 'yellow',
          },
          {
            id: 2,
            brand: 'Mercedes',
            owner: 'Henry',
            color: 'white',
          },
          {
            id: 3,
            brand: 'BMW',
            owner: 'Alex',
            color: 'black',
          },
        ],
      }}
    />
  );

  const carsRows = wrapper.find('.car');

  expect(carsRows.length).toBe(3);

  carsRows.forEach((carRow, index) => {
    switch (index) {
      case 0:
        expect(carRow.find('.car__id').text()).toBe('1');
        expect(carRow.find('.car__brand').text()).toBe('Audi');
        expect(carRow.find('.car__owner').text()).toBe('Tom');
        expect(carRow.find('.car__color').text()).toBe('yellow');
        break;

      case 1:
        expect(carRow.find('.car__id').text()).toBe('2');
        expect(carRow.find('.car__brand').text()).toBe('Mercedes');
        expect(carRow.find('.car__owner').text()).toBe('Henry');
        expect(carRow.find('.car__color').text()).toBe('white');
        break;

      case 2:
        expect(carRow.find('.car__id').text()).toBe('3');
        expect(carRow.find('.car__brand').text()).toBe('BMW');
        expect(carRow.find('.car__owner').text()).toBe('Alex');
        expect(carRow.find('.car__color').text()).toBe('black');
        break;

      default:
        throw new Error('Index out of range');
    }
  });
});
