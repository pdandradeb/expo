import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { ThemeContext } from 'react-navigation';
import * as DevMenuInternal from '../DevMenuInternal';
import Colors from '../constants/Colors';
import DevMenuBottomSheet from './DevMenuBottomSheet';
function useUserSettings(renderId) {
    const [settings, setSettings] = React.useState({});
    React.useEffect(() => {
        async function getUserSettings() {
            const settings = await DevMenuInternal.getSettingsAsync();
            setSettings(settings);
        }
        getUserSettings();
    }, [renderId]);
    return settings;
}
export default class DevMenuRoot extends React.PureComponent {
    render() {
        return React.createElement(DevMenuApp, Object.assign({}, this.props));
    }
}
const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colors.light.menuBackground,
    },
};
const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: Colors.dark.menuBackground,
    },
};
function DevMenuApp(props) {
    const colorScheme = useColorScheme();
    const { preferredAppearance = 'no-preference' } = useUserSettings(props.uuid);
    let theme = preferredAppearance === 'no-preference' ? colorScheme : preferredAppearance;
    if (theme === 'no-preference') {
        theme = 'light';
    }
    return (React.createElement(AppearanceProvider, { style: styles.rootView },
        React.createElement(ThemeContext.Provider, { value: theme },
            React.createElement(NavigationContainer, { theme: colorScheme == 'dark' ? CustomDarkTheme : CustomLightTheme },
                React.createElement(DevMenuBottomSheet, Object.assign({}, props))))));
}
const styles = StyleSheet.create({
    rootView: {
        flex: 1,
    },
});
//# sourceMappingURL=DevMenuApp.js.map