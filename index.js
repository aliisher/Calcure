/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-reanimated'; // 👈 Add this on top (must be first!)
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
