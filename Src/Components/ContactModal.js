import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ContactModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    const subject = `Message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const emailUrl = `mailto:info@bellelonlimited.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl)
      .then(() => {
        setName('');
        setEmail('');
        setMessage('');
        onClose();
      })
      .catch(() => {
        Alert.alert('Error', 'Could not open mail app.');
      });
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <Text style={styles.heading}>Contact US</Text>

              <TextInput
                placeholder="Your Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Your Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Your Message"
                placeholderTextColor="#999"
                multiline
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
              />

              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send Message</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ContactModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginBottom: hp('1.5%'),
    fontSize: wp('4%'),
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    height: hp('15%'),
    textAlignVertical: 'top',
    fontSize: wp('4%'),
    marginBottom: hp('2%'),
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
  cancelButton: {
    marginTop: hp('2%'),
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: wp('4%'),
  },
});
