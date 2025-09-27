/**
 * Pre-populating Watermelon DB App
 * Demonstrates SQLite to WatermelonDB migration
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import StudentsScreen from './src/screens/StudentsScreen';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <StudentsScreen />
    </>
  );
}

export default App;
