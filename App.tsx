import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Linking,
  Image,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { evaluate, pi } from 'mathjs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ContactModal from './Src/Components/ContactModal';
import CalculatorButton from './Src/Components/CalculatorButton';

const buttons = [
  ['C', 'π', '√', '^'],
  ['sin', 'cos', 'tan', 'log'],
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

function CalculatorScreen({ showContactModal, setShowContactModal }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const isDark = useColorScheme() === 'dark';

  const handlePress = useCallback(
    btn => {
      const functions = ['sin', 'cos', 'tan', 'log', '√'];
      const operators = ['+', '-', '*', '/', '^'];

      if (btn === 'C') {
        setInput('');
        setResult('');
        return;
      }

      if (btn === '=') {
        try {
          let expression = input
            .replace(/√/g, 'sqrt')
            .replace(/π/g, pi)
            .replace(/(\d)(π|[a-z(])/g, '$1*$2')
            .replace(/--/g, '+');

          let openParens = (expression.match(/\(/g) || []).length;
          let closeParens = (expression.match(/\)/g) || []).length;
          if (openParens > closeParens) {
            expression += ')'.repeat(openParens - closeParens);
          }

          const res = evaluate(expression);
          setResult(res.toString());
        } catch (error) {
          console.log('Evaluation error:', error.message);
          setResult('Error');
        }
        return;
      }

      if (operators.includes(btn)) {
        if (input === '' || operators.includes(input.slice(-1))) return;
        setInput(prev => prev + btn);
        return;
      }

      if (functions.includes(btn)) {
        const funcWithParen = btn === '√' ? '√(' : `${btn}(`;
        const lastWord = input.match(/(sin|cos|tan|log|√)\($/);
        if (lastWord) {
          setInput(prev =>
            prev.replace(/(sin|cos|tan|log|√)\($/, funcWithParen),
          );
        } else {
          setInput(prev => prev + funcWithParen);
        }
        return;
      }

      if (btn === ')') {
        setInput(prev => prev + ')');
        return;
      }

      if (btn === 'π') {
        setInput(prev => prev + 'π');
        return;
      }

      setInput(prev => prev + btn);
    },
    [input],
  );

  const getBtnStyle = useCallback(
    btn => {
      const isOperator = ['+', '-', '*', '/', '=', '^'].includes(btn);
      const isFunction = ['sin', 'cos', 'tan', 'log', '√', 'π'].includes(btn);
      const isClear = btn === 'C';

      let backgroundColor;

      if (isClear) {
        backgroundColor = isDark ? '#3D3D5C' : '#D4D4D6';
      } else if (isOperator) {
        backgroundColor = '#FF9500';
      } else if (isFunction) {
        backgroundColor = isDark ? '#2E2E3A' : '#E1E1E5';
      } else {
        backgroundColor = isDark ? '#2E2E3A' : '#fff';
      }

      return {
        ...styles.button,
        backgroundColor,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      };
    },
    [isDark],
  );

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1E1E2C' : '#F1F1F5'}
        translucent={false}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#1E1E2C' : '#F1F1F5' },
        ]}
      >
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.resultBox}>
          <Text style={[styles.inputText, { color: isDark ? '#bbb' : '#333' }]}>
            {input}
          </Text>
          <Text
            style={[styles.resultText, { color: isDark ? '#fff' : '#000' }]}
          >
            = {result}
          </Text>
        </View>
        <View>
          {buttons.map((row, i) => (
            <View key={i} style={styles.buttonRow}>
              {row.map(btn => (
                <CalculatorButton
                  key={btn}
                  btn={btn}
                  onPress={handlePress}
                  getBtnStyle={getBtnStyle}
                  isDark={isDark}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <ContactModal
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Bellelon Calculator')}
      >
        <Image
          source={require('../Calcure/Src/Images/calculator.png')}
          style={styles.drawerIcon}
        />
        <Text style={styles.drawerLabel}>Bellelon Calculator</Text>
      </TouchableOpacity>

      <View style={styles.drawerDivider} />

      <TouchableOpacity
        style={styles.drawerItemChat}
        onPress={() => {
          props.navigation.closeDrawer();
          props.setShowContactModal(true);
        }}
      >
        <Image
          source={require('../Calcure/Src/Images/email.png')}
          style={styles.drawerIcon}
          tintColor={'white'}
        />
        <Text style={styles.drawerLabelChat}>Contact US</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItemChat}
        onPress={() => {
          Linking.openURL(
            'https://bellelonlimited.com/privacy-policy-for-bellelon-calculator/',
          );
        }}
      >
        <Image
          source={require('../Calcure/Src/Images/insurance.png')}
          style={styles.drawerIcon}
          tintColor={'white'}
        />
        <Text style={styles.drawerLabelChat}>Privacy Policy</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Bellelon Calculator"
        drawerContent={props => (
          <CustomDrawerContent
            {...props}
            setShowContactModal={setShowContactModal}
          />
        )}
        screenOptions={{
          headerShown: true,
          drawerType: 'slide',
          drawerStyle: {
            backgroundColor: '#f0f0f0',
            width: wp('65%'),
          },
        }}
      >
        <Drawer.Screen name="Bellelon Calculator">
          {props => (
            <CalculatorScreen
              {...props}
              showContactModal={showContactModal}
              setShowContactModal={setShowContactModal}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    justifyContent: 'flex-end',
  },
  resultBox: {
    marginBottom: hp('4%'),
    alignItems: 'flex-end',
  },
  inputText: {
    fontSize: wp('5%'),
    marginBottom: hp('1.5%'),
  },
  resultText: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('0.8%'),
  },
  button: {
    flex: 1,
    height: hp('7.5%'),
    marginHorizontal: wp('1%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerDivider: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    marginVertical: 12,
    marginHorizontal: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
  },
  drawerIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('3%'),
    resizeMode: 'contain',
    tintColor: '#555',
  },
  drawerLabel: {
    fontSize: wp('4.2%'),
    color: '#333',
  },
  drawerItemChat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('3%'),
    marginHorizontal: wp('3%'),
    marginBottom: hp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  drawerLabelChat: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: 'white',
  },
});
