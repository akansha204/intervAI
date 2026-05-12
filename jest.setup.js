jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-gesture-handler', () => ({}));

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');

  const makeChainable = () => {
    const obj = {};
    return new Proxy(obj, { get: () => () => obj });
  };

  const identity = (v) => v;

  return {
    __esModule: true,
    default: {
      View: RN.View,
      createAnimatedComponent: (c) => c,
      call: () => {},
    },
    View: RN.View,
    Text: RN.Text,
    ScrollView: RN.ScrollView,
    Image: RN.Image,
    createAnimatedComponent: (c) => c,
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    useDerivedValue: () => ({ value: 0 }),
    useAnimatedReaction: () => {},
    withTiming: identity,
    withSpring: identity,
    withDecay: identity,
    withDelay: (_, v) => v,
    withSequence: (...vals) => vals[vals.length - 1],
    withRepeat: identity,
    cancelAnimation: () => {},
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    Easing: {
      linear: identity,
      ease: identity,
      cubic: identity,
      sin: identity,
      out: () => identity,
      in: () => identity,
      inOut: () => identity,
      bezier: () => identity,
    },
    FadeIn: makeChainable(),
    FadeOut: makeChainable(),
    FadeInUp: makeChainable(),
    FadeInDown: makeChainable(),
    FadeInLeft: makeChainable(),
    FadeInRight: makeChainable(),
    SlideInUp: makeChainable(),
    SlideInDown: makeChainable(),
    SlideInLeft: makeChainable(),
    SlideInRight: makeChainable(),
    ZoomIn: makeChainable(),
    Layout: makeChainable(),
  };
});
