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
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

const purp = require("../../assets/purp.png");
const pkgimg = require("../../assets/box-of-food-package.png");
const groceries = require("../../assets/groceries.png");
const cardimg = require("../../assets/card.png");
const cashimg = require("../../assets/knet.png");
const transaction = require("../../assets/transaction.png");
const carrot = require("../../assets/carrot.png");
const back_arrow = require("../../assets/back-arrow.png");
const pys = require("../../assets/box-of-food-package.png");

import axios from "axios";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";
import { isLoaded, isLoading } from "expo-font";
import { lang } from "../../lang";

var ActiveSubscriptions = ({
  navigation,
  handler,
  backHandler,
  setIsLoading,
  selectPackageHandler,
  RenewalProcessHandler,
}) => {
  const [activeSubs, setActiveSubs] = useState([]);
  const [SubsDataExist, setSubsDataExist] = useState(false);
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  useEffect(() => {
    axios
      .get(config.baseURL + "/api/package/subscriptionDetails", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then((response) => {
        console.log("Get subscription details response:");
        var todayDate = moment();
        var subscriptionNumber = 0;
        var activeS = [];
        subscriptionNumber = response.data.subscriptions.length;
        if (subscriptionNumber != 0) {
          for (var i in response.data.subscriptions) {
            console.log(i);
            if (
              todayDate.diff(
                moment(response.data.subscriptions[i].subscriptionEndDate)
              ) < 0
            ) {
              activeS.push(response.data.subscriptions[i]);
              setSubsDataExist(true);
            }
          }
          setActiveSubs(activeS);
        } else {
          setSubsDataExist(false);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);

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

        <View style={[styles.inputBody]}>
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
            <View
              style={{
                flexDirection: "row",
                borderRadius: 20,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: "80%",
                marginBottom: "3%",
                height: "15%",
              }}
            >
              <Image source={pys} style={{ height: "70%", width: "12%" }} />
              <Text
                style={{
                  margin: "4%",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {lang[lang.lang].subscription_data_2}
              </Text>
            </View>

            {SubsDataExist ? (
              <ScrollView
                style={{
                  height: "100%",
                  width: "100%",
                }}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeSubs.map((activeSub) => (
                  <TouchableOpacity
                    style={{
                      width: "95%",
                      height: 120,
                      backgroundColor: config.color_1 + "BB",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                      marginTop: "6%",
                    }}
                    onPress={() => {
                      console.log("Package Pressed");
                      selectPackageHandler(activeSub);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "stretch",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            // fontFamily: "Handlee_400Regular",
                            color: "black",
                            fontSize: 20,
                          }}
                        >
                          {activeSub.subscriptionName}
                        </Text>

                        <Text
                          style={{
                            // fontFamily: "Handlee_400Regular",
                            color: "black",
                            fontSize: 16,
                          }}
                        >
                          {lang[lang.lang].subscription_data_3 +
                            activeSub.subscriptionStartDate +
                            "\n"}
                          {lang[lang.lang].subscription_data_4 +
                            activeSub.subscriptionEndDate}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={{ alignContent: "center", alignItems: "center" }}>
                <Image
                  source={pkgimg}
                  style={{ height: 150, width: 150, marginTop: "50%" }}
                />
                <View style={{ height: 2 }} />
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontWeight: "900",
                    fontSize: 20,
                    marginTop: "5%",
                  }}
                >
                  {lang[lang.lang].subscription_data_5}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>

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
            console.log("PRESSED");
            if (!SubsDataExist) {
              RenewalProcessHandler(2);
            } else {
              handler(SubsDataExist);
            }
          }}
        >
          {SubsDataExist ? (
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              }}>
              {lang[lang.lang].subscription_data_6}
            </Text>
          ) : (
            <Text style={{
              // fontFamily: "Handlee_400Regular",
            color: "white",
            fontWeight: '700',
            }}>
              {lang[lang.lang].subscription_data_7}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
};

export default ActiveSubscriptions;

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
    marginTop: 44,
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
    // backgroundColor: "#DBDBDBCC",
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
