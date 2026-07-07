import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { scale } from '../../helpers/scaler';

type Props = {
  progress: number;
  height?: number;
  duration?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
};

const AnimatedProgressBar: React.FC<Props> = ({
  progress,
  height = 8,
  duration = 900,
  color = colors.primary[500],
  trackColor = colors.Greyscale[100],
  style,
}) => {
  const width = useSharedValue(0);
  const clamped = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    width.value = withTiming(clamped, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, duration, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      style={[
        {
          height: scale(height),
          borderRadius: scale(height),
          backgroundColor: trackColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          fillStyle,
          {
            height: '100%',
            backgroundColor: color,
            borderRadius: scale(height),
          },
        ]}
      />
    </View>
  );
};

export default AnimatedProgressBar;
