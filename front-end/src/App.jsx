import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Users from './components/Users';
import DailyHabits from './components/DailyHabits';
import HabitNotes from './components/HabitNotes';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Users') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Habits') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Notes') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Users" 
          component={Users}
          options={{
            title: '👤 Usuarios',
            tabBarLabel: 'Usuarios',
          }}
        />
        <Tab.Screen 
          name="Habits" 
          component={DailyHabits}
          options={{
            title: '📊 Hábitos Diarios',
            tabBarLabel: 'Hábitos',
          }}
        />
        <Tab.Screen 
          name="Notes" 
          component={HabitNotes}
          options={{
            title: '📝 Notas',
            tabBarLabel: 'Notas',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
