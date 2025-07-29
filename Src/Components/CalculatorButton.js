import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CalculatorButton = React.memo(({ btn, onPress, getBtnStyle, isDark }) => (
  <TouchableOpacity style={getBtnStyle(btn)} onPress={() => onPress(btn)}>
    <Text
      style={{
        fontSize: wp('5.5%'),
        fontWeight: '600',
        color: ['+', '-', '*', '/', '=', '^'].includes(btn)
          ? '#fff'
          : isDark
          ? '#fff'
          : '#000',
      }}
    >
      {btn}
    </Text>
  </TouchableOpacity>
));

export default CalculatorButton;
