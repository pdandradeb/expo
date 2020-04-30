import { NavigationContext } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, PixelRatio, View } from 'react-native';

import DevMenuContext from '../DevMenuContext';
import {
  DevMenuItemAnyType,
  DevMenuItemEnum,
  DevMenuItemActionType,
  dispatchActionAsync,
} from '../DevMenuInternal';
import { StyledView } from '../components/Views';
import Colors from '../constants/Colors';
import DevMenuButton from './DevMenuButton';

type Props = {
  items: DevMenuItemAnyType[];
};

type ItemProps<ItemType = DevMenuItemAnyType> = {
  item: ItemType;
};

class DevMenuItem extends React.PureComponent<ItemProps> {
  render() {
    const { item } = this.props;

    switch (item.type) {
      case DevMenuItemEnum.ACTION:
        return <DevMenuItemAction item={item} />;
      case DevMenuItemEnum.GROUP:
        return <DevMenuItemsList items={item.items} />;
      default:
        return null;
    }
  }
}

class DevMenuItemAction extends React.PureComponent<ItemProps<DevMenuItemActionType>> {
  static contextType = DevMenuContext;

  action = (...args) => {
    dispatchActionAsync(...args);
    this.context?.collapse?.();
  };

  render() {
    const { actionId, isAvailable, label, detail, glyphName } = this.props.item;

    return (
      <StyledView
        style={styles.itemWrapper}
        lightBackgroundColor={Colors.light.secondaryBackground}
        lightBorderColor={Colors.light.border}
        darkBackgroundColor={Colors.dark.secondaryBackground}
        darkBorderColor={Colors.dark.border}>
        <DevMenuButton
          buttonKey={actionId}
          label={label || ''}
          onPress={this.action}
          icon={glyphName}
          isEnabled={isAvailable}
          detail={detail || ''}
        />
      </StyledView>
    );
  }
}

class DevMenuItemNavigation extends React.PureComponent<{
  route: string;
  label: string;
  glyphName: string;
}> {
  static contextType = NavigationContext;

  action = () => {
    this.context.push(this.props.route);
  };

  render() {
    const { route, label, glyphName } = this.props;

    return (
      <StyledView
        style={styles.itemWrapper}
        lightBackgroundColor={Colors.light.secondaryBackground}
        lightBorderColor={Colors.light.border}
        darkBackgroundColor={Colors.dark.secondaryBackground}
        darkBorderColor={Colors.dark.border}>
        <DevMenuButton
          buttonKey={route}
          label={label || ''}
          onPress={this.action}
          icon={glyphName}
        />
      </StyledView>
    );
  }
}

export default class DevMenuItemsList extends React.PureComponent<Props> {
  render() {
    const { items } = this.props;

    return (
      <View>
        <View style={styles.group}>
          {items.map((item, index) => (
            <DevMenuItem key={index} item={item} />
          ))}
        </View>
        <View style={styles.group}>
          <DevMenuItemNavigation route="Settings" label="Settings" glyphName="settings-outline" />
          <DevMenuItemNavigation
            route="Test"
            label="Navigation and scroll test"
            glyphName="test-tube"
          />
        </View>
      </View>
    );
  }
}

const pixel = 2 / PixelRatio.get();

const styles = StyleSheet.create({
  group: {
    marginBottom: 10,
    marginHorizontal: -pixel,
  },
  itemWrapper: {
    borderTopWidth: pixel,
    borderBottomWidth: pixel,
    marginTop: -pixel,
  },
});
