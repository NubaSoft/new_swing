import {
  Animated,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Easing,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const bgImage = require("../../assets/bgimagsub.jpg");
const logoAnimation = require("../../assets/logo.png");
const profilecover = require("../../assets/profile_cover.png");
import axios from "axios";
import SubscriptionData from "./subscriptionData";
import RenewalProcess from "./renewalProcess";
import Loading from "../loading/loading";
import ActiveSubscriptions from "./activeSubscriptions";
import { StackActions } from "@react-navigation/native";

var Renew = ({ route, navigation }) => {
  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const logoAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const [selectedPage, setSelectedPage] = useState(0);
  const [allowFast, setAllowFast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState("");

  const ActiveSubscriptionDataHandler = (allowfast) => {
    console.log("Subscription Data Handler");
    setAllowFast(allowfast);
    setSelectedPage(0.5);
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const selectPackageHandler = (selectedPackage) => {
    setSelectedPackage(selectedPackage);
    setSelectedPage(1);
    Animated.timing(pageAnim, {
      toValue: 1,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const SubscriptionDataHandler = (allowfast) => {
    console.log("Subscription Data Handler");
    setAllowFast(true);
    setSelectedPage(0.5);
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const RenewalProcessHandler = (renewType) => {
    console.log(" Renewal Process Handler");

    if (renewType == 1) {
      console.log("Fast Renewal Selected");
      console.log("New Subscription Selected");
      setSelectedPage(0);
      var SubDays = 0;
      var NumberMeals = 0;
      var NumberSnacks = 0;
      var offdays = 0;
      var menuID = 0;
      var price = 0;
      axios
        .get(config.baseURL + "/api/package/subscriptionDetails", {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        })
        .then((response) => {
          console.log("Get subscription details response:");
          var subscriptionNumber = 0;
          subscriptionNumber = response.data.subscriptions.length;
          if (subscriptionNumber != 0) {
            for (var i in response.data.subscriptions) {
              console.log(i);
              if (
                response.data.subscriptions[i].subscriptionEndDate ===
                response.data.subscriptionEndDate
              ) {
                SubDays = response.data.subscriptions[i].subscriptionDays;
                NumberMeals = response.data.subscriptions[i].noOfMeals;
                NumberSnacks = response.data.subscriptions[i].noOfSnacks;
                offdays = response.data.subscriptions[i].offDays;
                menuID = response.data.subscriptions[i].menueId;
                price = response.data.subscriptions[i].packagePrice;
                console.log("Sent data");
                console.log({
                  fromWhere: "Fastrenew",
                  offdays: offdays,
                  mealsnum: NumberMeals,
                  snacksnum: NumberSnacks,
                  periodnum: SubDays,
                  menuID: menuID,
                  price: price,
                });
                navigation.dispatch(
                  StackActions.replace("subscription", {
                    fromWhere: "Fastrenew",
                    offdays: offdays,
                    mealsnum: NumberMeals,
                    snacksnum: NumberSnacks,
                    periodnum: SubDays,
                    menuID: menuID,
                    price: price,
                  })
                );
                navigation.navigate("subscription", {
                  fromWhere: "Fastrenew",
                  offdays: offdays,
                  mealsnum: NumberMeals,
                  snacksnum: NumberSnacks,
                  periodnum: SubDays,
                  menuID: menuID,
                  price: price,
                });
              }
              Animated.timing(pageAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1000,
                useNativeDriver: true,
              }).start();
            }
          }
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    } else {
      console.log("New Subscription Selected");
      setSelectedPage(0);
      navigation.dispatch(
        StackActions.replace("subscription", {
          fromWhere: "Newrenew",
        })
      );
      navigation.navigate("subscription", {
        fromWhere: "Newrenew",
      });
      Animated.timing(pageAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsLoading(false);
    setSelectedPage(0);
    navigation.navigate("personal");
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleBackActive = () => {
    setIsLoading(true);
    setSelectedPage(0);
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    console.log("Welcome to Renewal page!");
    console.log(selectedPage);

    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(0.5)),
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [transAnim]);

  useEffect(() => {}, []);

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View>
        {/* Animated background */}
        <Animated.View
          style={{
            width: "100%",
            height: "100%",

            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-320, -200],
                }),
              },
            ],
          }}
        >
          <Image
            source={bgImage}
            style={styles.bgImageStyle}
            resizeMode="cover"
          ></Image>
        </Animated.View>

        {/* Logo */}
        <Animated.View style={styles.logoWrapper}>
          <Image
            source={logoAnimation}
            style={styles.logo}
            resizeMode={"cover"}
          />
        </Animated.View>
        <Loading isLoading={isLoading} />

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2000, -2000],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 0.5 ? (
            <RenewalProcess
              handler={RenewalProcessHandler}
              backHandler={handleBack}
              allowFast={allowFast}
              setIsLoading={setIsLoading}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -4000],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 0 ? (
            // <AddDietDetails handler={adddeitHandler} />
            <ActiveSubscriptions
              handler={ActiveSubscriptionDataHandler}
              backHandler={handleBack}
              setIsLoading={setIsLoading}
              selectPackageHandler={selectPackageHandler}
              RenewalProcessHandler={RenewalProcessHandler}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4000, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 1 ? (
            // <AddDietDetails handler={adddeitHandler} />
            <SubscriptionData
              handler={SubscriptionDataHandler}
              backHandler={handleBackActive}
              setIsLoading={setIsLoading}
              packageData={selectedPackage}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>
      </View>
    );
  }
};

export default Renew;

const styles = StyleSheet.create({
  bgImageStyle: {
    height: "100%",
    width: "250%",
  },

  body: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    alignItems: "center",
  },
  inputBody: {
    backgroundColor: "#C4C4C4CC",
    borderRadius: 15,
    width: "90%",
    height: "80%",
    alignItems: "center",
  },
  button: {
    width: "90%",
    height: "6%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    transform: [
      {
        translateY: 65,
      },
    ],
    width: 75,
    height: 75,
    borderRadius: 20,
  },
  logoWrapper: {
    position: "absolute",
    top: -20,
    width: "30%",
    height: "10%",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 999,
  },

  leftCover: {
    width: "10%",
    height: "10%",
  },
  leftCoverWrapper: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  textA: {
    color: "white",
    width: "100%",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});
