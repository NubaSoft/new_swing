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
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";

const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const cardimg = require("../../assets/box-of-food-package.png");
const cashimg = require("../../assets/clock.png");
const transaction = require("../../assets/transaction.png");
const carrot = require("../../assets/carrot.png");
const back_arrow = require("../../assets/back-arrow.png");

import axios from "axios";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";
import { lang } from "../../lang";

var RenewalProcess = ({
  navigation,
  handler,
  backHandler,
  allowFast,
  setIsLoading,
}) => {
  const [subsDays, setSubsDays] = useState("20");
  const [totalPrice, setTotalPrice] = useState("20");
  const [fastSelected, setCashSelection] = useState(false);
  const [newSubSelected, setCardSelection] = useState(false);
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

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
        <View
          style={{
            position: "absolute",
            left: 10,
            top: 60,
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
              backHandler();
            }}
          >
            <Image source={back_arrow} style={{ height: 30, width: 30 }} />
            <View style={{ height: 2 }} />
            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: "black",
                fontWeight: "900",
                fontSize: 18,
              }}
            >
              {lang[lang.lang].subscription_data_1}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: "15%", width: "100%" }} />
        <View
          style={[
            styles.inputBody,
            // { borderColor: config.color_1, borderWidth: 2 },
          ]}
        >
          {/* First Page */}

          <Animated.View
            style={{
              position: "absolute",
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

            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: "80%",
              }}
            >
              <Image
                source={transaction}
                style={{ height: "70%", width: "12%" }}
              />
              <Text
                style={{
                  margin: "4%",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {lang[lang.lang].subscription_data_8}
              </Text>
            </View>
            <View
              style={{
                height: "0%",
                width: "90%",
                borderWidth: 1,
                borderColor: "black",
              }}
            />
            <View
              style={{
                marginTop: "10%",
                height: "10%",
                width: "85%",
                borderRadius: 30,
                backgroundColor: config.color_1,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={()=>{setCashSelection(!fastSelected)
              setCardSelection(false)
              }}style={{ flexDirection: "row", width: "80%" }}>
                <CheckBox
                  value={fastSelected}
                  onValueChange={setCashSelection}
                  color="black"
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    marginLeft: "5%",
                  }}
                />
                <View style={{ height: "2.5%", width: "3%" }} />
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].subscription_data_9}
                </Text>
              </TouchableOpacity>
              <Image
                source={cashimg}
                style={{
                  height: "100%",
                  width: "20%",
                  alignSelf: "flex-end",
                }}
              />
            </View>

            <View
              style={{
                width: "80%",
                marginTop: "2%",
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 15,
                }}
              >
                {lang[lang.lang].subscription_data_10}
              </Text>
            </View>
            <View
              style={{
                marginTop: "5%",
                height: "10%",
                width: "85%",
                borderRadius: 30,
                backgroundColor: config.color_1,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={{ flexDirection: "row", width: "80%",  }} onPress={()=>{setCardSelection(!newSubSelected)
              setCashSelection(false)
              }}>
                <CheckBox
                  value={newSubSelected}
                  onValueChange={setCardSelection}
                  color="black"
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    marginLeft: "5%",
                  }}
                />
                <View style={{ height: "2.5%", width: "3%" }} />
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].subscription_data_11}
                </Text>
              </TouchableOpacity>
              <Image
                source={cardimg}
                style={{
                  height: "120%",
                  width: "20%",
                  alignSelf: "flex-end",
                }}
              />
            </View>
            <View
              style={{
                width: "80%",
                marginTop: "2%",
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 15,
                }}
              >
                {lang[lang.lang].subscription_data_12}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={{ height: "2%" }} />

        <View
          style={{
            alignContent: "flex-end",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            alignSelf: "center",
            width: "80%",
            height: "10%",
          }}
        >
          <Image source={carrot} style={{ height: "70%", width: "12%" }} />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!allowFast && fastSelected) {
              Alert.alert(
                lang[lang.lang].subscription_data_14
              );
            } else if (newSubSelected && fastSelected) {
              Alert.alert(lang[lang.lang].subscription_data_15);
            } else if (newSubSelected) {
              handler(2);
              setIsLoading(true);
            } else if (fastSelected) {
              handler(1);
              setIsLoading(true);
            } else {
              Alert.alert(lang[lang.lang].subscription_data_16);
            }
            console.log("Renew Button");
          }}
        >
          <Text style={{
            // fontFamily: "Handlee_400Regular",
            color: "black",
            }}>
          {lang[lang.lang].subscription_data_13}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default RenewalProcess;

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
    backgroundColor: "#DBDBDBCC",
    borderRadius: 15,
    width: "90%",
    height: "60%",
    alignItems: "center",
  },
  maleBody: {
    backgroundColor: "rgba(60, 163, 221, 0.35)",
    borderRadius: 15,
    width: 100,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  femaleBody: {
    backgroundColor: "rgba(230, 187, 185, 0.35)",
    borderRadius: 15,
    width: 100,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "90%",
    height: "6%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
  },
  editbutton: {
    width: "55%",
    height: "15%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "5%",
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
