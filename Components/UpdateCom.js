import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions, TouchableOpacity, TextInput, TouchableWithoutFeedback, Button, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native';
// database
import { getDatabase, ref, set } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const width = Dimensions.get('window').width

const UpdateCom = ({ route }) => {
    const navigation = useNavigation()
    const [itemUpdate, setItemUpdate] = useState(route.params.item)
    const [content, setContent] = useState(itemUpdate.content)
    const [uri, setUri] = useState(itemUpdate.image)
    const [user, setUser] = useState()
    const avatarDefault = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/1100px-Ben_Affleck_by_Gage_Skidmore_3.jpg'

    useEffect(() => {
        _getUserCurrent()
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

    const _handleUpdate = () => {
        if (!content || !uri) {
            Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!!!')
            return
        }

        if (typeof (itemUpdate.cmts) == 'undefined')
            itemUpdate.cmts = [];

        const db = getDatabase()
        set(ref(db, `Posts/${itemUpdate.id}`), {
            content: content ? content : itemUpdate.content,
            image: uri ? uri : itemUpdate.image,
            createdAt: itemUpdate.createdAt,
            id: itemUpdate.id,
            admin: {
                email: (user.displayName) ? user.displayName : user.email,
                avatar: user.photoURL ? user.photoURL : 'https://cdn-icons-png.flaticon.com/512/1/1819.png',
            },
            cmts: [
                ...itemUpdate.cmts
            ]
        })
            .then(() => {
                navigation.navigate('HomeCom')
            })
            .catch((err) => {
                Alert.alert('Opps', err)
            })
    }

    const _handleClearImage = () => {
        setUri(null)
    }

    const _getUserCurrent = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user);
                setUser(user)
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
                    <Button title='Cập nhật' onPress={_handleUpdate} />
                </View>
                <View style={styles.viewHeader}>
                    <Image style={styles.avatar}
                        source={{ uri: itemUpdate.admin.avatar ? itemUpdate.admin.avatar : 'https://cdn-icons-png.flaticon.com/512/1/1819.png' }} />
                    <Text style={styles.textEmail}>
                        {
                            (user) ? user.email : 'admin@gmail.com'
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

export default UpdateCom

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