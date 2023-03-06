import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Videos from './Videos'
import VideoDetail from './VideoDetail'

const Stack = createNativeStackNavigator()

const Video = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName='Videos' screenOptions={{ headerShown: false }} >
                <Stack.Screen name='Videos' component={Videos} />
                <Stack.Screen name='VideoDetail' component={VideoDetail} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Video