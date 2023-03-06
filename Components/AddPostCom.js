import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions, TouchableOpacity, TextInput, TouchableWithoutFeedback, Button, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import * as ImagePicker from 'expo-image-picker'
// database
import { getDatabase, ref, set } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
// random
import uuid from 'react-native-uuid'

const width = Dimensions.get('window').width

const AddPostCom = () => {
    const [content, setContent] = useState('')
    const [uri, setUri] = useState(null)
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null) // permission gallery
    const [user, setUser] = useState()
    const avatarDefault = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/1100px-Ben_Affleck_by_Gage_Skidmore_3.jpg'

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })()

        test()
    }, [])

    const _openGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        console.log(result);
        if (!result.canceled) {
            setUri(result.assets[0].uri)
        }
    }

    const _handPost = () => {
        if (!content || !uri) {
            Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!!!')
            return
        }

        const db = getDatabase()
        const id = uuid.v4()
        const date = new Date().getDate()
        const month = new Date().getMonth() + 1
        const year = new Date().getFullYear()
        const hours = new Date().getHours()
        const min = new Date().getMinutes()
        const sec = new Date().getSeconds()
        set(ref(db, `Posts/${id}`), {
            id: id,
            content: content,
            image: uri,
            admin: {
                email: (user.displayName) ? user.displayName : user.email,
                avatar: user.photoURL ? user.photoURL : 'https://cdn-icons-png.flaticon.com/512/1/1819.png',
            },
            createdAt: `${date}/${month}/${year} ${hours}:${min}:${sec}`,
            cmts: [

            ]
        })

        Alert.alert('Success', 'Bài viết đã được đăng tải')
        setContent('')
        _handleClearImage()
    }

    const _handleClearImage = () => {
        setUri(null)
    }

    const test = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (userReturn) => {
            if (userReturn) {
                console.log(userReturn)
                console.log(userReturn.photoURL);
                setUser(userReturn)
            }

            /** profile user
             *  const displayName = user.displayName;
                const email = user.email;
                const photoURL = user.photoURL;
                const emailVerified = user.emailVerified;

             */
        });
    }

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <SafeAreaView style={styles.container}>
                <View style={{
                    width: width,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end'
                }}>
                    <Button title='Đăng' onPress={_handPost} />
                </View>
                <View style={styles.viewHeader}>
                    <Image style={styles.avatar}
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1/1819.png' }} />
                    <Text style={styles.textEmail}>
                        {
                            (!user)
                                ? 'admin@gmail.com'
                                : (
                                    user.displayName ? user.displayName : user.email
                                )
                        }
                    </Text>
                </View>
                <View style={styles.viewBody}>
                    <TextInput placeholder='Nhập gì đó...'
                        placeholderTextColor={'#343434'}
                        style={styles.input}
                        editable
                        multiline
                        numberOfLines={4}
                        value={content}
                        onChangeText={(content) => setContent(content)} />
                    {
                        (uri)
                            ? (
                                <View style={{
                                    width: width,
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    paddingEnd: 12,
                                    marginBottom: 12
                                }}>
                                    <TouchableOpacity onPress={_handleClearImage}>
                                        <Image source={require('../assets/remove.png')}
                                            style={{
                                                height: 35,
                                                width: 35
                                            }} />
                                    </TouchableOpacity>
                                </View>
                            )
                            : null
                    }
                    <TouchableOpacity style={styles.containerButton}
                        onPress={_openGallery}>
                        {
                            (uri)
                                ? (
                                    <Image source={{ uri: uri }}
                                        style={styles.image} />
                                )
                                : (
                                    <Image source={require('../assets/photo.png')}
                                        style={styles.chooseImage} />
                                )
                        }
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default AddPostCom

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center'
    },

    viewHeader: {
        width: width,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        height: 70,
        width: 70,
        borderRadius: 100,
        marginEnd: 10
    },

    textEmail: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },

    viewBody: {
        width: width,
        flex: 1,
        paddingTop: 12,
    },

    chooseImage: {
        height: 100,
        width: 100,
        resizeMode: 'cover'
    },

    input: {
        marginBottom: 21,
        fontSize: 18,
        color: 'black',
        marginHorizontal: 12
    },

    containerButton: {
        width: width,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover'
    },

    image: {
        width: width,
        height: 300,
        resizeMode: 'cover'
    }
})