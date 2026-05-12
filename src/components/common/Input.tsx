import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: object;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[{ marginBottom: scale(16) }, containerStyle]}>
      <Text
        style={[
          texts.body.small.semibold,
          { color: colors.Greyscale[800], marginBottom: scale(8) },
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[
          texts.body.medium.regular,
          {
            height: scale(50),
            borderWidth: scale(1),
            borderColor: error
              ? colors.Alert.Error[100]
              : colors.Greyscale[200],
            borderRadius: scale(8),
            paddingHorizontal: scale(16),
            color: colors.Greyscale[900],
            backgroundColor: colors.Others.white,
          },
        ]}
        placeholderTextColor={colors.Greyscale[400]}
        {...props}
      />
      {error && (
        <Text
          style={[
            texts.body.extraSmall.regular,
            { color: colors.Alert.Error[100], marginTop: scale(4) },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
