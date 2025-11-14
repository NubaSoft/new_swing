import {
  Animated,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Easing,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Alert,
  Button,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { lang } from "../../lang";
import { useNavigation } from "@react-navigation/native"

Keyboard.dismiss();
const clock = require("../../assets/clock.png");
const dish = require("../../assets/dish.png");
const car = require("../../assets/car.png");

const handleOpenWithLinking = () => {
  Linking.openURL(config.instagramLink);
};

var Welcome = ({ handler, setIsLoading }) => {
  //Animation
  const navigation = useNavigation();
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });
  useEffect(() => {
    setIsLoading(false);
    Keyboard.dismiss();
  }, []);
  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View style={styles.body}>
        <View style={styles.welcomeBody}>
          <Animated.View
            style={[styles.animation, {transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -500],
                }),
              },
            ],}]}
          >
            <View style={{ height: "72%" }} />
            <View
              style={{
                width: '86%',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: 'space-between',
                alignSelf: "center",

              }}
            >
              <View
                style={{
                  marginTop: "2%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Ionicons name="logo-whatsapp" size={25} color={"white"} />
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 20,
                    marginLeft: "5%",
                  }}
                >
                  {config.contactNumber2}
                </Text>
              </View>
              <View
                style={{
                  marginTop: "2%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Ionicons name="logo-instagram" size={25} color={"white"} />
                <TouchableOpacity onPress={() => handleOpenWithLinking()}>
                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "white",
                      fontSize: 20,
                      marginLeft: "10%",
                    }}
                  >
                    {config.instagramName}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          <View style={{ height: "2%", width: "100%" }} />

          <Animated.View
            style={{
              position: "absolute",
              top: "82%",
              height: "120%",
              width: "112%",
              alignItems: "center",
              transform: [
                {
                  translateY: transAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                },
              ],
            }}
          >
            <View style={{ height: "1%", width: "100%" }} />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("BrowseMenu")
              }}
            >
              <Text style={{
                // fontFamily: "Handlee_400Regular",
                color: "white",
                fontWeight: '700',
                }}>
                {lang[lang.lang].welcome_browse_menu}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("BrowsePackages")
              }}
            >
              <Text style={{
                // fontFamily: "Handlee_400Regular",
                color: "white",
                fontWeight: '700',
                }}>
                {lang[lang.lang].welcome_browse_packages}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handler()}
            >
              <Text style={{
                // fontFamily: "Handlee_400Regular",
                color: "white",
                fontWeight: '700',
                }}>
                {lang[lang.lang].welcome_button}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }
};

export default Welcome;

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
  textInputContainer: {
    marginBottom: 20,
    marginTop: 40,
  },

  roundedTextInput: {
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
  },

  inputBody: {
    backgroundColor: "#C4C4C4CC",
    borderRadius: 15,
    width: "90%",
    height: "80%",
    alignItems: "center",
  },
  welcomeBody: {
    width: "100%",
    height: "100%",
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
    width: "18%",
    height: "18%",
  },
  logoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    alignItems: "center",
    zIndex: 998,
  },
  field: {
    width: "85%",
    height: "8%",
    zIndex: 995,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
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
  animation: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    height: "4%",
    marginBottom: '1.5%',
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
  }
});
