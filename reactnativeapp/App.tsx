import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import CheckBox from "@react-native-community/checkbox";
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Validation schemas
const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const App = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignUp = (values: { email: string; password: string }) => {
    Alert.alert('Success', 'Sign Up Successful');
    console.log('Signed Up with:', values);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    Alert.alert('Success', 'Login Successful');
    if (rememberMe) {
      await AsyncStorage.setItem('rememberedEmail', values.email);
    } else {
      await AsyncStorage.removeItem('rememberedEmail');
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return '';
    if (password.length < 6) return 'Weak';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return 'Strong';
    return 'Medium';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              accessibilityLabel="Email input"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              accessibilityLabel="Password input"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            <Text style={styles.passwordStrength}>
              Strength: {getPasswordStrength(values.password)}
            </Text>
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              accessibilityLabel="Confirm password input"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <Text style={styles.header}>Login</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              accessibilityLabel="Email input"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              accessibilityLabel="Password input"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={(newValue) => setRememberMe(newValue)}
                accessibilityLabel="Remember me checkbox"
              />
              <Text style={styles.checkboxLabel}>Remember Me</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  passwordStrength: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default App;
