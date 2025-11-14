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
const bgImage = require("../../assets/profile_bg.jpg");
const logoAnimation = require("../../assets/logo.png");
const profilecover = require("../../assets/profile_cover.png");
import axios from "axios";
import CompletePayment from "./CompletePayment";
import PaymentLinking from "./paymentlinking";
import { StackActions } from "@react-navigation/native";

var Payment = ({ route, navigation }) => {
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
  const [paymentURL, setPaymentURL] = useState("");
  const linkPaymentHandler = (type) => {
    console.log("linkPaymentHandler");
    if (type == 1) {
      console.log("Successful payment!");
      navigation.navigate("meals");
      setSelectedPage(0);
      Animated.timing(pageAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else if (type == 2) {
      console.log("Payment failed, trying again!");
      setSelectedPage(0);
      console.log(selectedPage);
      Animated.timing(pageAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  };
  var paymentData = route.params.paymentdata;
  var editshow = route.params.editshow;
  const EditPaymentHandler = () => {
    navigation.dispatch(
      StackActions.replace("subscription", {
        fromWhere: "payment",
      })
    );
    navigation.navigate("subscription", { fromWhere: "payment" });
    setSelectedPage(0);
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const profileback = () => {
    navigation.navigate("personal");
    setSelectedPage(0);
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const CompletePaymentHandler = (
    paymentMethod,
    finalPrice,
    promoCode,
    discountPercentage,
    discountValue,
    marketingId,
    applyPromoCode
  ) => {
    // paymentMethod = 1 (Credit Card) , paymentMethod = 2 (Cash on first delivery)
    console.log("ADD Customer Package data");
    console.log({
      //TODO: Get these values from Subscription page
      days: paymentData.days,
      meals: paymentData.meals,
      snacks: paymentData.snacks,
      menuId: paymentData.menuId,
      price: paymentData.price,
      applyPromoCode: applyPromoCode,
      noBreakfast: paymentData.noBreakfast,
      finalPrice: finalPrice,
      promoCode: promoCode,
      discountPercentage: discountPercentage,
      discountValue: discountValue,
      marketingId: marketingId,
      paymentMethod: paymentMethod,
      language: paymentData.language,
      renew: route.params.renewtype,
      platform: paymentData.platform,
      startSubscription: paymentData.startSubscription,
    });
    axios
      .post(
        config.baseURL + "/api/register/addCustomerPackage",
        {
          days: paymentData.days,
          meals: paymentData.meals,
          snacks: paymentData.snacks,
          menuId: paymentData.menuId,
          price: paymentData.price,
          applyPromoCode: paymentData.applyPromoCode,
          noBreakfast: paymentData.noBreakfast,
          finalPrice: finalPrice,
          promoCode: promoCode,
          discountPercentage: discountPercentage,
          discountValue: discountValue,
          marketingId: marketingId,
          paymentMethod: paymentMethod,
          language: paymentData.language,
          renew: route.params.renewtype,
          platform: paymentData.platform,
          startSubscription: paymentData.startSubscription,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        setPaymentURL(response.data.PaymentURL);
        console.log(response.data);
        setSelectedPage(0.5);
        Animated.timing(pageAnim, {
          toValue: 0.5,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleBack = () => {
    setSelectedPage(0);
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    console.log("Welcome to Payment page!");
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
          {selectedPage == 0.5 ? (
            <PaymentLinking
              handler={linkPaymentHandler}
              paymentURL={paymentURL}
              handleBack={handleBack}
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
            // <AddDietDetails handler={adddeitHandler} />
            <CompletePayment
              handler={CompletePaymentHandler}
              subscribedays={paymentData.days}
              totprice={paymentData.price}
              editHandler={EditPaymentHandler}
              editshow={editshow}
              menuId={paymentData.menuId}
              profilebackhandler={profileback}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>

        {/* <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1000, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <CompleteResidence handler={}  packages= {availablePackagesResp}/>
        </Animated.View> */}
      </View>
    );
  }
};

export default Payment;

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
    width: 90,
    height: 90,
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
