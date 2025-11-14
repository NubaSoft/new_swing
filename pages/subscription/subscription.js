import {
  Animated,
  StyleSheet,
  Text,
  View,
  Image,
  Easing,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const bgImage = require("../../assets/bgimagsub.jpg");
const logoAnimation = require("../../assets/logo.png");
import { useFocusEffect } from "@react-navigation/native";
const profilecover = require("../../assets/profile_cover.png");
import axios from "axios";
import AddDietDetails from "./AddDietDetails";
import PackageSelection from "./PackageSelection";
import AvailablePackages from "./AvailablePackages";
import AddMeals from "../meals/addmeals";
import FastRenewPackageSelection from "./FastRenewPackageSelection";
import DeviceInfo from "react-native-device-info";
import { StackActions } from "@react-navigation/native";
import { lang } from "../../lang";

var Subscription = ({ route, navigation }) => {
  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const logoAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const [offdaysPackage, setOffDaysPackage] = useState([]);
  const [showBack, setShowBack] = useState(false);
  const [fastRenew, setFastRenew] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState({
    meals: null,
    snacks: null,
    days: null,
    startDate: null,
  });
  const [availablePackages, setAvailablePackages] = useState([]);
  const [addDietDetailsBack, setAddDeitDetailBack] = useState(false);
  const back_arrow = require("../../assets/back-arrow.png");
  const adddeitHandler = (offDays) => {
    console.log("OffDays", offDays);
    setOffDaysPackage(offDays);
    setSelectedPage(0.5);
    setShowBack(true);
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const personalHandleBack = () => {
    navigation.navigate("personal");
  };
  var handleBack = () => {
    if (selectedPage == 0.5) {
      if (fastRenew) {
        console.log("No back in fast renew");
      } else {
        Animated.timing(pageAnim, {
          toValue: 0,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start();
        setShowBack(false);
        setSelectedPage(0);
      }
    }
    if (selectedPage == 1) {
      Animated.timing(pageAnim, {
        toValue: 0.5,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setShowBack(true);
      setSelectedPage(0.5);
    }
  };
  const availablepackageshandler = (paymentdata) => {
    if (fastRenew) {
      navigation.dispatch(
        StackActions.replace("payment", {
          paymentdata: paymentdata,
          editshow: false,
          renewtype: 1,
        })
      );
      navigation.navigate("payment", {
        paymentdata: paymentdata,
        editshow: false,
        renewtype: 1,
      });
    } else {
      navigation.dispatch(
        StackActions.replace("payment", {
          paymentdata: paymentdata,
          editshow: true,
          renewtype: 0,
        })
      );
      navigation.navigate("payment", {
        paymentdata: paymentdata,
        editshow: true,
        renewtype: 0,
      });
    }
    setShowBack(false);
    setSelectedPage(0);
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const SelectPackageHandler = (meals, snacks, days, startDate) => {
    console.log(meals);
    console.log(snacks);
    console.log(days);
    console.log(startDate);

    axios
      .post(
        config.baseURL + "/api/register/getAvailablePackages",
        {
          days: parseInt(days),
          meals: parseInt(meals),
          snacks: parseInt(snacks),
          noBreakfast: 0,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        setAvailablePackages(response.data.packages);
        setSubscriptionData({
          meals: meals,
          snacks: snacks,
          days: days,
          startDate: startDate,
        });
        setSelectedPage(1);

        Animated.timing(pageAnim, {
          toValue: 1,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start();

        //TODO set available packages data like , days meals snacks startdates
      })
      .catch((e) => {
        console.log("get available package error");
        console.log(e);
      });
  };

  const SelectPackageHandlerFast = (
    meals,
    snacks,
    days,
    startDate,
    menueid,
    price
  ) => {
    console.log("Fast Renew Customer Package Data");
    console.log(meals);
    console.log(snacks);
    console.log(days);
    console.log(startDate);
    console.log(menueid);
    console.log(price);
    var paymentdata = {
      days: days,
      meals: meals,
      snacks: snacks,
      menuId: menueid, // selected package menu id
      price: price, // selected package price
      applyPromoCode: 0,
      noBreakfast: 0,
      finalPrice: price,
      promoCode: "",
      discountPercentage: 0,
      discountValue: 0,
      marketingId: 1,
      paymentMethod: 1,
      language: "en",
      renew: 0,
      platform: "postman",
      startSubscription: startDate,
    };

    axios
      .post(
        config.baseURL + "/api/register/addDietDetails",
        {
          dietGoal: 1,
          allergieItems: [],
          dislikeItems: [],
          offDays: [],
          renew: 1,
          platform: DeviceInfo.getSystemName(),
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        availablepackageshandler(paymentdata);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    console.log("Welcome to subscription page!");
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(0.5)),
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [transAnim]);

  useEffect(() => {
    console.log("Welcome to subscription page!");
    var fromWhere = route.params.fromWhere;
    console.log(fromWhere);
    setShowBack(false);

    if (fromWhere == "Fastrenew") {
      setFastRenew(true);
      setSelectedPage(0.5);
      setShowBack(false);
      Animated.timing(pageAnim, {
        toValue: 0.5,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
    if (fromWhere == "Newrenew") {
      setAddDeitDetailBack(true);
      setFastRenew(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Focus Welcome to subscription page!");
      var fromWhere = route.params.fromWhere;
      console.log(fromWhere);
      setShowBack(false);

      if (fromWhere == "Fastrenew") {
        setFastRenew(true);
        setSelectedPage(0.5);
        setShowBack(false);
        setAddDeitDetailBack(false);
        Animated.timing(pageAnim, {
          toValue: 0.5,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
      if (fromWhere == "Newrenew") {
        setAddDeitDetailBack(true);
        setFastRenew(false);
      }
    }, [])
  );

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
           marginTop: 44,
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
        {/* <Animated.View style={styles.logoWrapper}>
          <Image
            source={logoAnimation}
            style={styles.logo}
            resizeMode={"cover"}
          />
        </Animated.View> */}
        {/* back button */}
        {showBack ? (
          <View
            style={{
              position: "absolute",
              left: 10,
              top: 50,
              zIndex: 999,
            }}
          >
            <TouchableOpacity
              style={{
                height: "100%",
                width: "100%",

                alignItems: "center",
              }}
              onPress={() => {
                console.log("back pressed");
                handleBack();
              }}
            >
              <Image source={back_arrow} style={{ height: 15, width: 20 }} />
              <View style={{ height: 2 }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontWeight: "900",
                  fontSize: 15,
                }}
              >
                {lang[lang.lang].subscription_1}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, -500],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 0.5 && fastRenew ? (
            <FastRenewPackageSelection
              handler={SelectPackageHandlerFast}
              offdays={route.params.offdays}
              mealsnum={route.params.mealsnum}
              snacksnum={route.params.snacksnum}
              periodnum={route.params.periodnum}
              menuID={route.params.menuID}
              price={route.params.price}
              handleBack={personalHandleBack}
            />
          ) : (
            <View></View>
          )}
          {selectedPage == 0.5 && !fastRenew ? (
            <PackageSelection
              handler={SelectPackageHandler}
              offdays={offdaysPackage}
              fromwhere={route.params.fromWhere}
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
                    outputRange: [0, -1000],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 0 ? (
            <AddDietDetails
              handler={adddeitHandler}
              handleBack={personalHandleBack}
              addDeitDetailsBack={addDietDetailsBack}
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
                    outputRange: [1500, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 1 ? (
            // <AddMeals
            //   availablePackages={availablePackages}
            //   handler={availablepackageshandler}
            //   subscriptionData={subscriptionData}
            // />
            <AvailablePackages
              availablePackages={availablePackages}
              handler={availablepackageshandler}
              subscriptionData={subscriptionData}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>
      </View>
    );
  }
};

export default Subscription;

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
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "10%",
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
