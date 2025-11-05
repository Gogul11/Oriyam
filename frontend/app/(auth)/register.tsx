import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // Added for visual appeal

import TextField from '../../components/form/textInput';
import Label from '../../components/form/label';
import CustomButton from '../../components/button';
import CountryPickerComponent from '../../components/form/CountryPicker';
import { RegisterModalComponent } from '../../components/RegisterModal';
import { router } from 'expo-router';

import { registerFormInitialValues, getRegisterFormValidation, eighteenYearsAgo } from '../../utils/registerPageUtils';
import { registerUser } from '../../api/auth';
import { calculateAge } from '../../utils/calculateAgeUtils';

// --- Theme Colors ---
const PRIMARY_GREEN = '#1B5E20';
const LIGHT_BACKGROUND = '#F0FFF0';
const ACCENT_BLUE = '#3B82F6';

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
            dateofbirth: values.dob.toISOString().split('T')[0], // Ensure date format is correct for API
            gov_id_type: values.govIdType, // Changed to use Formik state for simplicity
        };

        // Note: The selectedIdType state should ideally be managed via Formik's setFieldValue for cleaner logic.
        // Keeping original logic structure but ensuring payload uses correct ID field:
        if (values.govIdType === 'aadhar') payload.goverment_id = values.aadharCardNumber;
        if (values.govIdType === 'pan') payload.goverment_id = values.panCardNumber;
        if (values.govIdType === 'voter') payload.goverment_id = values.voterId;


        console.log("Registration Payload:", payload);
        await registerUser(payload);

        alert('✅ Registered successfully!');
        router.push('/login');
    } catch (err: any) {
        alert('❌ Registration Failed: ' + err.message);
    } finally {
        setSubmitting(false);
    }
};

