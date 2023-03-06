import { StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback, TextInput, TouchableOpacity, Dimensions, Alert, } from 'react-native'
import React, { useState } from 'react'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
// database
import '../firebaseConfig'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
// function validate
import { isEmail, isPassword } from '../functions/validate'

const width = Dimensions.get('window').width
const heigth = Dimensions.get('window').height

const Register = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const _handleRegister = () => {
        if (!email || !pass) {
            Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!!!')
            return
        } if (!isEmail(email)) {
            Alert.alert('Opps', 'Email không đúng định dạng!')
            return
        } if (!isPassword(pass)) {
            Alert.alert('Opps', 'Mật khẩu phải chứa ít nhất 6 kí tự!!!')
            return
        }

        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, pass)
            .then(() => {
                navigation.navigate('Login')
            })
            .catch((err) => {
                console.log('====================')
                console.log(`Error create account: ${err}`);
                Alert.alert('Opps', err)
                console.log('====================')
            })
    }

    return (
        <TouchableWithoutFeedback
            onPress={dismissKeyboard}>
            <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.containerHeader}>
                        <Text style={styles.textTitle}>
                            Đăng kí
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
                            onPress={_handleRegister}>
                            <Text style={styles.textButton}>
                                Đăng kí
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
                            }}>Bạn đã có tài khoản</Text>
                            <View style={styles.viewSupported} />
                        </View>
                        <TouchableOpacity style={styles.containerButton}
                            onPress={() => {
                                navigation.navigate('Login')
                            }}>
                            <Text style={styles.textButton}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}

export default Register

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
        width: 80,
        marginHorizontal: 12,
        height: 1,
        backgroundColor: '#7C4DAD'
    }
})