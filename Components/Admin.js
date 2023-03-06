import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Dialog from "react-native-dialog"
import * as ImagePicker from 'expo-image-picker'
// validate
import { isEmail, isPassword } from '../functions/validate'
// database
import { getAuth, onAuthStateChanged, updateProfile, updateEmail, updatePassword, deleteUser } from 'firebase/auth'

const width = Dimensions.get('window').width

const Admin = () => {

    const [isOpenDialogUpdate, setOpenDialogUpdate] = useState(false)
    const [inputUpdate, setInputUpdate] = useState('')
    const [user, setUser] = useState({})
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null) // permission gallery
    const [uri, setUri] = useState(null)
    const flagUpdateFullName = 1
    const flagUpdateEmail = 2
    const flagUpdatePass = 3
    const [flag, setFlag] = useState(flagUpdateFullName)
    const navigation = useNavigation()
    const avatarDefault = 'https://yt3.googleusercontent.com/ytc/AL5GRJXNe-49CInyBVI2ZvFRfHiGNKzItnZQzlDkSTKU6g=s176-c-k-c0x00ffffff-no-rj'

    useEffect(() => {
        _getUserCurrent()
        console.log(`User in ADmin`);
        console.log(user);

        // open gallery
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })()
    }, [])

    const _getUserCurrent = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (userReturn) => {
            if (userReturn) {
                console.log(userReturn);
                setUser(userReturn)
            }
        });
    }

    const _handleRemoveAccount = () => {
        Alert.alert('Xác nhận', 'Bạn có muốn xóa tài khoản hiện tại?', [
            {
                text: 'Hủy',
                style: 'cancel'
            },
            {
                text: 'Có',
                onPress: () => {
                    const auth = getAuth();
                    const user = auth.currentUser;

                    deleteUser(user).then(() => {
                        navigation.navigate('Login')
                        Alert.alert('Success', 'Xóa tài khoản thành công!')
                    }).catch((error) => {
                        Alert.alert('Opps', 'Có lỗi xảy ra!!!')
                        console.log(`Error remove account: ${error}`)
                    });
                }
            }
        ])
    }

    const _handleLogOut = () => {
        Alert.alert('Xác nhận', 'Bạn có muốn đăng xuất?', [
            {
                text: 'Hủy',
                style: 'cancel'
            },
            {
                text: 'Có',
                onPress: () => {
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
            }
        ])
    }

    const _handleUpdateFullName = () => {
        setOpenDialogUpdate(true)
        setFlag(flagUpdateFullName)
    }

    const _handleUpdatePass = () => {
        setOpenDialogUpdate(true)
        setFlag(flagUpdatePass)
    }

    const _handleUpdate = () => {
        const auth = getAuth()
        switch (flag) {
            case flagUpdateFullName: {
                if (!inputUpdate) {
                    Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!')
                    return
                }
                updateProfile(auth.currentUser, {
                    displayName: inputUpdate
                }).then(() => {
                    setInputUpdate('')
                    setOpenDialogUpdate(false)
                }).catch((error) => {
                    Alert.alert('Opps', 'Có lỗi xảy ra!!!')
                    console.log(`Error update full name ${error}`);
                });
                break
            } case flagUpdateEmail: {
                if (!inputUpdate) {
                    Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!')
                    return
                } if (!isEmail(inputUpdate)) {
                    Alert.alert('Opps', 'Email không đúng định dạng!')
                    return
                }
                updateEmail(auth.currentUser, inputUpdate).then(() => {
                    setInputUpdate('')
                    setOpenDialogUpdate(false)
                }).catch((error) => {
                    Alert.alert('Opps', 'Có lỗi xảy ra!!!')
                    console.log(`Error update email ${error}`);
                });
                break
            } case flagUpdatePass: {
                const user = auth.currentUser;
                const newPassword = inputUpdate

                if (!inputUpdate) {
                    Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!')
                    return
                } if (!isPassword(inputUpdate)) {
                    Alert.alert('Opps', 'Mật khẩu phải chứa ít nhất 6 kí tự!')
                    return
                }

                updatePassword(user, newPassword).then(() => {
                    setInputUpdate('')
                    setOpenDialogUpdate(false)
                }).catch((error) => {
                    Alert.alert('Opps', 'Có lỗi xảy ra!!!')
                    console.log(`Error update pass ${error}`);
                });
                break
            }
        }
    }

    const _handleUpdateCamera = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        console.log(result);
        if (!result.canceled) {
            setUri(null)
            setUri(result.assets[0].uri)
        }

        // update
        const auth = getAuth();
        await updateProfile(auth.currentUser, {
            photoURL: uri
        }).then(() => {
            // setUri(uri)
        }).catch((error) => {
            Alert.alert('Opps', 'Có lỗi xảy ra!')
            console.log(`Error update avatar: ${error}`);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={_handleUpdateCamera}>
                <Image source={{ uri: (user.photoURL) ? user.photoURL : avatarDefault }}
                    style={styles.avatar} />
            </TouchableOpacity>
            {
                (user.displayName) && (
                    <Text style={styles.textUserName}>
                        {user.displayName}
                    </Text>
                )
            }
            <Text style={styles.textEmail}>
                {user.email}
            </Text>
            <View style={styles.body}>
                <TouchableOpacity style={styles.containerButton}
                    onPress={_handleUpdateFullName}>
                    <Text style={styles.textButton}>
                        Chỉnh sửa tên
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.containerButton}
                    onPress={_handleUpdatePass}>
                    <Text style={styles.textButton}>
                        Chỉnh sửa mật khẩu
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.containerButtonNagative}
                    onPress={_handleLogOut}>
                    <Text style={styles.textButton}>
                        Đăng xuất
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.containerButtonNagative}
                    onPress={_handleRemoveAccount}>
                    <Text style={styles.textButton}>
                        Xóa tài khoản
                    </Text>
                </TouchableOpacity>
            </View>

            {
                (isOpenDialogUpdate) && (
                    <SafeAreaView>
                        <Dialog.Container visible={true}>
                            <Dialog.Title>Cập nhật</Dialog.Title>
                            <Dialog.Description>
                                Cập nhật thông tin
                            </Dialog.Description>
                            <TextInput placeholder={
                                (flag == 1) ? 'Chỉnh sửa tên...'
                                    : (
                                        (flag == 2) ? 'Chỉnh sửa email...' : 'Chỉnh sửa mật khẩu...'
                                    )
                            }
                                placeholderTextColor={'gray'}
                                style={{
                                    width: width,
                                    height: 60,
                                    paddingHorizontal: 12,
                                    fontSize: 14,
                                    color: 'white'
                                }}
                                value={inputUpdate}
                                onChangeText={(input) => setInputUpdate(input)} />
                            <Dialog.Button label="Hủy" onPress={() => {
                                setOpenDialogUpdate(false)
                                setInputUpdate('')
                            }} />
                            <Dialog.Button label="Cập nhật" onPress={_handleUpdate} />
                        </Dialog.Container>
                    </SafeAreaView>
                )
            }
        </SafeAreaView>
    )
}

export default Admin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 12
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 100
    },

    textUserName: {
        fontSize: 24,
        fontWeight: 'bold'
    },

    textEmail: {
        fontSize: 14,
        fontStyle: 'italic'
    },

    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    containerButton: {
        width: width - 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#522482',
        marginBottom: 12
    },

    textButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },

    containerButtonNagative: {
        width: width - 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#FF0033',
        marginBottom: 12
    }
})