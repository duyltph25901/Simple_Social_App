import { StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback, TextInput, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
import Dialog from "react-native-dialog";
// database
import '../firebaseConfig'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorage } from 'react-native';
// function validate
import { isEmail, isPassword } from '../functions/validate'

const width = Dimensions.get('window').width
const heigth = Dimensions.get('window').height

const Login = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [emailF, setEmailF] = useState('')
    const [isOpenDialog, setOpenDialog] = useState(false)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        _clear()
    }, [])

    const _clear = () => {
        // clear storage
        AsyncStorage.clear();
        const auth = getAuth()
        auth.signOut()
            .then(() => {
                console.log(`User log out`);
                navigation.navigate('Login')
            })
            .catch((err) => {
                console.log(`Error log out: ${err}`);
            })
    }

    const _hanleLogin = async () => {
        if (!email || !pass) {
            Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!!!')
            return
        } if (!isEmail(email)) {
            Alert.alert('Opps', 'Email không đúng dịnhd dạng!!!')
            return
        }

        const auth = getAuth()
        await signInWithEmailAndPassword(auth, email, pass)
            .then((user) => {
                onAuthStateChanged(auth, (user) => {
                    AsyncStorage.setItem('loginInfo', email);
                    navigation.navigate('Home')
                });
            })
            .catch((err) => {
                Alert.alert('Opps', `${err}`)

                console.log('====================')
                console.log(`Error sign in: ${err}`);
                console.log('====================')
            })
    }

    const _register = () => {
        navigation.navigate('Register')
    }

    const _handleForgotPass = () => {
        if (!emailF) {
            Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!!!')
            return
        } if (!isEmail(emailF)) {
            Alert.alert('Opps', 'Email không đúng định dạng!!!')
            return
        }

        const auth = getAuth()
        sendPasswordResetEmail(auth, emailF)
            .then(() => {
                setOpenDialog(false)
                Alert.alert('Success', 'Đã gửi thông tin tới email của bạn!')
                setEmailF('')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        (isOpenDialog)
            ? (
                <View style={styles.container}>
                    <Dialog.Container visible={true}>
                        <Dialog.Title>Quên mật khẩu</Dialog.Title>
                        <Dialog.Description>
                            Vui lòng nhập email vào bên dưới.
                        </Dialog.Description>
                        <TextInput placeholder='Email'
                            style={styles.inputDialog}
                            value={emailF}
                            onChangeText={(email) => setEmailF(email)} />
                        <Dialog.Button label="Cancel" onPress={() => setOpenDialog(false)} />
                        <Dialog.Button label="Ok" onPress={_handleForgotPass} />
                    </Dialog.Container>
                </View>
            )
            : (
                (isLoading)
                    ? (
                        <SafeAreaView style={styles.container}>
                            <ActivityIndicator />
                        </SafeAreaView>
                    )
                    : (
                        <TouchableWithoutFeedback
                            onPress={dismissKeyboard}>
                            <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
                                <SafeAreaView style={styles.container}>
                                    <View style={styles.containerHeader}>
                                        <Text style={styles.textTitle}>
                                            Đăng nhập
                                        </Text>
                                    </View>
                                    <View style={styles.containerBody}>
                                        <TextInput placeholder='Email'
                                            style={styles.input}
                                            value={email}
                                            onChangeText={(email) => setEmail(email)}
                                            keyboardType='email-address' />
                                        <TextInput placeholder='Mật khẩu'
                                            style={styles.input}
                                            value={pass}
                                            onChangeText={(pass) => setPass(pass)}
                                            secureTextEntry={true} />
                                        <TouchableOpacity style={styles.containerButton}
                                            onPress={_hanleLogin} >
                                            <Text style={styles.textButton}>
                                                Đăng nhập
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setOpenDialog(true)}>
                                            <Text style={styles.textFogortPass}>
                                                Quên mật khẩu?
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.containerFooter}>
                                        <View style={styles.containerViewFooter}>
                                            <View style={styles.viewSupported} />
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                color: '#7C4DAD'
                                            }}>Hoặc</Text>
                                            <View style={styles.viewSupported} />
                                        </View>
                                        <TouchableOpacity style={styles.containerButton}
                                            onPress={_register} >
                                            <Text style={styles.textButton}>Tạo tài khoản mới</Text>
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </KeyboardAwareScrollView >
                        </TouchableWithoutFeedback >
                    )
            )
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: heigth,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },

    containerHeader: {
        flex: .5,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },

    containerBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
    },

    containerFooter: {
        flex: .4,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },

    textTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#7C4DAD'
    },

    input: {
        width: width - 20,
        height: 60,
        paddingHorizontal: 12,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#7C4DAD',
        marginBottom: 12,
        color: '#522482'
    },

    containerButton: {
        width: width - 20,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#522482',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },

    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },

    textFogortPass: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7C4DAD'
    },

    containerViewFooter: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },

    viewSupported: {
        width: 120,
        marginHorizontal: 12,
        height: 1,
        backgroundColor: '#7C4DAD'
    },

    inputDialog: {
        height: 60,
        paddingHorizontal: 12,
        marginHorizontal: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 2,
        color: 'white'
    }
})