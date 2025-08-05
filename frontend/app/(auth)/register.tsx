import React, { useState } from 'react';
import { Text, View } from 'react-native';
import TextField from '../../components/form/textInput';
import FormButton from '../../components/form/button';
import { Form, Formik } from 'formik';
import Label from '../../components/form/label';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';

const Index = () => {
    const [form, setForm] = useState<string>('');
    const [datePicker, setShowDatePicker] = useState<boolean>(false)

    return (
            <Formik
                initialValues={{
                    userName : '',
                    email : '',
                    mobile : '',
                    password : '',
                    confirmPassword : '',
                    dob : null,
                }}
                onSubmit={(values) => console.log(values)}
            >
                {({ 
                    handleChange, 
                    handleBlur, 
                    handleSubmit, 
                    values
                }) => (
                   <View className='flex-1 justify-center items-center gap-4 p-2'>
                        <View className='w-[90%] justify-center gap-2'>
                            <Label text='UserName' required></Label>
                            <TextField
                                value={values.userName}
                                onChangeText={handleChange('userName')}
                                placeholder='UserName'
                                onBlur={handleBlur('userName')}
                           />
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
                        </View>

                        <View className='w-[90%] justify-center gap-2'>
                            <Label text='Mobile Number' required></Label>
                            <TextField
                                value={values.mobile}
                                onChangeText={handleChange('mobile')}
                                placeholder='+91-9xxxx xxxxx'
                                onBlur={handleBlur('mobile')}
                                keyboardType='phone-pad'
                           />
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
                        </View>

                        <View className='w-[90%] justify-center gap-2'>
                            <Label text='Confirm Password' required />
                            <TextField
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPasswor')}
                                placeholder='Re-enter password'
                                onBlur={handleBlur('confirmPassword')}
                                secureTextEntry={true}
                                autoCapitalize='none'
                            />
                        </View>

                        <View className='w-full items-center'>
                            <FormButton text='Register'onPress={handleSubmit}/>
                        </View>
                   </View>
                )}
            </Formik>
    );
}


export default Index;
