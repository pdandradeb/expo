import React from 'react';
import Animated from 'react-native-reanimated';
export default class DevMenuScreen extends React.PureComponent {
    containerHeightValue: Animated.Value<10000>;
    heightSet: boolean;
    onHeightMeasure: (height: number) => void;
    render(): JSX.Element;
}
