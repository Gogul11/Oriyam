import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import TextField from '../../components/form/textInput';
import Label from '../../components/form/label';
import CustomButton from '../../components/button';
import CountryPickerComponent from '../../components/form/CountryPicker';
import { RegisterModalComponent } from '../../components/RegisterModal';
import { router } from 'expo-router';

import { registerFormInitialValues, getRegisterFormValidation, eighteenYearsAgo } from '../../utils/registerPageUtils';
import { registerUser } from '../../api/auth';
import { calculateAge } from '../../utils/calculateAgeUtils';

const Index = () => {
  const [datePicker, setShowDatePicker] = useState<boolean>(false);
  const [showCountryCode, setShowCountryCode] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedIdType, setSelectedIdType] = useState<'aadhar' | 'pan' | 'voter'>('aadhar');

  const handleRegister = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const age = calculateAge(values.dob);
      const payload: any = {
        username: values.userName,
        email: values.email,
        mobile: values.mobile,
        mobileCountryCode: values.mobileCountryCode,
        password: values.password,
        age,
        dateofbirth: values.dob,
        gov_id_type: selectedIdType,
      };

      if (selectedIdType === 'aadhar') payload.goverment_id = values.aadharCardNumber;
      if (selectedIdType === 'pan') payload.goverment_id = values.panCardNumber;
      if (selectedIdType === 'voter') payload.goverment_id = values.voterId;

      console.log("Registration Payload:", payload);
      await registerUser(payload);

      alert('✅ Registered successfully!');
      router.push('/login');
    } catch (err: any) {
      alert('❌ ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
        <Formik
          initialValues={registerFormInitialValues}
          validationSchema={getRegisterFormValidation(selectedIdType)}
          onSubmit={(values, helpers) => handleRegister(values, helpers.setSubmitting)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
            <View className='flex-1 justify-center items-center gap-4 p-2'>
              {/* Header */}
              <View className='items-center mb-6'>
                <Text className='text-2xl font-bold text-gray-900'>Register with Oriyam</Text>
                <Text className='text-md text-gray-500 mt-1'>Already registered?</Text>
                <Text
                  className='text-md text-blue-600 underline mt-1'
                  onPress={() => router.push('/login')}
                >
                  Login
                </Text>
              </View>

              {/* User Name */}
              <View className='w-[90%] justify-center gap-2'>
                <Label text='UserName' required />
                <TextField
                  value={values.userName}
                  onChangeText={handleChange('userName')}
                  placeholder='UserName'
                  onBlur={handleBlur('userName')}
                />
                {errors.userName && <Text className='text-red-500'>{errors.userName}</Text>}
              </View>

              {/* Email */}
              <View className='w-[90%] justify-center gap-2'>
                <Label text='Email ID' />
                <TextField
                  value={values.email}
                  onChangeText={handleChange('email')}
                  placeholder='example@domain.com'
                  onBlur={handleBlur('email')}
                  keyboardType='email-address'
                />
                {errors.email && <Text className='text-red-500'>{errors.email}</Text>}
              </View>

              {/* Mobile */}
              <View className='w-[90%] justify-center gap-2'>
                <Label text='Mobile Number' required />
                <View className='flex flex-row w-full'>
                  <TouchableOpacity
                    className='w-[20%] border border-gray-400 flex justify-center items-center rounded-lg bg-black/10'
                    onPress={() => setShowCountryCode(true)}
                  >
                    <Text>{values.mobileCountryCode}</Text>
                  </TouchableOpacity>
                  <View className='w-[80%]'>
                    <TextField
                      value={values.mobile}
                      onChangeText={handleChange('mobile')}
                      placeholder='XXXXX XXXXX'
                      onBlur={handleBlur('mobile')}
                      keyboardType='phone-pad'
                    />
                  </View>
                  <CountryPickerComponent
                    show={showCountryCode}
                    setShow={setShowCountryCode}
                    setFieldValue={setFieldValue}
                    fieldValue='mobileCountryCode'
                  />
                </View>
                {errors.mobileCountryCode && <Text className='text-red-500'>{errors.mobileCountryCode}</Text>}
                {errors.mobile && <Text className='text-red-500'>{errors.mobile}</Text>}
              </View>

              {/* Password */}
              <View className='w-[90%] justify-center gap-2'>
                <Label text='Password' required />
                <TextField
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholder='Enter password'
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  autoCapitalize='none'
                />
                {errors.password && <Text className='text-red-500'>{errors.password}</Text>}
              </View>

              {/* Confirm Password */}
              <View className='w-[90%] justify-center gap-2'>
                <Label text='Confirm Password' required />
                <TextField
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  placeholder='Re-enter password'
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry
                  autoCapitalize='none'
                />
                {errors.confirmPassword && <Text className='text-red-500'>{errors.confirmPassword}</Text>}
              </View>

              {/* DOB */}
              <View className='w-[90%] justify-center gap-2'>
                <Label text='Date of Birth' required />
                <TouchableOpacity
                  className='p-3 border border-gray-300 rounded-md bg-black/10'
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{values.dob ? values.dob.toDateString() : 'Select Date of Birth'}</Text>
                </TouchableOpacity>
                {datePicker && (
                  <RNDateTimePicker
                    mode='date'
                    value={values.dob}
                    maximumDate={eighteenYearsAgo}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setFieldValue('dob', selectedDate);
                    }}
                  />
                )}
                {errors.dob && <Text className='text-red-500'>{errors.dob as string}</Text>}
              </View>

              {/* ID Type */}
              <View className='w-[90%] justify-center gap-2'>
                <Label text='Select ID Type' required />
                <View className='border border-gray-300 rounded-md'>
                  <Picker
                    selectedValue={selectedIdType}
                    onValueChange={(itemValue) => setSelectedIdType(itemValue)}
                    mode='dropdown'
                  >
                    <Picker.Item label='Aadhar Card' value='aadhar' />
                    <Picker.Item label='PAN Card' value='pan' />
                    <Picker.Item label='Voter ID' value='voter' />
                  </Picker>
                </View>
              </View>

              {/* ID Input */}
              <View className='w-[90%] justify-center gap-2'>
                {selectedIdType === 'aadhar' && (
                  <>
                    <Label text='Aadhar Number' required />
                    <TextField
                      value={values.aadharCardNumber}
                      onChangeText={handleChange('aadharCardNumber')}
                      placeholder='XXXX XXXX XXXX'
                      onBlur={handleBlur('aadharCardNumber')}
                      keyboardType='phone-pad'
                    />
                    {errors.aadharCardNumber && <Text className='text-red-500'>{errors.aadharCardNumber}</Text>}
                  </>
                )}
                {selectedIdType === 'pan' && (
                  <>
                    <Label text='PAN Number' required />
                    <TextField
                      value={values.panCardNumber}
                      onChangeText={handleChange('panCardNumber')}
                      placeholder='ABCDE1234F'
                      onBlur={handleBlur('panCardNumber')}
                    />
                    {errors.panCardNumber && <Text className='text-red-500'>{errors.panCardNumber}</Text>}
                  </>
                )}
                {selectedIdType === 'voter' && (
                  <>
                    <Label text='Voter ID' required />
                    <TextField
                      value={values.voterId}
                      onChangeText={handleChange('voterId')}
                      placeholder='AB1234567'
                      onBlur={handleBlur('voterId')}
                    />
                    {errors.voterId && <Text className='text-red-500'>{errors.voterId}</Text>}
                  </>
                )}
              </View>

              {/* Buttons */}
              <View className='w-full items-center'>
                <CustomButton text='View' onPress={() => setModalVisible(true)} />
              </View>

              <View className='w-full items-center'>
                <CustomButton text='Register' onPress={handleSubmit} />
              </View>

              <RegisterModalComponent showModal={modalVisible} setShowModal={setModalVisible} values={values} />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Index;
