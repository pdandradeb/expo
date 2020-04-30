import React from 'react';
import { Clipboard, StyleSheet, PixelRatio, View } from 'react-native';
import DevMenuContext from '../DevMenuContext';
import * as DevMenuInternal from '../DevMenuInternal';
import { StyledText } from '../components/Text';
import { StyledView } from '../components/Views';
import Colors from '../constants/Colors';
// import DevMenuCloseButton from './DevMenuCloseButton';
import DevMenuItemsList from './DevMenuItemsList';
import * as DevMenu from './DevMenuModule';
import DevMenuTaskInfo from './DevMenuTaskInfo';
let DevMenuView = /** @class */ (() => {
    class DevMenuView extends React.PureComponent {
        constructor() {
            super(...arguments);
            this.collapse = () => {
                this.context?.collapse?.();
            };
            this.onAppReload = () => {
                this.collapse();
                DevMenu.reloadAppAsync();
            };
            this.onCopyTaskUrl = () => {
                const { manifestUrl } = this.props.appInfo;
                this.collapse();
                Clipboard.setString(manifestUrl);
                alert(`Copied "${manifestUrl}" to the clipboard!`);
            };
            this.onGoToHome = () => {
                this.collapse();
                DevMenu.goToHomeAsync();
            };
            this.onPressDevMenuButton = key => {
                DevMenu.selectItemWithKeyAsync(key);
            };
        }
        renderItems() {
            const { appInfo } = this.props;
            const items = [];
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
            return React.createElement(DevMenuItemsList, { items: items });
        }
        renderContent() {
            const { appInfo } = this.props;
            return (React.createElement(React.Fragment, null,
                React.createElement(StyledView, { style: styles.appInfo, lightBackgroundColor: Colors.light.menuAppInfoBackground, lightBorderColor: Colors.light.menuAppInfoBorder, darkBackgroundColor: Colors.dark.menuAppInfoBackground, darkBorderColor: Colors.dark.menuAppInfoBorder },
                    React.createElement(DevMenuTaskInfo, { task: appInfo })),
                React.createElement(View, { style: styles.itemsContainer }, this.renderItems())));
        }
        render() {
            return (React.createElement(View, { style: styles.container },
                this.renderContent(),
                React.createElement(View, { style: styles.footer },
                    React.createElement(StyledText, { style: styles.footerText, lightColor: Colors.light.menuItemText, darkColor: Colors.dark.menuItemText }, "This development menu will not be present in any release builds of this project."))));
        }
    }
    DevMenuView.contextType = DevMenuContext;
    return DevMenuView;
})();
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appInfo: {
        borderBottomWidth: 2 / PixelRatio.get(),
    },
    itemsContainer: {
        paddingTop: 6,
    },
    closeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
        zIndex: 3,
    },
    footer: {
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 12,
    },
});
export default DevMenuView;
//# sourceMappingURL=DevMenuView.js.map