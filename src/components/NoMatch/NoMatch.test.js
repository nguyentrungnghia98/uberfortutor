import React from 'react';
import renderer from 'react-test-renderer';
import NoMatch from './NoMatch';
import { BrowserRouter } from 'react-router-dom';

const Wrapper = (props) => (
  <BrowserRouter>
    <NoMatch {...props}/>
  </BrowserRouter>
)

test('test snapShot render component NoMatch', () => {
  const component = renderer.create(
    <Wrapper />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
}); 