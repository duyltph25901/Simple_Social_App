import { FlatList, Image, SafeAreaView, StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
// database
import { getDatabase, ref, onValue } from 'firebase/database'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Videos = () => {
    const [videos, setVideos] = useState([])
    const [isLoading, setLoading] = useState(true)
    const navigation = useNavigation()

    const _getDatabase = () => {
        const db = getDatabase()
        const videoRef = ref(db, 'Videos')
        onValue(videoRef, (snapShot) => {
            const data = snapShot.val()
            var newVideo
            data
                ? (
                    newVideo = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key]
                    }))
                )
                : null
            setVideos(newVideo)
            setLoading(false)
        })
    }

    const _convertString = (input) => {
        result = String(input);
        switch (result.length) {
            case 1: {
                return result
            } case 2: {
                return result
            } case 3: {
                return result
            } case 4: {
                return result.slice(0, 1) + 'N'
            } case 5: {
                return result.slice(0, 2) + 'N'
            } case 6: {
                return result.slice(0, 3) + 'N'
            } case 7: {
                return result.slice(0, 1) + 'Tr'
            } case 8: {
                return result.slice(0, 2) + 'Tr'
            }
        }
    }

    useEffect(() => {
        _getDatabase()
    }, [])

    return (
        (isLoading)
            ? (
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator />
                </SafeAreaView>
            )
            : (
                <SafeAreaView style={styles.container}>
                    <FlatList data={videos}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.containerItem}>
                                    <View style={{ flex: 1 }}>
                                        <ImageBackground source={require('../assets/black.png')}
                                            style={styles.imgWaitVideo} >
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('VideoDetail', { item })
                                            }}>
                                                <Image source={require('../assets/youtube.png')}
                                                    style={styles.buttonPlay} />
                                            </TouchableOpacity>
                                        </ImageBackground>
                                    </View>
                                    <View style={styles.footer}>
                                        <Image source={{ uri: item.avatarChannel }}
                                            style={styles.avatarChannel} />
                                        <View style={{
                                            flex: 1,
                                        }}>
                                            <Text style={{
                                                fontSize: 24,
                                            }}>
                                                {
                                                    (item.videoName.length >= 25)
                                                        ? item.videoName.slice(0, 25) + "..."
                                                        : item.videoName
                                                }
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row'
                                            }}>
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: '#343434'
                                                }}>
                                                    {item.channelName} * {_convertString(item.videoViews)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }} />
                </SafeAreaView>
            )
    )
}

export default Videos

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD'
    },

    containerItem: {
        width: width,
        height: 300,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 7
    },

    imgWaitVideo: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },

    buttonPlay: {
        width: 50,
        height: 50
    },
    footer: {
        width: width,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    avatarChannel: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 50,
        marginEnd: 10
    }
})