import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeCom from "./HomeCom"
import UpdateCom from "./UpdateCom"
import Post from "./Post"

const HomeComponentContainer = () => {

    const Stack = createNativeStackNavigator()

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="HomeCom" screenOptions={{ headerShown: false }}>
                <Stack.Screen name='HomeCom' component={HomeCom} />
                <Stack.Screen name='UpdateComp' component={UpdateCom} />
                <Stack.Screen name='PostItem' component={Post} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default HomeComponentContainer