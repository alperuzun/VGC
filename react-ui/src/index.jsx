import React from 'react';
import ReactDOM from 'react-dom';


import './index.css';
import App from './App.jsx';
import { ContextProvider } from './contexts/ContextProvider';
import { registerLicense } from '@syncfusion/ej2-base';

console.log('Loaded React.');

registerLicense('ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkBhUX5fcHZQRGlYUUQ=');

ReactDOM.render(
  <ContextProvider>
    <App/>
  </ContextProvider>, document.body);
