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
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import { lang } from "../../lang";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const pm = require("../../assets/personal.png");
const male_img = require("../../assets/pro.png");
const subs_image = require("../../assets/transaction.png");
const back_arrow = require("../../assets/back-arrow.png");
const calendar_img = require("../../assets/calendar.png");
const settings_img = require("../../assets/settings.png");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
var PersonalInfo = ({
  navigation,
  profileHandler,
  editProfileHandler,
  personalHandler,
  settingsHandler,
  setIsLoading,
  handleBack,
  editAllergDisHandler,
  logoutHandler,
}) => {
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  var deleteAccount = () => {
    setIsLoading(true);
    axios
      .post(
        config.baseURL + "/api/auth/deleteAccount",
        {
          key: 0,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.message == "success") {
          logoutHandler();
        }
      })
      .catch((e) => {
        console.log(e);
        // setIsLoading(false);
      });
  };

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View style={styles.body}>
        <View
          style={{
            position: "absolute",
            left: 30,
            top: 70,
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
              console.log("Profile pressed");
              handleBack();
            }}
          >
            <Image
              source={calendar_img}
              style={{ height: 50, width: 30, resizeMode: "stretch" }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            right: 30,
            top: 70,
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
              console.log("Settings pressed");
              settingsHandler(true);
            }}
          >
            <Image
              source={settings_img}
              style={{ height: 50, width: 30, resizeMode: "stretch" }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: "12%", width: "100%" }} />
        <View style={styles.inputBody}>
          {/* First Profile Page */}

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
            <View style={{ height: "3%" }} />

            <View
              style={{
                width: 150,
                height: 150,
                backgroundColor: config.color_2,
                borderRadius: 200,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={pm} style={{ height: "65%", width: "65%" }} />
            </View>

            <View style={{ height: "3%" }} />

            <View
              style={{
                // height: "7%",
                backgroundColor: config.color_1 + "CC",
                borderRadius: 30,
                padding: 10,
                width: "70%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="person" size={28} color="white" />
                <View style={{ width: "5%" }} />
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 20,
                    marginLeft: "3%",
                    textAlign: "center",
                  }}
                >
                  {config.profile.name}
                </Text>
              </View>

              {/* <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="cake" size={28} color="black" />
                <View style={{ width: "5%" }} />
                <Text
                  style={{
                    fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 20,
                    marginLeft: "3%",
                    textAlign: "center",
                  }}
                >
                  {config.profile.birthDate.split("T")[0]}
                </Text>
              </View> */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="mail" size={28} color="white" />
                <View style={{ width: "5%" }} />
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 20,
                    marginLeft: "3%",
                    textAlign: "center",
                  }}
                >
                  {config.profile.email}
                </Text>
              </View>
            </View>
            <View style={{ height: "5%" }} />

            <TouchableOpacity
              style={{
                width: "100%",
                height: "7%",
                backgroundColor: config.color_1 + "BB",
                borderRadius: 20,
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={() => {
                console.log("Edit Profile Pressed");
                editProfileHandler();
              }}
            >
              <Image
                source={male_img}
                style={{
                  height: "95%",
                  width: "10%",
                  alignSelf: "flex-start",
                  marginHorizontal: "5%",
                  color: 'white'
                }}
              />

              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "white",
                  fontSize: 20,
                  marginLeft: "3%",
                }}
              >
                {lang[lang.lang].personal_profile_1}
              </Text>

              <TouchableOpacity
                style={{
                  // backgroundColor: config.color_2,
                  borderRadius: 20,
                  alignSelf: "flex-end",
                  flex: 1,
                  width: "15%",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  console.log("Edit Profile Pressed");
                  editProfileHandler();
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={40}
                  color="white"
                  style={{
                    marginRight: "5%",
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                height: "7%",
                backgroundColor: config.color_1 + "BB",
                borderRadius: 20,
                // alignContent: "center",
                // justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "5%",
              }}
              onPress={() => {
                console.log("Account Subscriptions Pressed");
                setIsLoading(true);
                personalHandler();
              }}
            >
              <Image
                source={subs_image}
                style={{
                  height: "95%",
                  width: "10%",
                  alignSelf: "flex-start",
                  marginHorizontal: "5%",
                }}
              />

              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "white",
                  fontSize: 20,
                  marginLeft: "3%",
                }}
              >
                {lang[lang.lang].personal_profile_2}
              </Text>

              <TouchableOpacity
                style={{
                  // backgroundColor: config.color_2,
                  borderRadius: 20,
                  alignSelf: "flex-end",
                  flex: 1,
                  width: "15%",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  console.log("Account Subscriptions Pressed");
                  setIsLoading(true);
                  personalHandler();
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={40}
                  color="white"
                  style={{
                    marginRight: "5%",
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                width: "100%",
                height: "7%",
                backgroundColor: config.color_1 + "BB",
                borderRadius: 20,
                // alignContent: "center",
                // justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "5%",
              }}
              onPress={() => {
                console.log("Dislikes and Allergies Pressed");
                editAllergDisHandler();
              }}
            >
              <Ionicons
                name="add-circle"
                size={40}
                color="black"
                style={{
                  height: "95%",
                  width: "10%",
                  alignSelf: "flex-start",
                  marginHorizontal: "5%",
                }}
              />

              <Text
                style={{
                  fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 20,
                  marginLeft: "3%",
                }}
              >
                {lang[lang.lang].personal_profile_3}
              </Text>

              <TouchableOpacity
                style={{
                  // backgroundColor: config.color_2,
                  borderRadius: 20,
                  alignSelf: "flex-end",
                  flex: 1,
                  width: "15%",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  console.log("Dislikes and Allergies Pressed");
                  editAllergDisHandler();
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={40}
                  color="black"
                  style={{
                    marginRight: "5%",
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity> */}

            {/* 
            <View
              style={{
                width: "100%",
                height: "7%",
                backgroundColor: config.color_6,
                borderRadius: 20,
                // alignContent: "center",
                // justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "5%",
              }}
            >
              <Image
                source={per_img}
                style={{
                  height: "85%",
                  width: "10%",
                  alignSelf: "flex-start",
                  marginHorizontal: "5%",
                }}
              />

              <Text
                style={{
                  fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 20,
                  marginLeft: "3%",
                }}
              >
                {"Contact personal assistant"}
              </Text>

              <TouchableOpacity
                style={{
                  // backgroundColor: config.color_2,
                  borderRadius: 20,
                  alignSelf: "flex-end",
                  flex: 1,
                  width: "15%",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  console.log("Contact personal assistant Pressed");
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={40}
                  color="black"
                  style={{
                    marginRight: "5%",
                  }}
                />
              </TouchableOpacity>
            </View> */}
            <TouchableOpacity
              style={{
                idth: "100%",
                height: "7%",
                backgroundColor: config.color_1 + "BB",
                borderRadius: 20,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "5%",
              }}
              onPress={() => {
                Alert.alert(
                  lang[lang.lang].personal_profile_8,
                  lang[lang.lang].personal_profile_5,
                  [
                    { text: lang[lang.lang].personal_profile_6 },
                    {
                      text: lang[lang.lang].personal_profile_7,
                      onPress: () =>
                        Alert.alert(
                          lang[lang.lang].personal_profile_8,
                          lang[lang.lang].personal_profile_9,
                          [
                            {
                              text: lang[lang.lang].personal_profile_10,
                              onPress: () => deleteAccount(),
                            },
                            { text: lang[lang.lang].personal_profile_11 },
                          ]
                        ),
                    },
                  ]
                );
              }}
            >
              <MaterialIcons
                name="delete-sweep"
                size={windowWidth * 0.09}
                color="black"
                style={{
                  height: "95%",
                  width: "10%",
                  alignSelf: "flex-start",
                  marginHorizontal: "5%",
                }}
              />

              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "white",
                  fontSize: 20,
                  marginLeft: "3%",
                }}
              >
                {lang[lang.lang].personal_profile_4}
              </Text>

              <TouchableOpacity
                style={{
                  // backgroundColor: config.color_2,
                  borderRadius: 20,
                  alignSelf: "flex-end",
                  flex: 1,
                  width: "15%",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  console.log("Delete profile Pressed");
                  Alert.alert(
                    lang[lang.lang].personal_profile_8,
                    lang[lang.lang].personal_profile_5,
                    [
                      { text: lang[lang.lang].personal_profile_6 },
                      {
                        text: lang[lang.lang].personal_profile_7,
                        onPress: () =>
                          Alert.alert(
                            lang[lang.lang].personal_profile_8,
                            lang[lang.lang].personal_profile_9,
                            [
                              {
                                text: lang[lang.lang].personal_profile_10,
                                onPress: () => deleteAccount(),
                              },
                              {
                                text: lang[lang.lang].personal_profile_11,
                              },
                            ]
                          ),
                      },
                    ]
                  );
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={40}
                  color="white"
                  style={{
                    marginRight: "5%",
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Image
          source={groceries}
          style={{
            height: "10%",
            width: "45%",
            position: "absolute",
            bottom: 40,
            resizeMode: "contain",
          }}
        />
      </View>
    );
  }
};

export default PersonalInfo;

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
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
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
    height: "75%",
    alignItems: "center",
  },
  maleBody: {
    borderRadius: 15,
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  femaleBody: {
    borderRadius: 15,
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "95%",
    height: "8%",
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
