import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import CustomButton from '../components/button';
import { Platform } from 'react-native';
import { userStore } from '../stores/userStore';
import axios from 'axios';

interface Transaction {
    transactionId: string;
    landId: string;
    buyerId: string;
    sellerId: string;
    initialDeposit: string;
    initialDepositStatus: "paid" | "notpaid";
    monthlyDue: string;
    totalMonths: number;
    buyerApproved: boolean;
    sellerApproved: boolean;
    payments: [{month : number, paid : boolean}] | null; 
    transactionDate: string;
    lastTransactionDate : string
}

type RootStackParamList = {
    Transaction : {trans : string}
}

type TransactionRouteProp = RouteProp<RootStackParamList, "Transaction">;

const Transaction = () => {
    const route = useRoute<TransactionRouteProp>()
    const { trans } = route.params;

    const [transaction, setTransaction] = useState<Transaction>()    

    useEffect(() => {
        console.log(trans)
        setTransaction(JSON.parse(trans))
    }, [])

    const handlePayStatements = async () => {
        try {
            if(!userStore.getState().token){
                Alert.alert("Sorry", "Please Login")
                return;
            }
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;

            const res = await axios.post(
                `${apiUrl}/transactions/buyer/payAdvance`,
                {
                    landId : transaction?.landId,
                    transactionId : transaction?.transactionId
                },
                {
                    headers : {
                        Authorization : `Bearer ${userStore.getState().token}`
                    }
                }
            )

            if(res.status === 200){
                setTransaction(res.data.transaction)
                Alert.alert("Success", res.data.message)
            }
            else{
                Alert.alert("Oops!", "Something went wrong, Try again later")
            }
        } catch (error : any) {
            Alert.alert("OOPS", error.message)
        }
    }

    const handleMonthlyPayments = async () => {
        try {
             if(!userStore.getState().token){
                Alert.alert("Sorry", "Please Login")
                return;
            }
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;

            const res = await axios.post(
                `${apiUrl}/transactions/buyer/payMonths`,
                {
                    transactionId : transaction?.transactionId
                },
                {
                    headers : {
                        Authorization : `Bearer ${userStore.getState().token}`
                    }
                }
            )

             if(res.status === 200){
                setTransaction(res.data.transaction)
                Alert.alert("Success", res.data.message)
            }
            else if(res.status == 201){
                Alert.alert("Success", res.data.message)
            }
            else{
                Alert.alert("Oops!", "Something went wrong, Try again later")
            }
        } catch (error : any) {
            Alert.alert("OOPS", error.message)
        }
    }

    return (
        <ScrollView className="flex-1 bg-green-50 p-4">
            {transaction && (
            <View key={transaction.transactionId} className="mb-4">
                <Text className='font-semibold text-2xl text-center m-1'>Transaction</Text>
                {/* Transaction Card */}
                <View className={`bg-white p-4 mb-4 rounded-lg border border-green-200 ${Platform.OS === 'ios' ? 'shadow-sm' : 'shadow-md'}`}>
                <Text className="text-gray-700 text-base mb-1">Initial Deposit: ₹{transaction.initialDeposit}</Text>
                <Text className="text-gray-700 text-base mb-1">Deposit Status: {transaction.initialDepositStatus}</Text>
                <Text className="text-gray-700 text-base mb-1">Monthly Due: ₹{transaction.monthlyDue}</Text>
                <Text className="text-gray-700 text-base mb-1">Total Months: {transaction.totalMonths}</Text>
                <Text className="text-gray-700 text-base mb-1">Buyer Approved: {transaction.buyerApproved ? "Approved" : "Not Approved"}</Text>
                <Text className="text-gray-700 text-base mb-1">Seller Approved: {transaction.sellerApproved ? "Approved" : "Not Approved"}</Text>
                <Text className="text-gray-700 text-base mb-1">Transaction Date: {new Date(transaction.transactionDate).toDateString()}</Text>
                <Text className="text-gray-700 text-base mb-2">Last Transaction Date: {new Date(transaction.lastTransactionDate).toDateString()}</Text>

                {/* Payments List */}
                {transaction.payments && transaction.payments.length > 0 ? (
                    <View className="mt-2">
                    {transaction.payments.map((item, idx) => (
                        <Text
                        key={idx}
                        className={`mb-1 px-2 py-1 rounded-full ${item.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                        Month: {item.month} - {item.paid ? "Paid" : "Not Paid"}
                        </Text>
                    ))}
                    </View>
                ) : (
                    <Text className="text-gray-500 mt-2">No Rent Paid</Text>
                )}
                </View>

                {/* Buttons */}
                <View className="flex justify-center w-full items-center">
                {!transaction.buyerApproved ? (
                    <CustomButton text="Pay Advance" onPress={handlePayStatements} />
                ) : (
                    <CustomButton text="Pay Monthly Due" onPress={handleMonthlyPayments} />
                )}
                </View>
            </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default Transaction;
