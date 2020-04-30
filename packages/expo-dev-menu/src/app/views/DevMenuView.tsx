import React from 'react';
import { Clipboard, StyleSheet, PixelRatio, View } from 'react-native';

import DevMenuContext, { Context } from '../DevMenuContext';
import * as DevMenuInternal from '../DevMenuInternal';
import { StyledText } from '../components/Text';
import { StyledView } from '../components/Views';
import Colors from '../constants/Colors';
import DevMenuItemsList from './DevMenuItemsList';
import DevMenuTaskInfo from './DevMenuTaskInfo';

type Props = {
  appInfo: { [key: string]: any };
  uuid: string;
  devMenuItems: DevMenuInternal.DevMenuItemAnyType[];
  enableDevelopmentTools: boolean;
  showOnboardingView: boolean;
};

class DevMenuView extends React.PureComponent<Props, undefined> {
  static contextType = DevMenuContext;

  context!: Context;

  collapse = () => {
    this.context?.collapse?.();
  };

  onCopyTaskUrl = () => {
    const { manifestUrl } = this.props.appInfo;

    this.collapse();
    Clipboard.setString(manifestUrl);
    alert(`Copied "${manifestUrl}" to the clipboard!`);
  };

  renderItems() {
    const { appInfo } = this.props;
    const items: DevMenuInternal.DevMenuItemAnyType[] = [];

    items.push({
      type: DevMenuInternal.DevMenuItemEnum.ACTION,
      isAvailable: true,
      isEnabled: true,
      label: 'Reload',
      actionId: 'reload',
      glyphName: 'reload',
    });

    if (appInfo && appInfo.manifestUrl) {
      items.push({
        type: DevMenuInternal.DevMenuItemEnum.ACTION,
        isAvailable: true,
        isEnabled: true,
        label: 'Copy link to clipboard',
        actionId: 'copy',
        glyphName: 'clipboard-text',
      });
    }

    items.push({
      type: DevMenuInternal.DevMenuItemEnum.ACTION,
      isAvailable: true,
      isEnabled: true,
      label: 'Go to Home',
      actionId: 'home',
      glyphName: 'home',
    });

    if (this.context.enableDevelopmentTools && this.context.devMenuItems) {
      items.push(...this.context.devMenuItems);
    }
    return <DevMenuItemsList items={items} />;
  }

  renderContent() {
    const { appInfo } = this.props;

    return (
      <>
        <StyledView
          style={styles.appInfo}
          lightBackgroundColor={Colors.light.secondaryBackground}
          darkBackgroundColor={Colors.dark.secondaryBackground}>
          <DevMenuTaskInfo task={appInfo} />
        </StyledView>

        <View style={styles.itemsContainer}>{this.renderItems()}</View>
      </>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
        {/* Enable this to test scrolling
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()}
        {this.renderContent()} */}

        <View style={styles.footer}>
          <StyledText
            style={styles.footerText}
            lightColor={Colors.light.menuItemText}
            darkColor={Colors.dark.menuItemText}>
            This development menu will not be present in any release builds of this project.
          </StyledText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appInfo: {
    borderBottomWidth: 2 / PixelRatio.get(),
  },
  itemsContainer: {
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 3, // should be higher than zIndex of onboarding container
  },
  footer: {
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
  },
});

export default DevMenuView;
