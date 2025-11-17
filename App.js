if (__DEV__) {
  import('./ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );
}
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Account from "./pages/account/Account";
import Profile from "./pages/profile/Profile";
import Subscription from "./pages/subscription/subscription";
import Payment from "./pages/payment/payment";
import Meals from "./pages/meals/meals";
import Personal from "./pages/personal/Personal";
import Renew from "./pages/renew/renew";
import Loading from "./pages/loading/loading";
import "react-native-gesture-handler";
import { BrowseMenu } from "./pages/browse/BrowseMenu";
import { BrowsePackages } from "./pages/browse/BrowsePackages";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export default function App() {
  const [route, setRoute] = useState("initial");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
            swipeEnabled={false}
            // initialRouteName={route}
          >
            {/* <Stack.Screen name="initial" component={InitialLoading} /> */}
            <Stack.Screen name="account" component={Account} />
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="subscription" component={Subscription} />
            <Stack.Screen name="payment" component={Payment} />
            <Stack.Screen name="meals" component={Meals} />
            <Stack.Screen name="personal" component={Personal} />
            <Stack.Screen name="renew" component={Renew} />
            <Stack.Screen name="BrowseMenu" component={BrowseMenu} />
              <Stack.Screen name="BrowsePackages" component={BrowsePackages} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }
}
