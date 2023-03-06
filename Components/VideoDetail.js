import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions, TouchableOpacity, Share } from 'react-native'
import React, { useState } from 'react'
import YoutubePlayer from 'react-native-youtube-iframe'

const VideoDetail = ({ route }) => {

    const [item, setItem] = useState(route.params.item)

    const convertString = (input) => {
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

    const onShare = async () => {
        try {
            const result = await Share.share({
                url: `${item.linkYoutube}`,
                title: `${item.channelName}`,
                message: `${item.name}`
            })
                .then(() => { })
                .catch((err) => { console.log(err); })

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
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#343434'
        }}>
            <YoutubePlayer
                height={220}
                play={true}
                videoId={`${item.id}`} />
            <Text style={{
                fontWeight: 'bold',
                color: 'white',
                marginStart: 5,
                fontSize: 24
            }}>
                {
                    item.videoName
                }
            </Text>
            <Text style={{
                color: 'gray',
                fontSize: 12,
                marginStart: 5,
                marginTop: 10
            }}>
                {
                    `${convertString(item.videoViews)}`
                } lượt xem
            </Text>
            <View style={{
                flexDirection: 'row',
                marginStart: 5,
                marginTop: 10,
                alignItems: 'center'
            }}>
                <Image source={{ uri: item.avatarChannel }}
                    style={{
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                    }} />
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginStart: 5
                        }}>
                            {
                                item.channelName
                            }
                        </Text>
                        {
                            item.tick && <Image source={require('../assets/tick.png')}
                                style={{
                                    height: 10,
                                    width: 10,
                                    marginStart: 2
                                }} />
                        }
                    </View>
                    <Text style={{
                        marginStart: 5,
                        fontSize: 10,
                        color: 'white'
                    }}>
                        {
                            `${convertString(item.sub)}`
                        } Sub
                    </Text>
                </View>
            </View>
            <View style={{
                flexDirection: 'row'
            }}>
                <View style={{
                    flexDirection: 'row',
                    height: 50,
                    paddingStart: 20,
                    backgroundColor: 'gray',
                    alignItems: 'center',
                    marginTop: 10,
                    width: 100,
                    borderRadius: 21,
                    marginStart: 5
                }}>
                    <Image source={require('../assets/like.png')}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: 'white'
                        }} />
                    <Text style={{
                        marginStart: 5,
                        textAlign: 'center',
                        height: 20,
                        color: 'white'
                    }}>
                        {
                            `${convertString(item.likes)}`
                        }
                    </Text>
                </View>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    height: 50,
                    backgroundColor: 'gray',
                    alignItems: 'center',
                    marginTop: 10,
                    borderRadius: 21,
                    marginStart: 5,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                    onPress={onShare}>
                    <Image source={require('../assets/share.png')}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: 'white'
                        }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default VideoDetail

const styles = StyleSheet.create({})