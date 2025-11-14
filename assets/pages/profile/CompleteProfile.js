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
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import Slider from "@react-native-community/slider";
import { lang } from "../../lang";

const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const otp = require("../../assets/otp.png");
const hm = require("../../assets/healthy_man.png");
const male_img = require("../../assets/male.png");
const female_img = require("../../assets/female.png");
const scale = require("../../assets/scale.png");
const ruler = require("../../assets/ruler.png");

var CompleteProfile = ({ navigation, handler, profileHandler }) => {
  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [height, setHeight] = useState(50);
  const [weight, setWeight] = useState(30);

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
        <View style={{ height: "20%", width: "100%" }} />
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

            <View style={{ flexDirection: "row" }}>
              <Image source={hm} style={{ height: "125%", width: "12%" }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {lang[lang.lang].complete_profile_1}
              </Text>
            </View>
            <View style={{ height: "15%" }} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                height: "45%",
                justifyContent: "space-evenly",
              }}
            >
              <View style={{ width: "10%" }} />

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "22%",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.maleBody,
                    {
                      backgroundColor: isMale ? "#3CA3DD" : "#3CA3DD20",
                      borderWidth: isMale ? 1 : 0,
                    },
                  ]}
                  onPress={() => {
                    setIsMale(true);
                    setIsFemale(false);
                  }}
                >
                  <Image source={male_img} style={{ height: 75, width: 30 }} />
                </TouchableOpacity>
                <View style={{ height: "2%" }} />

                <TouchableOpacity
                  style={[
                    styles.femaleBody,
                    {
                      backgroundColor: isFemale ? "#E6BBB9" : "#E6BBB930",
                      borderWidth: isFemale ? 1 : 0,
                    },
                  ]}
                  onPress={() => {
                    setIsFemale(true);
                    setIsMale(false);
                  }}
                >
                  <Image
                    source={female_img}
                    style={{ height: 75, width: 30 }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ color: "red", alignSelf: "flex-start" }}>*</Text>
              <View style={{ width: "5%" }}></View>
              <View style={styles.verticleLine}></View>
              <View style={{ width: "5%" }}></View>

              <View
                style={{
                  flexDirection: "column",
                  width: "50%",
                  height: "100%",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    height: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: config.color_1,
                    borderRadius: 15,
                  }}
                >
                  <Image source={ruler} style={{ width: 30, height: 30 }} />
                  <View style={{ height: "5%" }} />
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: "white",
                        borderRadius: 10,
                        borderWidth: 5,
                        borderColor: "white",
                      }}
                    >
                      <Text
                        style={{
                          // fontFamily: "Handlee_400Regular",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {height} {lang[lang.lang].complete_profile_2}
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: "5%" }} />

                  <Slider
                    style={{ width: "90%", height: "10%" }}
                    minimumValue={50}
                    maximumValue={250}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="black"
                    onValueChange={(e) => {
                      setHeight(parseInt(e));
                    }}
                  />

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                    }}
                  >
                    {lang[lang.lang].complete_profile_3}
                  </Text>
                </View>
                <View style={{ height: "10%" }} />

                <View
                  style={{
                    width: "80%",
                    height: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: config.color_1,
                    borderRadius: 15,
                  }}
                >
                  <Image source={scale} style={{ width: 30, height: 30 }} />
                  <View style={{ height: "5%" }} />
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: "white",
                        borderRadius: 10,
                        borderWidth: 5,
                        borderColor: "white",
                      }}
                    >
                      <Text
                        style={{
                          // fontFamily: "Handlee_400Regular",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {weight} {lang[lang.lang].complete_profile_4}
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: "5%" }} />
                  <Slider
                    style={{ width: "90%", height: "10%" }}
                    minimumValue={30}
                    maximumValue={250}
                    minimumTrackTintColor="#FFFFFF"
                    thumbTintColor="black"
                    maximumTrackTintColor="#000000"
                    onValueChange={(e) => {
                      setWeight(parseInt(e));
                    }}
                  />

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                    }}
                  >
                    {lang[lang.lang].complete_profile_5}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: "20%" }} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                var gender = 1;
                var sendHandler = true;
                if (isMale) {
                  gender = 1;
                } else if (isFemale) {
                  gender = 2;
                } else {
                  sendHandler = false;
                  Alert.alert(lang[lang.lang].chooseGender);
                }
                if (sendHandler) {
                  Animated.timing(transAnim, {
                    toValue: 1,
                    easing: Easing.in(Easing.elastic(1)),
                    duration: 1600,
                    useNativeDriver: true,
                  }).start();
                  profileHandler(gender, height, weight);
                }
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                }}
              >
                {lang[lang.lang].complete_profile_6}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }
};

export default CompleteProfile;

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
    backgroundColor: "#DBDBDBCC",
    borderRadius: 15,
    width: "90%",
    height: "75%",
    alignItems: "center",
  },
  maleBody: {
    borderRadius: 15,
    width: "80%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  femaleBody: {
    borderRadius: 15,
    width: "80%",
    height: "30%",
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
    borderColor: "black",
    borderWidth: 2,
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
