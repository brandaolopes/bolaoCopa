import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { New } from '../screens/New';
import { Pools } from '../screens/Pools';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';
import { PlusCircle, SoccerBall, Info } from 'phosphor-react-native';
import { Find } from '../screens/Find';
import { Details } from '../screens/Details';
import { InfoScreen } from '../screens/InfoScreen';



const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const { colors, sizes } = useTheme();
    const iconSize = sizes[6]

    return (

        <Navigator screenOptions={{
            headerShown: false,
            tabBarLabelPosition: 'beside-icon',
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                position: 'absolute',
                height: 87,
                backgroundColor: colors.gray[800]
            },
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0
            },  
        }}
        >

            <Screen 
                name='pools'
                component={Pools}
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={iconSize}/>,
                    tabBarLabel: 'Meus Bolões'
                }}
            />

            <Screen 
                name='new'
                component={New}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={iconSize}/>,
                    tabBarLabel: 'Novo Bolão'
                }}
            />

            <Screen 
                name='infoscreen'
                component={InfoScreen}
                options={{
                    tabBarIcon: ({ color }) => <Info color={color} size={iconSize}/>,
                    tabBarLabel: 'Regras'
                }}
            />

            <Screen 
                name='find'
                component={Find}
                options={{
                    tabBarButton: () => null
                }}
            />

            <Screen 
                name='details'
                component={Details}
                options={{
                    tabBarButton: () => null,
                }}
                
            />
            
        </Navigator>
    );
}