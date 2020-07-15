import React from 'react';
import renderer from 'react-test-renderer';
import IntroApp from './IntroApp';

test('test snapShot render component IntroApp', () => {
  const component = renderer.create(
    <IntroApp />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
}); 