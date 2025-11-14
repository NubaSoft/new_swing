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
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import Register from "./Register";
import Login from "./Login";
import Welcome from "./Welcome";
import axios from "axios";
import Loading from "../loading/loading";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lang } from "../../lang";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const bgImage = require("../../assets/unsplash1.png");
const logoAnimation = require("../../assets/logo.png");
Keyboard.dismiss();
var Account = ({ route, navigation }) => {
  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  useEffect(() => {}, []);
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const logoAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const [isLoading, setIsLoading] = useState(false);
  const [welcomePage, setWelcomePage] = useState(true);
  const [language, setLanguage] = useState(lang.lang);
  const registerHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 1,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setWelcomePage(false);
    setIsLoading(false);
  };

  const loginHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setWelcomePage(false);

    setIsLoading(false);
  };

  const backHandlerWelcome = () => {
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setWelcomePage(true);

    setIsLoading(false);
  };

  const profileHandler = (registerdata) => {
    navigation.navigate("profile", {
      registerdata: registerdata,
    });
    // Make the login is the current default value to return to it after registeration process

    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setWelcomePage(false);

    setIsLoading(false);
  };
  var checkUserExistance = (mobilephone) => {
    axios
      .post(config.baseURL + "/api/register/signupGetUserPersonlInfo", {
        mobileNumber: mobilephone,
      })
      .then((response) => {
        setIsLoading(false);
        console.log("Get Per Info response:", response.data);
        Animated.timing(pageAnim, {
          toValue: 0.5,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start();
        setWelcomePage(false);

        if (response.data.registerUser == 2) {
          // user tried before to do registration but he didn’t complete
          navigation.navigate("subscription", {
            fromWhere: "Account",
          });
        } else if (response.data.registerUser == 1) {
          navigation.navigate("meals");
          // navigation.navigate("personal");
        }
        // Make the login is the current default value to return to it in logout process
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  const AfterLoginHandler = (mobilephone) => {
    // Check user information to navigate
    checkUserExistance(mobilephone);
  };

  useEffect(() => {
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(0.5)),
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [transAnim]);

  const _retrieveData = async () => {
    try {
      console.log("returned session");
      const isLogged = await AsyncStorage.getItem("keepLoggedIn");
      const data = JSON.parse(await AsyncStorage.getItem("data"));

      config.Token = data.accessToken;
      config.profile = data;

      console.log(data);
      if (data != "") {
        console.log("Check user: ", +data["mobileNumber"]);
        setIsLoading(true);
        checkUserExistance(+data.mobileNumber);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    _retrieveData();
  }, []);

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
                  outputRange: [0, 0],
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
        {!welcomePage ? (
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                alignSelf: "center",
                transform: [
                  {
                    translateY: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.03 * windowHeight, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              source={logoAnimation}
              style={styles.logo}
              resizeMode={"cover"}
            />
          </Animated.View>
        ) : (
          <View></View>
        )}

        <TouchableOpacity
          style={{
            position: "absolute",
            top: "10%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            right: "10%",
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
          <Ionicons name="language" size={30} color="white" marginRight="10%" />
          <Text
            style={{
              // fontFamily: "Handlee_400Regular",
              color: "white",
              fontSize: 16,
              zIndex: 999,
            }}
          >
            {lang.lang == "ar" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        <Loading isLoading={isLoading} />
        <Animated.View
          style={[
            styles.body,
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
          <Welcome handler={loginHandler} setIsLoading={setIsLoading} />
        </Animated.View>

        <Animated.View
          style={[
            styles.body,
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
          <Register
            handler={loginHandler}
            profileHandler={profileHandler}
            setIsLoading={setIsLoading}
            backHandlerWelcome={backHandlerWelcome}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.body,
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
          <Login
            handler={registerHandler}
            AfterLoginHandler={AfterLoginHandler}
            setIsLoading={setIsLoading}
            backHandlerWelcome={backHandlerWelcome}
          />
        </Animated.View>
      </View>
    );
  }
};

export default Account;

const styles = StyleSheet.create({
  bgImageStyle: {
    height: "100%",
    width: "100%",
    // marginLeft: windowWidth * 0.5,
    alignSelf: "center",
  },

  body: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    alignItems: "center",
    zIndex: 988,
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
    width: 100,
    height: 100,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  logoWrapper: {
    position: "absolute",
    top: 30,
    left: "25%",
    right: 0,
    bottom: 0,
    width: "50%",
    height: "10%",
    alignItems: "center",
    alignSelf: "center",
    zIndex: 990,
    marginTop: 15,
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
