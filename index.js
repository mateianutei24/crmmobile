/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { store } from './src/redux/index';
import AuthListener from './src/components/AuthListener';

const ReduxApp = () => (
  <Provider store={store}>
    <AuthListener />
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
