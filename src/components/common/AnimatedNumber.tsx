import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type Props = {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: StyleProp<TextStyle>;
};

const AnimatedNumber: React.FC<Props> = ({
  value,
  decimals = 1,
  duration = 1500,
  prefix = '',
  suffix = '',
  style,
}) => {
  const sv = useSharedValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    sv.value = 0;
    sv.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration, sv]);

  useDerivedValue(() => {
    runOnJS(setDisplay)(sv.value.toFixed(decimals));
  }, [decimals]);

  return (
    <Text style={style}>
      {prefix}
      {display}
      {suffix}
    </Text>
  );
};

export default AnimatedNumber;
