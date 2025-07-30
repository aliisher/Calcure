// Src/Screens/WebViewScreen.tsx
import React from 'react';
import {
  View,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const WebViewScreen = ({ route, navigation }) => {
  const { htmlContent, url } = route.params || {};
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#1A1D23' : '#F9F9FC',
      }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <WebView
        originWhitelist={['*']}
        source={htmlContent ? { html: htmlContent } : { uri: url }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#0077CC',
  },
  backButton: {
    fontSize: wp('6%'),
    color: 'white',
    marginRight: wp('4%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WebViewScreen;