const Index = () => {
    const [datePicker, setShowDatePicker] = useState<boolean>(false);
    const [showCountryCode, setShowCountryCode] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    // Removed selectedIdType state for simplification, using Formik values instead.

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
                <View style={styles.formCard}>
                    <Formik
                        initialValues={registerFormInitialValues}
                        // Pass a dummy value for selectedIdType or update utils to accept Formik state/values.
                        validationSchema={getRegisterFormValidation(registerFormInitialValues.govIdType as 'aadhar' | 'pan' | 'voter')} 
                        onSubmit={(values, helpers) => handleRegister(values, helpers.setSubmitting)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => {
                            // Dynamically update validation schema when ID type changes
                            const currentValidationSchema = getRegisterFormValidation(values.govIdType as 'aadhar' | 'pan' | 'voter');

                            return (
                                <View style={styles.formBody}>
                                    {/* Header */}
                                    <View style={styles.headerContainer}>
                                        <Text style={styles.headerTitle}>Create Your Oriyam Account</Text>
                                        <Text style={styles.headerSubtitle}>Enter your details to get started.</Text>
                                        <TouchableOpacity
                                            style={styles.loginLink}
                                            onPress={() => router.push('/login')}
                                        >
                                            <Text style={styles.loginLinkText}>Already registered? Login</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* User Name */}
                                    <View style={styles.inputGroup}>
                                        <Label text='UserName' required />
                                        <TextField
                                            value={values.userName}
                                            onChangeText={handleChange('userName')}
                                            placeholder='Full Name or Username'
                                            onBlur={handleBlur('userName')}
                                        />
                                        {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}
                                    </View>

                                    {/* Email */}
                                    <View style={styles.inputGroup}>
                                        <Label text='Email ID' />
                                        <TextField
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            placeholder='example@domain.com'
                                            onBlur={handleBlur('email')}
                                            keyboardType='email-address'
                                        />
                                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                                    </View>

                                    {/* Mobile */}
                                    <View style={styles.inputGroup}>
                                        <Label text='Mobile Number' required />
                                        <View style={styles.mobileInputWrapper}>
                                            <TouchableOpacity
                                                style={styles.countryCodeButton}
                                                onPress={() => setShowCountryCode(true)}
                                            >
                                                <Text style={styles.countryCodeText}>{values.mobileCountryCode}</Text>
                                                <Ionicons name="caret-down" size={12} color="#4B5563" />
                                            </TouchableOpacity>
                                            <View style={{ flex: 3.5 }}>
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
                                        {errors.mobileCountryCode && <Text style={styles.errorText}>{errors.mobileCountryCode}</Text>}
                                        {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
                                    </View>

                                    {/* Password */}
                                    <View style={styles.inputGroup}>
                                        <Label text='Password' required />
                                        <TextField
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            placeholder='Enter password'
                                            onBlur={handleBlur('password')}
                                            secureTextEntry
                                            autoCapitalize='none'
                                        />
                                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                                    </View>

                                    {/* Confirm Password */}
                                    <View style={styles.inputGroup}>
                                        <Label text='Confirm Password' required />
                                        <TextField
                                            value={values.confirmPassword}
                                            onChangeText={handleChange('confirmPassword')}
                                            placeholder='Re-enter password'
                                            onBlur={handleBlur('confirmPassword')}
                                            secureTextEntry
                                            autoCapitalize='none'
                                        />
                                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                                    </View>

                                    {/* DOB */}
                                    <View style={styles.inputGroup}>
                                        <Label text='Date of Birth' required />
                                        <TouchableOpacity
                                            style={styles.datePickerButton}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <Ionicons name="calendar-outline" size={20} color="#4B5563" style={{ marginRight: 10 }} />
                                            <Text style={styles.datePickerText}>{values.dob ? values.dob.toDateString() : 'Select Date of Birth'}</Text>
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
                                        {errors.dob && <Text style={styles.errorText}>{errors.dob as string}</Text>}
                                    </View>

                                    {/* ID Type Picker */}
                                    <View style={styles.inputGroup}>
                                        <Label text='Select ID Type' required />
                                        <View style={styles.pickerWrapper}>
                                            <Picker
                                                selectedValue={values.govIdType}
                                                onValueChange={(itemValue) => setFieldValue('govIdType', itemValue)}
                                                mode='dropdown'
                                                style={styles.pickerStyle}
                                            >
                                                <Picker.Item label='Select an ID Type' value='' enabled={false} />
                                                <Picker.Item label='Aadhar Card' value='aadhar' />
                                                <Picker.Item label='PAN Card' value='pan' />
                                                <Picker.Item label='Voter ID' value='voter' />
                                            </Picker>
                                        </View>
                                    </View>

                                    {/* ID Input (Conditional) */}
                                    <View style={styles.inputGroup}>
                                        {values.govIdType === 'aadhar' && (
                                            <>
                                                <Label text='Aadhar Number' required />
                                                <TextField
                                                    value={values.aadharCardNumber}
                                                    onChangeText={handleChange('aadharCardNumber')}
                                                    placeholder='XXXX XXXX XXXX'
                                                    onBlur={handleBlur('aadharCardNumber')}
                                                    keyboardType='numeric'
                                                />
                                                {errors.aadharCardNumber && <Text style={styles.errorText}>{errors.aadharCardNumber}</Text>}
                                            </>
                                        )}
                                        {values.govIdType === 'pan' && (
                                            <>
                                                <Label text='PAN Number' required />
                                                <TextField
                                                    value={values.panCardNumber}
                                                    onChangeText={handleChange('panCardNumber')}
                                                    placeholder='ABCDE1234F'
                                                    onBlur={handleBlur('panCardNumber')}
                                                    autoCapitalize='characters'
                                                />
                                                {errors.panCardNumber && <Text style={styles.errorText}>{errors.panCardNumber}</Text>}
                                            </>
                                        )}
                                        {values.govIdType === 'voter' && (
                                            <>
                                                <Label text='Voter ID' required />
                                                <TextField
                                                    value={values.voterId}
                                                    onChangeText={handleChange('voterId')}
                                                    placeholder='AB1234567'
                                                    onBlur={handleBlur('voterId')}
                                                />
                                                {errors.voterId && <Text style={styles.errorText}>{errors.voterId}</Text>}
                                            </>
                                        )}
                                    </View>

                                    {/* Buttons */}
                                    <View style={styles.buttonRow}>
                                        <CustomButton
                                            text='View Details'
                                            onPress={() => setModalVisible(true)}
                                            ButtonClassName="bg-gray-400 flex-1 py-3 rounded-xl shadow-md mr-2"
                                            TextClassName="text-white text-center text-lg font-semibold"
                                        />
                                        <CustomButton
                                            text='Register'
                                            onPress={handleSubmit}
                                            ButtonClassName="bg-green-600 flex-1 py-3 rounded-xl shadow-lg ml-2"
                                            TextClassName="text-white text-center text-lg font-bold"
                                        />
                                    </View>

                                    <RegisterModalComponent showModal={modalVisible} setShowModal={setModalVisible} values={values} />
                                </View>
                            );
                        }}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: LIGHT_BACKGROUND,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    formCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        // Card Shadow
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10 },
            android: { elevation: 12 },
        }),
    },
    formBody: {
        gap: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_GREEN,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    loginLink: {
        marginTop: 8,
    },
    loginLinkText: {
        color: ACCENT_BLUE,
        textDecorationLine: 'underline',
        fontSize: 15,
        fontWeight: '600',
    },
    inputGroup: {
        gap: 8,
    },
    errorText: {
        color: '#EF4444', // Red
        fontSize: 12,
        marginTop: 4,
    },
    // Mobile Input Specific Styles
    mobileInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countryCodeButton: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 50,
        backgroundColor: '#F3F4F6', // Light gray background
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    countryCodeText: {
        fontSize: 16,
        color: '#374151',
    },
    // Date Picker Styles
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    datePickerText: {
        fontSize: 16,
        color: '#4B5563',
    },
    // Picker Styles
    pickerWrapper: {
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },
    pickerStyle: {
        height: 50,
        color: '#374151',
    },
    // Button Row
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 10,
    }
});

export default Index;