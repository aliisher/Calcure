import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
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
import WebViewScreen from './Src/Screens/WebViewScreen.tsx';

const buttons = [
  ['C', 'π', '√', '^'],
  ['sin', 'cos', 'tan', 'log'],
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

function CalculatorScreen({
  showContactModal,
  setShowContactModal,
}: {
  showContactModal: boolean;
  setShowContactModal: (visible: boolean) => void;
}) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const isDark = useColorScheme() === 'dark';

  const handlePress = useCallback(
    (btn: string) => {
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
            .replace(/π/g, String(pi))
            .replace(/(\d)(π|[a-z(])/g, '$1*$2')
            .replace(/--/g, '+');

          let openParens = (expression.match(/\(/g) || []).length;
          let closeParens = (expression.match(/\)/g) || []).length;
          if (openParens > closeParens) {
            expression += ')'.repeat(openParens - closeParens);
          }

          const res = evaluate(expression);
          setResult(res.toString());
        } catch (error: any) {
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
    (btn: string) => {
      const isOperator = ['+', '-', '*', '/', '=', '^'].includes(btn);
      const isFunction = ['sin', 'cos', 'tan', 'log', '√', 'π'].includes(btn);
      const isClear = btn === 'C';

      // let backgroundColor;

      // if (isClear) {
      //   backgroundColor = isDark ? '#3D3D5C' : '#D4D4D6';
      // } else if (isOperator) {
      //   backgroundColor = '#FF9500';
      // } else if (isFunction) {
      //   backgroundColor = isDark ? '#2E2E3A' : '#E1E1E5';
      // } else {
      //   backgroundColor = isDark ? '#2E2E3A' : '#fff';
      // }
      let backgroundColor;

      if (isClear) {
        backgroundColor = isDark ? '#393E4B' : '#E0E4EC';
      } else if (isOperator) {
        backgroundColor = isDark ? '#0077CC' : '#0077CC';
      } else if (isFunction) {
        backgroundColor = isDark ? '#2A2E39' : '#D8DDE7';
      } else {
        backgroundColor = isDark ? '#2F343F' : '#FFFFFF';
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

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('SmartDigits Calculator')}
      >
        <Image
          source={require('../Calcure/Src/Images/calculator.png')}
          style={styles.drawerIcon}
        />
        <Text style={styles.drawerLabel}>SmartDigits Calculator</Text>
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
        onPress={() =>
          props.navigation.navigate('PrivacyPolicy', {
            htmlContent: `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #ffffff;
                    color: #000000;
                  }
                  h2 {
                    color: #0077CC;
                  }
                  h3 {
                    margin-top: 20px;
                  }
                  p, li {
                    line-height: 1.6;
                    font-size: 16px;
                  }
                </style>
              </head>
              <body>
                <h2>Privacy Policy for SmartDigits Calculator</h2>
                <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
                <p><strong>Effective Date:</strong> 29th July, 2025</p>
                <p>We are committed to protecting your privacy. This Privacy Policy outlines how the SmartDigits Calculator app (“we”, “our”, or “us”) handles your information.</p>
          
                <h3>1. Information Collection and Use</h3>
                <p>We want to assure you that SmartDigits Calculator does not collect, store, or share any personal data from users. Our calculator functions entirely offline and does not require access to your device’s personal information, files, contacts, or location.</p>
                <ul>
                  <li>We do not collect personally identifiable information.</li>
                  <li>We do not use cookies or tracking technologies.</li>
                  <li>We do not access or store any user content.</li>
                </ul>
          
                <h3>2. Data Security</h3>
                <p>As we do not collect any personal or sensitive information, no user data is stored on our servers. Your privacy and security are inherently protected through our app’s offline nature.</p>
          
                <h3>3. Third-Party Services</h3>
                <p>The SmartDigits Calculator does not integrate with any third-party services (e.g., analytics tools, ad networks, social platforms). Therefore, no data is shared with external services.</p>
          
                <h3>4. Children’s Privacy</h3>
                <p>Our app does not target children under the age of 13, and we do not knowingly collect any personal data from children.</p>
          
                <h3>5. Changes to This Privacy Policy</h3>
                <p>We may update this Privacy Policy from time to time. Any changes will be posted within the app or on our official website. Continued use of the app after changes are made signifies your acceptance of the updated policy.</p>
          
                <h3>6. Contact Us</h3>
                <p>If you have any questions or concerns regarding this Privacy Policy, please contact us.</p>
              </body>
            </html>
          `, // Replace below
          })
        }
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
        initialRouteName="SmartDigits Calculator"
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
        <Drawer.Screen name="SmartDigits Calculator">
          {props => (
            <CalculatorScreen
              {...props}
              showContactModal={showContactModal}
              setShowContactModal={setShowContactModal}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen
          name="PrivacyPolicy"
          component={WebViewScreen}
          options={{ headerShown: false }}
        />
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
    backgroundColor: '#0077CC',
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
