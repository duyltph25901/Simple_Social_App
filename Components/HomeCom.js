import { StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, Dimensions, Image, ActivityIndicator, TouchableOpacity, Alert, AsyncStorage, Share } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Dialog from "react-native-dialog";
// database
import { getDatabase, onValue, remove, ref, set } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const width = Dimensions.get('window').width

const HomeCom = () => {

    const [posts, setPost] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [emailUser, setEmailUser] = useState('')
    const [isOpenDialogCmt, setOpenDialogCmt] = useState(false)
    const [user, setUser] = useState({})
    const avatarDefault = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/1100px-Ben_Affleck_by_Gage_Skidmore_3.jpg'
    const navigation = useNavigation()
    const [post, setPostItem] = useState(null)
    const [cmt, setCmt] = useState('')

    useEffect(() => {
        _getDatabase()
        _getUserCurren()
        console.log(`User current`);
        console.log(user);
    }, [])

    const _getDatabase = () => {
        const db = getDatabase()
        const postRef = ref(db, 'Posts/')
        onValue(postRef, (snapShot) => {
            const data = snapShot.val()
            var newPost
            data
                ? (
                    newPost = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }))
                )
                : null
            setPost(newPost)
            setLoading(false)
        })
    }

    const _handleCmt = () => {
        if (!cmt) {
            Alert.alert('Opps', 'Vui lòng điền bình luận!!!')
            return
        }

        console.log(post);

        const db = getDatabase()
        set(ref(db, `Posts/${post.id}`), {
            content: post.content,
            image: post.image,
            createdAt: post.createdAt,
            id: post.id,
            admin: {
                email: post.admin.email,
                avatar: post.admin.avatar ? post.admin.avatar : null
            },
            cmts: [
                ...post.cmts,
                {
                    avatar: user.photoURL ? user.photoURL : 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
                    emailUser: (user.displayName) ? user.displayName : user.email,
                    content: cmt,
                }
            ]
        })
            .then(() => {
                Alert.alert('Success', 'Bình luận đã được gửi!')
                setOpenDialogCmt(false)
                setCmt('')
            })
            .catch((err) => {
                Alert.alert('Opps', err)
            })
    }

    const _removePost = (item) => {
        Alert.alert('Xác nhận xóa', `Bạn có muốn xóa bài viết ${item.content} được đăng tải lúc ${item.createdAt} ?`, [
            {
                text: 'Hủy',
                style: 'cancel',
            },
            {
                text: 'Đồng ý',
                onPress: () => _handleRemovePost(item)
            }
        ])
    }

    const _handleRemovePost = (item) => {
        const db = getDatabase()
        remove(ref(db, `Posts/${item.id}`))
            .then(() => {
                Alert.alert('Success', 'Bạn đã xóa bài viết thành công!')
            })
            .catch((er) => {
                Alert.alert('Opps', err)
            })
    }

    const _update = (item) => {
        Alert.alert('Cập nhật', 'Bạn có muốn thay đổi bài viết?', [
            {
                text: 'Hủy',
                style: 'cancel'
            },
            {
                text: 'Đồng ý',
                onPress: () => navigation.navigate('UpdateComp', { item })
            }
        ])
    }

    const _getUserCurren = (item) => {
        // try {
        //     const value = await AsyncStorage.getItem('loginInfo')
        //     if (value !== null) {
        //         // lấy được dữ liệu
        //         setEmailUser(value);
        //     }
        // } catch (e) {
        //     // error reading value
        //     console.log('Error' + e);
        // }

        const auth = getAuth();
        onAuthStateChanged(auth, (userReturn) => {
            if (userReturn) {
                console.log(userReturn);
                setUser(userReturn)
            }
        });
    }

    const _onShare = async (item) => {
        try {
            const result = await Share.share({
                message: item.content,
                url: item.image
            })
                .then(() => { })
                .catch((err) => { console.log(err); })

            console.log('jaskfs');

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // navigation.navigate('Home', { user })
                    alert('Share thanh cong');
                } else {
                    alert('Share thanh cong');
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        (isLoading)
            ? (
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator />
                </SafeAreaView>
            )
            : (
                <SafeAreaView style={styles.container}>
                    <FlatList data={posts}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('PostItem', { item })
                                }}>
                                    <View style={styles.containerItem}>
                                        <View style={styles.viewHeader}>
                                            <Image source={{ uri: (item.admin.avatar) ? item.admin.avatar : avatarDefault }}
                                                style={styles.avatar} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.textEmailUser}>
                                                    {item.admin.email}
                                                </Text>
                                                <Text style={styles.textCreatedAt}>
                                                    (Admin) {'\n'}
                                                    Created At: {item.createdAt}
                                                </Text>
                                            </View>

                                            {
                                                (user.email == 'a@gmail.com') && (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity onPress={() => _update(item)}>
                                                            <Image source={require('../assets/moreVertical.png')}
                                                                style={[styles.icons, styles.color]} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => _removePost(item)}>
                                                            <Image source={require('../assets/removePost.png')}
                                                                style={[styles.icons, styles.color]} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                        </View>
                                        <View style={styles.viewTitle}>
                                            <Text>
                                                {(item.content.length >= 100) ? item.content.slice(0, 100) + '...' : item.content}
                                            </Text>
                                        </View>
                                        <Image source={{ uri: item.image }}
                                            style={styles.imagePost} />
                                        <View style={styles.viewFooter}>
                                            <TouchableOpacity onPress={() => {
                                                setOpenDialogCmt(true);
                                                if (typeof (item.cmts) == 'undefined')
                                                    item.cmts = [];
                                                setPostItem(item)
                                            }}>
                                                <View style={styles.viewContainerIcons}>
                                                    <Image source={require('../assets/coment.png')}
                                                        style={[styles.color, styles.icons]} />
                                                    <Text style={styles.color}>Bình luận</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => _onShare(item)}>
                                                <View style={styles.viewContainerIcons}>
                                                    <Image source={require('../assets/share.png')}
                                                        style={[styles.icons, styles.color]} />
                                                    <Text style={styles.color}>Chia sẻ</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }} />
                    {
                        (isOpenDialogCmt) && (
                            <View style={styles.container}>
                                <Dialog.Container visible={true}>
                                    <Dialog.Title>Bình luận bài viết</Dialog.Title>
                                    <Dialog.Description>
                                        Vui lòng nhập bình luận vào bên dưới.
                                    </Dialog.Description>
                                    <TextInput placeholder='Viết gì đó ...'
                                        placeholderTextColor={'gray'}
                                        style={{
                                            width: width,
                                            height: 60,
                                            paddingHorizontal: 12,
                                            fontSize: 14,
                                            color: 'white'
                                        }}
                                        value={cmt}
                                        onChangeText={(cmt) => setCmt(cmt)} />
                                    <Dialog.Button label="Hủy" onPress={() => setOpenDialogCmt(false)} />
                                    <Dialog.Button label="Bình luận"
                                        onPress={_handleCmt} />
                                </Dialog.Container>
                            </View>
                        )
                    }
                </SafeAreaView >
            )
    )
}

export default HomeCom

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignContent: 'center'
    },

    containerItem: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 500,
        marginVertical: 5,
    },

    viewHeader: {
        width: width,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },

    avatar: {
        height: 65,
        width: 65,
        resizeMode: 'cover',
        borderRadius: 100,
    },

    textEmailUser: {
        fontSize: 14,
        fontWeight: 'bold',
        marginStart: 12,
        color: '#7C4DAD'
    },

    textCreatedAt: {
        fontSize: 10,
        color: 'gray',
        marginStart: 12
    },

    viewTitle: {
        width: width,
        padding: 5
    },

    imagePost: {
        width: width,
        resizeMode: 'cover',
        flex: 1,
    },

    viewFooter: {
        width: width,
        height: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    icons: {
        height: 17,
        width: 17,
        marginEnd: 7
    },
    viewContainerIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    color: {
        color: '#670D95',
        tintColor: '#670D95'
    },
})