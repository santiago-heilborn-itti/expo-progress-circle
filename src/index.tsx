import { HalfCircleProps, PercentageCircleProps } from 'expo-progress-circle';
import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';

const direction = I18nManager.isRTL? 'right' : 'left';
const opDirection = I18nManager.isRTL? 'Left' : 'Right';

const styles = StyleSheet.create({
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftWrap: {
    position: 'absolute',
    top: 0,
    [`${direction}`]: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    [`borderTop${opDirection}Radius`]: 0,
    [`borderBottom${opDirection}Radius`]: 0,
  },
})

const PercentageCircle = ({
  color = '#f00',
  shadowColor = '#999',
  bgColor = '#e9e9ef',
  radius,
  borderWidth = 2,
  percent = 0,
  children = null,
  containerStyle = {},
  outerCircleStyle = {},
}: PercentageCircleProps) => {

  const percentToDegrees = (percent: number) => percent * 3.6;

  const computeDerivedState = () => {
    const percentage = Math.max(Math.min(100, percent), 0);
    const needHalfCircle2 = percentage > 50;
    var halfCircle1Degree = needHalfCircle2 ? 180 : percentToDegrees(percentage);
    var halfCircle2Degree = needHalfCircle2 ? percentToDegrees(percentage) : 0;
    return {
      halfCircle1Degree,
      halfCircle2Degree,
      halfCircle2Styles: {
        backgroundColor: needHalfCircle2
          ? color
          : shadowColor,
      },
    };
  };

  const HalfCircle = ({ rotateDegrees, halfCircleStyles }: HalfCircleProps) => {
    return (
      <View
        style={[
          styles.leftWrap,
          {
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <View
          style={[
            styles.halfCircle,
            {
              width: radius,
              height: radius * 2,
              borderRadius: radius,
              overflow: 'hidden',
              transform: [
                { translateX: radius / 2 },
                { rotate: `${rotateDegrees}deg` },
                { translateX: -radius / 2 },
              ],
              backgroundColor: color,
              ...halfCircleStyles,
            },
          ]}
        />
      </View>
    );
  };

  const InnerCircle = () => {
    const radiusMinusBorder = radius - borderWidth
    return (
      <View
        style={[
          styles.innerCircle,
          {
            width: radiusMinusBorder * 2,
            height: radiusMinusBorder * 2,
            borderRadius: radiusMinusBorder,
            backgroundColor: bgColor,
            ...containerStyle,
          },
        ]}
      >
        {children}
      </View>
    );
  };

  const {
    halfCircle1Degree,
    halfCircle2Degree,
    halfCircle2Styles,
  } = computeDerivedState();

  return (
    <View
      style={[
        styles.outerCircle,
        {
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: shadowColor,
          ...outerCircleStyle,
        },
      ]}
    >
      <HalfCircle rotateDegrees={halfCircle1Degree} />
      <HalfCircle rotateDegrees={halfCircle2Degree} halfCircleStyles={halfCircle2Styles} />
      <InnerCircle />
    </View>
  );
};

export default PercentageCircle;
