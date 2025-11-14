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
} from "react-native";
import React, { useEffect, useRef } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../config";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const logoAnimation = require("../assets/logo.png");

var InitialLoading = ({ navigation }) => {
  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const transXAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const loadAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  useEffect(() => {
    Animated.sequence([
      Animated.timing(transAnim, {
        toValue: 1,
        easing: Easing.in(Easing.elastic(0.5)),
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(loadAnim, {
        toValue: 0.5,
        easing: Easing.in(Easing.elastic(0.5)),
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(transXAnim, {
        toValue: 1,
        easing: Easing.in(Easing.elastic(0.5)),
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(loadAnim, {
        toValue: 1,
        easing: Easing.in(Easing.elastic(0.5)),
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    loadAnim.addListener((e) => {
      if (e.value == 1) {
        navigation.navigate("account");
      }
    });
  }, [transAnim]);

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View style={{ backgroundColor: "#E5E5E5" }}>
        <View
          style={{
            position: "absolute",
            top: "58%",
            height: 5,
            width: "75%",
            borderColor: "#0000004D",
            borderWidth: 1,
            alignSelf: "center",
            borderRadius: 10,
          }}
        ></View>

        <View
          style={{
            zIndex: 999,
            position: "absolute",
            top: "58%",
            height: 5,
            width: "80%",
            flexDirection: "row-reverse",
            alignSelf: "center",
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateX: loadAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-500, 0.01 * windowWidth],
                  }),
                },
              ],
              width: "100%",
              height: "100%",
              alignSelf: "center",
              borderRadius: 10,
              backgroundColor: config.color_2,
            }}
          ></Animated.View>
          <View
            style={{
              backgroundColor: "#E5E5E5",
              width: "100%",
              alignSelf: "flex-start",
              height: "100%",
            }}
          ></View>
        </View>

        {/* Logo */}
        <View>
          <Image
            source={logoAnimation}
            style={styles.logo}
            resizeMode={"cover"}
          />
        </View>

        <Animated.View
          style={{
            opacity: transXAnim,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Text
            style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              fontSize: 24,
              alignSelf: "center",
            }}
          >
            {"Nubasoft\nHealthy Meals Subscription"}
          </Text>
        </Animated.View>
      </View>
    );
  }
};

export default InitialLoading;

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
    width: 250,
    height: 250,
  },
  logoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "15%",
    alignItems: "center",
    zIndex: 999,
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
