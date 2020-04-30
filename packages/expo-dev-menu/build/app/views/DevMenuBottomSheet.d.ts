import React from 'react';
import { EventSubscription } from 'react-native';
import Animated from 'react-native-reanimated';
import DevMenuMainScreen from '../screens/DevMenuMainScreen';
import BottomSheet from './BottomSheet';
declare type Props = {
    uuid: string;
    showOnboardingView: boolean;
};
declare class DevMenuBottomSheet extends React.PureComponent<Props, any> {
    ref: React.RefObject<BottomSheet>;
    snapPoints: (string | number)[];
    callbackNode: Animated.Value<0>;
    backgroundOpacity: Animated.Node<number>;
    closeSubscription: EventSubscription | null;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    collapse: () => void;
    expand: () => void;
    onCloseEnd: () => void;
    providedContext: {
        expand: () => void;
        collapse: () => void;
    };
    trackCallbackNode: Animated.Node<number>;
    screens: {
        name: string;
        component: typeof DevMenuMainScreen;
        options: {
            headerShown: boolean;
        };
    }[];
    render(): JSX.Element;
}
export default DevMenuBottomSheet;
