import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                {
                    height: scale(50),
                    borderRadius: scale(8),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: scale(8),
                    backgroundColor:
                        variant === 'primary' ? colors.primary[500] : colors.Others.white,
                    borderWidth: variant === 'secondary' ? scale(1) : 0,
                    borderColor: variant === 'secondary' ? colors.primary[500] : 'transparent',
                    opacity: isDisabled ? 0.5 : 1,
                },
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? colors.Others.white : colors.primary[500]}
                />
            ) : (
                <Text
                    style={[
                        texts.body.medium.semibold,
                        {
                            color: variant === 'primary' ? colors.Others.white : colors.primary[500],
                        },
                        textStyle,
                    ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;
