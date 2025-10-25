import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
   Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  signInWithEmail, 
  signInWithPhone,
  verifyPhoneCode,
  clearError,
  sendMFACode,
  verifyMFACode,
  clearMFAState
} from '../redux/slices/authSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  
  const dispatch = useAppDispatch();
  const { 
    isLoading, 
    error, 
    requiresMFA, 
    mfaResolver, 
    verificationId,
    phoneNumberForMFA 
  } = useAppSelector((state) => state.auth);

  // Automatically send MFA code when MFA is required
  useEffect(() => {
    if (requiresMFA && mfaResolver && !verificationId) {
      dispatch(sendMFACode({ resolver: mfaResolver }));
    }
  }, [requiresMFA, mfaResolver, verificationId, dispatch]);

  // Handle phone login verification state
  useEffect(() => {
    if (isPhoneLogin && verificationId && !requiresMFA) {
      setIsVerifyingPhone(true);
    }
  }, [verificationId, isPhoneLogin, requiresMFA]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    dispatch(signInWithEmail({ email, password }));
  };

  const handleVerifyMFACode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit verification code');
      return;
    }
    
    if (verificationId && mfaResolver) {
      dispatch(verifyMFACode({ 
        verificationId, 
        verificationCode, 
        resolver: mfaResolver 
      }));
    }
  };

  const handlePhoneLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    // Format: +40712345678 (include country code)
    dispatch(signInWithPhone(phoneNumber));
  };

  const handleVerifyPhoneCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit verification code');
      return;
    }
    
    if (verificationId) {
      dispatch(verifyPhoneCode({ 
        verificationId, 
        verificationCode
      }));
    }
  };

  const handleResendCode = () => {
    if (mfaResolver) {
      dispatch(sendMFACode({ resolver: mfaResolver }));
    } else if (isPhoneLogin && phoneNumber) {
      dispatch(signInWithPhone(phoneNumber));
    }
  };

  const handleBackFromMFA = () => {
    dispatch(clearMFAState());
    setVerificationCode('');
    setPassword('');
    setIsVerifyingPhone(false);
  };

  const toggleLoginMethod = () => {
    setIsPhoneLogin(!isPhoneLogin);
    setIsVerifyingPhone(false);
    dispatch(clearError());
    dispatch(clearMFAState());
    setVerificationCode('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
  };

  // MFA Verification Screen (for email login with MFA)
  if (requiresMFA && verificationId) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}>
          
          <Text style={styles.title}>Autentificare in 2 pasi</Text>
          <Text style={styles.subtitle}>
            Introdu codul de 6 cifre trimis la {phoneNumberForMFA || 'your phone'}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="000000"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
            autoFocus
          />
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyMFACode}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verifica codul</Text>
            )}
          </TouchableOpacity>

          <View style={styles.mfaActions}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleResendCode}
              disabled={isLoading}>
              <Text style={styles.linkText}>Retrimite codul</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleBackFromMFA}
              disabled={isLoading}>
              <Text style={styles.linkText}>Inapoi la autentificare</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Phone Verification Screen (for phone-only login)
  if (isVerifyingPhone && verificationId) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}>
          
          <Text style={styles.title}>📱 Phone Verification</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {phoneNumber}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="000000"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
            autoFocus
          />
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyPhoneCode}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify & Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.mfaActions}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleResendCode}
              disabled={isLoading}>
              <Text style={styles.linkText}>Resend Code</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => {
                setIsVerifyingPhone(false);
                setVerificationCode('');
                dispatch(clearError());
              }}
              disabled={isLoading}>
              <Text style={styles.linkText}>Change Phone Number</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Main Login Screen
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <View style={styles.brandingRow}>
  <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
  <View style={styles.brandTextContainer}>
    <Text style={styles.brandTextLine1}>CRM MOBILE</Text>
    
  </View>
</View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Parola"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleEmailLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Autentificare</Text>
              )}
            </TouchableOpacity>
          </>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#cc3538',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#99c7ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
  },
  mfaActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  linkButton: {
    padding: 10,
  },

  linkText: {
    color: 'black',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  brandingRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 40,
},
logo: {
  width: 50,
  height: 50,
  marginRight: 12,
},
brandTextContainer: {
  flexDirection: 'column',
  alignItems: 'flex-start',
},
brandTextLine1: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#333',
},
brandTextLine2: {
  fontSize: 20,
  fontWeight: '600',
  color: '#007AFF',
  marginTop: 2,
},

});

export default LoginScreen;