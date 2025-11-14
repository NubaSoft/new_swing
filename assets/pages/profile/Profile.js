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
import React, { useEffect, useRef } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import CompleteProfile from "./CompleteProfile";
import HowItWorks from "./HowItWorks";
import CompleteResidence from "./CompleteResidence";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const bgImage = require("../../assets/profile_bg.jpg");
const logoAnimation = require("../../assets/logo.png");
const profilecover = require("../../assets/profile_cover.png");
import axios from "axios";
import { lang } from "../../lang";

var Profile = ({ route, navigation }) => {
  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const logoAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  var registerData = route.params.registerdata;

  const completeprofileHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const completeresidenceHandler = (gender, ht, wt) => {
    Animated.timing(pageAnim, {
      toValue: 1,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();

    registerData.gender = gender;
    registerData.weight = wt;
    registerData.height = ht;
    console.log(registerData);
  };

  const senddatahandler = (
    areaValue,
    block,
    building,
    jadda,
    street,
    flat,
    floor,
    notes
  ) => {
    registerData.addressDetails.area = areaValue;
    registerData.addressDetails.block = block;
    registerData.addressDetails.street = street;
    registerData.addressDetails.jadda = jadda;
    registerData.addressDetails.building = building;
    registerData.addressDetails.floor = floor;
    registerData.addressDetails.flat = flat;
    registerData.addressDetails.notes = notes;
    console.log(registerData);

    console.log('===============>>>> 1');
    
    // Checking if the user already registered before
    axios
      .post(
        config.baseURL + "/api/register/signupAddPersonalData",
        registerData
      )
      .then((response) => {
        console.log('===============>>>>', response.data);
        if (response.data.message == "success") {
          Alert.alert(lang[lang.lang].registeredSuccessfully);
          navigation.navigate("account");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(0.5)),
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [transAnim]);

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

        {/* Left Profile Icon */}
        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [windowWidth, -windowWidth],
                  }),
                },
              ],
            },
          ]}
        >
          <CompleteProfile profileHandler={completeresidenceHandler} />
        </Animated.View>

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2 * windowWidth],
                  }),
                },
              ],
            },
          ]}
        >
          <HowItWorks handler={completeprofileHandler} />
        </Animated.View>

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2 * windowWidth, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <CompleteResidence handler={senddatahandler} />
        </Animated.View>
      </View>
    );
  }
};

export default Profile;

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
