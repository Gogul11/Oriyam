import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, Modal } from 'react-native';
import TextField from '../../components/form/textInput';
import CustomButton from '../../components/button';
import { Formik } from 'formik';
import Label from '../../components/form/label';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';
import { eighteenYearsAgo, registerFormInitialValues, registerFormValidation } from '../../utils/registerPageUtils';
import CountryPickerComponent from '../../components/form/CountryPicker';
import { RegisterModalComponent } from '../../components/RegisterModal';
import { router } from 'expo-router';
import { registerUser } from '../../api/auth';
import { calculateAge } from "../../utils/calculateAgeUtils";


const handleRegister = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
  try {
    const age = calculateAge(values.dob);
    const payload = {
      username: values.userName,
      email: values.email,
      mobile: values.mobile,
      password: values.password,
      age,
      goverment_id: values.aadharCardNumber,
      dateofbirth: values.dob,
    };

    const res = await registerUser(payload);
    alert("✅ Registered successfully!");
    router.push("/login");
  } catch (err: any) {
    alert("❌ " + err.message);
  } finally {
    setSubmitting(false);
  }
};

const Index = () => {
    const [form, setForm] = useState<string>('');
    const [datePicker, setShowDatePicker] = useState<boolean>(false)

    const[showContryCode, setShowContryCode] = useState<boolean>(false)
    const[modalVisible, setModalVisible] = useState<boolean>(false)

    return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex : 1}}
            >
                <ScrollView contentContainerClassName='flex py-10'>
                    <Formik
                        initialValues={registerFormInitialValues}
                        onSubmit={(values, helpers) => handleRegister(values, helpers.setSubmitting)}
                        validationSchema={registerFormValidation}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            setFieldValue,
                            errors
                        }) => (
                            <View className='flex-1 justify-center items-center gap-4 p-2'>
                                <View className="items-center mb-6">
                                    <Text className="text-2xl font-bold text-gray-900">
                                        Register with Oriyam
                                    </Text>
                                    <Text className="text-md text-gray-500 mt-1">
                                        Already registered?
                                    </Text>
                                    <Text className="text-md text-blue-600 underline mt-1" onPress={() => router.push("/login")}>
                                        Login
                                    </Text>
                                </View>


                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='UserName' required></Label>
                                    <TextField
                                        value={values.userName}
                                        onChangeText={handleChange('userName')}
                                        placeholder='UserName'
                                        onBlur={handleBlur('userName')}
                                    />
                                    {errors.userName && <Text className='text-red-500'>{errors.userName}</Text>}
                                </View>

                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='Email ID'></Label>
                                    <TextField
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        placeholder='Oriyam@Oriyam.com'
                                        onBlur={handleBlur('email')}
                                        keyboardType='email-address'
                                    />
                                    {errors.email && <Text className='text-red-500'>{errors.email}</Text>}
                                </View>

                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='Mobile Number' required></Label>
                                    <View className='flex flex-row w-full'>
                                        <TouchableOpacity
                                            className='w-[20%] border border-gray-400 flex justify-center items-center rounded-lg bg-black/10 '
                                            onPress={() => setShowContryCode(true)}
                                        >
                                            <Text>
                                                {values.mobileCountryCode}
                                            </Text>
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
                                            show={showContryCode} 
                                            setShow={setShowContryCode} 
                                            setFieldValue={setFieldValue}
                                            fieldValue='mobileCountryCode' 
                                        />
                                    </View>
                                    {errors.mobileCountryCode && <Text className='text-red-500'>{errors.mobileCountryCode}</Text>}
                                    {errors.mobile && <Text className='text-red-500'>{errors.mobile}</Text>}
                                </View>

                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='Password' required />
                                    <TextField
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        placeholder='Enter password'
                                        onBlur={handleBlur('password')}
                                        secureTextEntry={true}
                                        autoCapitalize='none'
                                    />
                                    {errors.password && <Text className='text-red-500'>{errors.password}</Text>}
                                </View>

                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='Confirm Password' required />
                                    <TextField
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        placeholder='Re-enter password'
                                        onBlur={handleBlur('confirmPassword')}
                                        secureTextEntry={true}
                                        autoCapitalize='none'
                                    />
                                    {errors.confirmPassword && <Text className='text-red-500'>{errors.confirmPassword}</Text>}
                                </View>

                                <View className="w-[90%] justify-center gap-2">
                                    <Label text="Date of Birth" required />
                                    <TouchableOpacity
                                        className="p-3 border border-gray-300 rounded-md bg-black/10"
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text>
                                            {values.dob
                                                ? values.dob.toDateString()
                                                : "Select Date of Birth"}
                                        </Text>
                                    </TouchableOpacity>
                                    {datePicker && (
                                        <RNDateTimePicker
                                            mode="date"
                                            value={values.dob}
                                            maximumDate={eighteenYearsAgo}
                                            onChange={(event, selectedDate) => {
                                                setShowDatePicker(false);
                                                if (selectedDate) {
                                                    setFieldValue("dob", selectedDate);
                                                }
                                            }}
                                        />
                                    )}
                                    {errors.dob && <Text className='text-red-500'>{errors.dob as string}</Text>}
                                </View>

                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='AadharCard Number' required></Label>
                                    <TextField
                                        value={values.aadharCardNumber}
                                        onChangeText={handleChange('aadharCardNumber')}
                                        placeholder='XXXX XXXX XXXX'
                                        onBlur={handleBlur('aadharCardNumber')}
                                        keyboardType='phone-pad'
                                    />
                                    {errors.aadharCardNumber && <Text className='text-red-500'>{errors.aadharCardNumber}</Text>}
                                </View>

                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='PanCard Number' required></Label>
                                    <TextField
                                        value={values.panCardNumber}
                                        onChangeText={handleChange('panCardNumber')}
                                        placeholder='PanCard Number'
                                        onBlur={handleBlur('panCardNumber')}
                                    />
                                    {errors.panCardNumber && <Text className='text-red-500'>{errors.panCardNumber}</Text>}
                                </View>

                                <View className='w-[90%] justify-center gap-2'>
                                    <Label text='VoterId Number' required></Label>
                                    <TextField
                                        value={values.voterId}
                                        onChangeText={handleChange('voterId')}
                                        placeholder='Voter Id'
                                        onBlur={handleBlur('voterId')}
                                    />
                                    {errors.voterId && <Text className='text-red-500'>{errors.voterId}</Text>}
                                </View>

                                 <View className='w-full items-center'>
                                    <CustomButton text='View'onPress={() => setModalVisible(true)}/>
                                </View>

                                <View className='w-full items-center'>
                                    <CustomButton text='Register'onPress={handleSubmit}/>
                                </View>

                                <RegisterModalComponent showModal={modalVisible} setShowModal={setModalVisible} values={values}/>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
    );
}


export default Index;
