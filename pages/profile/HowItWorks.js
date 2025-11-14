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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import { lang } from "../../lang";

const purp = require("../../assets/purp.png");
const ellipse = require("../../assets/ellipse.png");
const brook = require("../../assets/brook.png");
const lettice = require("../../assets/let.png");
const hm = require("../../assets/healthy_man.png");
const clock = require("../../assets/clock.png");
const dish = require("../../assets/dish.png");
var HowItWorks = ({ navigation, handler, profileHandler }) => {
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  const transAnimRot = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(transAnimRot, {
          toValue: -0.2,
          easing: Easing.inOut(Easing.back()),
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(transAnimRot, {
          toValue: 0,
          easing: Easing.inOut(Easing.back()),
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [transAnimRot]);

  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View style={styles.body}>
        <View style={{ height: "12%", width: "100%" }} />

        <Animated.View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -500],
                }),
              },
            ],
          }}
        >
          <View style={{ height: "5%" }} />
          <Text
            style={{
              // fontFamily: "Handlee_400Regular",
              color: "white",
              fontSize: 36,
            }}
          >
            {lang[lang.lang].how_it_works_1}
          </Text>

          <Animated.View
            style={{
              width: "90%",
              height: "13%",
              transform: [
                {
                  scale: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [1, 0.9],
                  }),
                },
                {
                  translateY: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [0, 10],
                  }),
                },
                {
                  translateX: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
          >
            <Image
              source={brook}
              style={{ width: "20%", height: "70%", marginLeft: "23%" }}
            ></Image>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={ellipse}
                style={{ height: "180%", width: "18%" }}
              ></Image>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  position: "absolute",
                  left: "7%",
                  fontSize: 28,
                }}
              >
                {"1"}
              </Text>
              <View style={{ width: "3%" }} />
              <View
                style={{
                  backgroundColor: config.color_2 + "B3",
                  width: "80%",
                  height: "100%",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].how_it_works_2}
                </Text>

                <Image
                  source={hm}
                  style={{ width: "15%", height: "60%" }}
                ></Image>
              </View>
            </View>
          </Animated.View>
          <View style={{ height: "5%" }} />
          <Animated.View
            style={{
              width: "90%",
              height: "13%",
              transform: [
                {
                  scale: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [1.05, 0.9],
                  }),
                },
                {
                  translateX: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [0, -10],
                  }),
                },
              ],
            }}
          >
            <Image
              source={purp}
              style={{
                width: "20%",
                height: "80%",
                marginLeft: "83%",
                transform: [{ scaleX: -1 }],
              }}
            ></Image>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={ellipse}
                style={{ height: "180%", width: "18%" }}
              ></Image>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  position: "absolute",
                  left: "7%",
                  fontSize: 28,
                }}
              >
                {"2"}
              </Text>
              <View style={{ width: "3%" }} />
              <View
                style={{
                  backgroundColor: config.color_2 + "B3",
                  width: "80%",
                  height: "100%",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].how_it_works_3}
                </Text>

                <Image
                  source={clock}
                  style={{ width: "15%", height: "60%" }}
                ></Image>
              </View>
            </View>
          </Animated.View>
          <View style={{ height: "5%" }} />

          <Animated.View
            style={{
              width: "90%",
              height: "13%",
              transform: [
                {
                  scale: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [1, 0.9],
                  }),
                },
                {
                  translateY: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [25, 0],
                  }),
                },
                {
                  translateX: transAnimRot.interpolate({
                    inputRange: [-0.2, 0.2],
                    outputRange: [0, -20],
                  }),
                },
              ],
            }}
          >
            <Image
              source={lettice}
              style={{ width: "15%", height: "80%", marginLeft: "23%" }}
            ></Image>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={ellipse}
                style={{ height: "180%", width: "18%" }}
              ></Image>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  position: "absolute",
                  left: "7%",
                  fontSize: 28,
                }}
              >
                {"3"}
              </Text>
              <View style={{ width: "3%" }} />
              <View
                style={{
                  backgroundColor: config.color_2 + "B3",
                  width: "80%",
                  height: "100%",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].how_it_works_4}
                </Text>

                <Image
                  source={dish}
                  style={{ width: "15%", height: "60%" }}
                ></Image>
              </View>
            </View>
          </Animated.View>
          <View style={{ height: "15%" }} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Animated.timing(transAnim, {
                toValue: 1,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1600,
                useNativeDriver: true,
              }).start();
              handler();
            }}
          >
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              }}>
            {lang[lang.lang].how_it_works_5}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
};

export default HowItWorks;

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
    height: "70%",
    alignItems: "center",
  },
  maleBody: {
    backgroundColor: "#C4C4C4CC",
    borderRadius: 15,
    width: 45,
    height: 92,
    alignItems: "center",
  },
  button: {
    width: "90%",
    height: "6%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
    borderColor:"black",
                borderWidth:2
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
    zIndex: 999,
  },
  field: {
    width: "85%",
    height: "8%",
    zIndex: 999,
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
});
