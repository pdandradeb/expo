import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import DevMenuContext from '../DevMenuContext';

export default class DevMenuSettingsScreen extends React.PureComponent {
  static navigationOptions = {
    headerShown: true,
  };

  static contextType = DevMenuContext;

  pushScreen = () => {
    this.props.navigation.push('Settings');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ paddingTop: 60, alignItems: 'center' }}>
          <Text>Hello from expo-dev-menu!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
