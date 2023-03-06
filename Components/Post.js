import { Image, SafeAreaView, StyleSheet, Text, View, Dimensions, FlatList } from 'react-native'
import React, { useState } from 'react'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Post = ({ route }) => {

    const [post, setPost] = useState(route.params.item)
    const avatarDefault = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/1100px-Ben_Affleck_by_Gage_Skidmore_3.jpg'

    const cmtArr = post.cmts
    const [cmts, setCmts] = useState(cmtArr)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.avatar}
                    source={{ uri: (post.admin.avatar) ? post.admin.avatar : 'https://cdn-icons-png.flaticon.com/512/1/1819.png' }} />
                <View style={styles.textInfo}>
                    <Text style={styles.textEmail}>
                        {post.admin.email}
                    </Text>
                    <Text style={styles.textCretedAt}>
                        Created At: {post.createdAt}
                    </Text>
                </View>
            </View>
            <Image style={styles.image}
                source={{ uri: post.image }} />
            <FlatList style={styles.list}
                data={cmts}
                renderItem={({ item }) => {
                    return (
                        item.emailUser && item.content && (
                            <View style={{
                                width: width - 20,
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 12,
                                marginVertical: 12
                            }}>
                                <View style={styles.header}>
                                    <Image source={{ uri: (cmts.avatar) ? cmts.avatar : 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' }}
                                        style={styles.avatar} />
                                    <View style={styles.textInfo}>
                                        <Text style={styles.textEmail}>{
                                            item.emailUser
                                        }</Text>
                                    </View>
                                </View>
                                <Text style={{
                                    marginStart: 5
                                }}>
                                    {item.content}
                                </Text>
                            </View>
                        )
                    )
                }} />
        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    header: {
        width: width,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },

    avatar: {
        width: 65,
        height: 65,
        borderRadius: 100,
        marginEnd: 12
    },

    textInfo: {
        flex: 1,
        justifyContent: 'center'
    },
    textEmail: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    textCretedAt: {
        fontSize: 12,
        color: 'gray'
    },

    image: {
        width: width,
        height: 200,
        resizeMode: 'center'
    },

    list: {
        flex: 1,
        width: width,
        padding: 12
    }
})