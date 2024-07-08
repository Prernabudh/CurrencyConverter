import {TouchableOpacity, Image, StyleSheet, Animated} from 'react-native';
import React, {useRef, useState} from 'react';
import InterchangeImage from '../../../../assets/images/interchange-image.png';

type Props = {
  isFlipValid: Boolean;
  handleFlip: () => void;
};

const InterchangeArrow = ({isFlipValid, handleFlip}: Props) => {
  const [isRotated, setIsRotated] = useState(false);
  const arrowAnimation = useRef(new Animated.Value(0));

  const flip = () => {
    Animated.timing(arrowAnimation.current, {
      toValue: isRotated ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsRotated(r => !r);
    });
  };

  const rotate = arrowAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const onPress = () => {
    handleFlip();
    flip();
  };

  return (
    <Animated.View
      style={[
        {
          opacity: isFlipValid ? 1 : 0.5,
        },
        {
          transform: [{rotateX: rotate}],
        },
      ]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={!isFlipValid}
        activeOpacity={1}>
        <Image source={InterchangeImage} style={styles.image} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
});

export default InterchangeArrow;
