import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import DashBoard from "./sceens/DashBoardUser";
import Login from "./sceens/Login";
import DashBoardAdmin from "./sceens/DashBoardAdmin";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Login">
    //     <Stack.Screen
    //       name="Login"
    //       component={Login}
    //       options={{ headerShown: false }}
    //     />
    //     <Stack.Screen
    //       name="DashBoardUser"
    //       component={DashBoard}
    //       options={{ headerShown: false }}
    //     />
    //     <Stack.Screen
    //       name="DashBoardAdmin"
    //       component={DashBoardAdmin}
    //       options={{ headerShown: false }}
    //     />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <DashBoardAdmin></DashBoardAdmin>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
