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
const pkgimg = require("../../assets/box-of-food-package.png");
const groceries = require("../../assets/groceries.png");
const cardimg = require("../../assets/card.png");
const cashimg = require("../../assets/knet.png");
const transaction = require("../../assets/transaction.png");
const carrot = require("../../assets/carrot.png");
const back_arrow = require("../../assets/back-arrow.png");

import axios from "axios";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";
import { lang } from "../../lang";

var SubscriptionData = ({
  navigation,
  handler,
  backHandler,
  setIsLoading,
  packageData,
}) => {
  const [remainDays, setRemainDays] = useState("20");
  const [totalPrice, setTotalPrice] = useState("500");
  const [subsPeriod, setSubsPeriod] = useState("20");
  const [pkgName, setPkgName] = useState("20");
  const [subsStartDate, setSubsStartDate] = useState("20");
  const [subsEndDate, setSubsEndDate] = useState("20");
  const [numbermeals, setNumberMeals] = useState("20");
  const [numberSnacks, setNumberSnacks] = useState("20");
  const [cashSelected, setCashSelection] = useState(false);
  const [cardSelected, setCardSelection] = useState(false);
  const [SubsDataExist, setSubsDataExist] = useState(false);
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  useEffect(() => {
    setRemainDays(packageData.remainingDays);
    setTotalPrice(packageData.subscriptionPrice);
    setPkgName(packageData.subscriptionName);
    setSubsStartDate(packageData.subscriptionStartDate);
    setSubsEndDate(packageData.subscriptionEndDate);
    setNumberMeals(packageData.noOfMeals);
    setNumberSnacks(packageData.noOfSnacks);
    setSubsPeriod(packageData.subscriptionDays);
    setSubsDataExist(true);
    setIsLoading(false);
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
              {lang[lang.lang].subsription_data_1}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: "15%", width: "100%" }} />

        {SubsDataExist ? (
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
              <View style={{ height: "2%" }} />
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "space-between",
                  justifyContent: "space-evenly",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    marginHorizontal: "5%",
                    alignItems:"center"
                  }}
                >
                  <Text
                    style={{
                      margin: "4%",
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      fontSize: 15
                      
                    }}
                  >
                    {lang[lang.lang].subscription_data_19}
                  </Text>
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      borderWidth: 7,
                      borderRadius: 200,
                      borderColor: config.color_1,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginVertical: "4%",
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        fontSize: 20,
                      }}
                    >
                      {remainDays}
                      {lang[lang.lang].subscription_data_20}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    marginHorizontal: "5%",
                    marginTop: "5%",
                  }}
                >
                  <Text
                    style={{
                      marginVertical: "4%",
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      fontSize: 15,
                      alignSelf: "center",
                    }}
                  >
                    {lang[lang.lang].subscription_data_21}
                  </Text>
                  <View
                    style={{
                      height: 70,
                      width: 120,
                      backgroundColor: "#DADA95",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        fontSize: 15,
                        alignSelf: "flex-start",
                        marginLeft: "9%",
                      }}
                    >
                      {lang[lang.lang].subscription_data_22}
                    </Text>

                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        fontSize: 20,
                      }}
                    >
                      {totalPrice}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  height: "10%",
                  width: "90%",
                  borderWidth: 3,
                  borderRadius: 10,

                  marginTop: "5%",
                  borderColor: config.color_1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  {lang[lang.lang].subscription_data_23}
                  {subsPeriod}
                  {lang[lang.lang].subscription_data_20}
                </Text>
              </View>
              <View
                style={{
                  height: "10%",
                  width: "90%",
                  borderWidth: 3,
                  marginTop: "5%",
                  borderRadius: 10,
                  borderColor: config.color_1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  {lang[lang.lang].subscription_data_24}
                  {pkgName}
                </Text>
              </View>

              <View
                style={{
                  height: "10%",
                  width: "90%",
                  borderWidth: 3,
                  borderRadius: 10,

                  marginTop: "5%",
                  borderColor: config.color_1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  {lang[lang.lang].subscription_data_25}
                  {subsStartDate}
                </Text>
              </View>

              <View
                style={{
                  height: "10%",
                  width: "90%",
                  borderWidth: 3,
                  borderRadius: 10,

                  marginTop: "5%",
                  borderColor: config.color_1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  {lang[lang.lang].subscription_data_26}
                  {subsEndDate}
                </Text>
              </View>

              <View
                style={{
                  height: "10%",
                  width: "90%",
                  borderWidth: 3,
                  borderRadius: 10,
                  marginTop: "5%",
                  borderColor: config.color_1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  {lang[lang.lang].subscription_data_27}
                  {numbermeals}
                  {lang[lang.lang].subscription_data_28}
                  {numberSnacks} {lang[lang.lang].subscription_data_29}
                </Text>
              </View>
            </Animated.View>
          </View>
        ) : (
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
              <View style={{ height: "2%" }} />

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
                  fontSize: 18,
                }}
              >
                {lang[lang.lang].subscription_data_5}
              </Text>
            </Animated.View>
          </View>
        )}

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
            handler(SubsDataExist);
          }}
        >
          {SubsDataExist ? (
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              }}>
              {lang[lang.lang].subscription_data_30}
            </Text>
          ) : (
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "white",
              fontWeight: '700',
              }}>
              {lang[lang.lang].subscription_data_31}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
};

export default SubscriptionData;

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
    borderWidth: 2,
    borderColor: "black",
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
