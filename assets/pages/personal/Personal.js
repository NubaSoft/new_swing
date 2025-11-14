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
const bgImage = require("../../assets/profile_bg_croped.jpg");
const logoAnimation = require("../../assets/logo.png");
const profilecover = require("../../assets/profile_cover.png");
const brook = require("../../assets/brook.png");
import axios from "axios";
import PersonalInfo from "./PersonalInfo";
import EditProfile from "./EditProfile";
import Loading from "../loading/loading";
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditAllergDislikes from "./AllergiesDislikes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lang } from "../../lang";

var Personal = ({ route, navigation }) => {
  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const logoAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const [isLoading, setIsLoading] = useState(false);
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [language, setLanguage] = useState(lang.lang);
  // var registerData = route.params.registerdata;

  const editProfileHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const editAllergDisHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 1,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const logoutHandler = () => {
    config.Token = "";
    AsyncStorage.setItem("keepLoggedIn", "");
    AsyncStorage.setItem("data", "");
    setIsLoading(false);
    navigation.navigate("account");
  };

  const backHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const personalHandler = () => {
    setIsLoading(false);
    navigation.navigate("renew");
  };
  const backMealsHandler = () => {
    navigation.navigate("meals");
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
        <TouchableOpacity
          style={{
            position: "absolute",
            top: "5%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            right: "20%",
            zIndex: 999,
          }}
          onPress={() => {
            if (lang.lang == "ar") {
              lang.lang = "en";
              setLanguage(lang.lang);
            } else {
              lang.lang = "ar";
              setLanguage(lang.lang);
            }
          }}
        >
          <Ionicons name="language" size={30} color="black" marginRight="10%" />
          <Text
            style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              fontSize: 16,
              zIndex: 999,
            }}
          >
            {lang.lang == "ar" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        <Loading isLoading={isLoading} />
        {settingsMenu ? (
          <TouchableOpacity
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              zIndex: 1000,
              backgroundColor: "#55555555",
            }}
            onPress={() => {
              setSettingsMenu(false);
            }}
          >
            <View
              style={{
                height: 80,
                width: 200,
                backgroundColor: config.color_1 + "66",
                position: "absolute",
                right: 40,
                top: 110,
                borderRadius: 10,
                zIndex: 1000,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={brook}
                style={{
                  width: 50,
                  height: 60,
                  resizeMode: "stretch",
                  position: "absolute",
                  right: 20,
                  top: 0,
                  zIndex: 1002,
                }}
              />
              <TouchableOpacity
                style={{
                  height: "40%",
                  width: "90%",
                  backgroundColor: "white",
                  alignItems: "center",
                  borderRadius: 20,
                  zIndex: 1000,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
                onPress={() => {
                  config.Token = "";
                  AsyncStorage.setItem("keepLoggedIn", "");
                  AsyncStorage.setItem("data", "");
                  navigation.navigate("account");
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 14,
                    padding: 5,
                    paddingLeft: 30,
                  }}
                >
                  {lang[lang.lang].logout}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
                    outputRange: [0, -2 * windowWidth],
                  }),
                },
              ],
            },
          ]}
        >
          <PersonalInfo
            editProfileHandler={editProfileHandler}
            personalHandler={personalHandler}
            settingsHandler={setSettingsMenu}
            setIsLoading={setIsLoading}
            handleBack={backMealsHandler}
            editAllergDisHandler={editAllergDisHandler}
            logoutHandler={logoutHandler}
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
                    outputRange: [windowWidth, -windowWidth],
                  }),
                },
              ],
            },
          ]}
        >
          <EditProfile backHandler={backHandler} setIsLoading={setIsLoading} />
        </Animated.View>

        {/* <Animated.View
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
          <EditAllergDislikes
            backHandler={backHandler}
            setIsLoading={setIsLoading}
          />
        </Animated.View> */}
      </View>
    );
  }
};

export default Personal;

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
        translateY: 50,
      },
    ],
    width: 70,
    height: 70,
    borderRadius: 20,
  },
  logoWrapper: {
    position: "absolute",
    width: "40%",
    alignSelf: "center",
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
