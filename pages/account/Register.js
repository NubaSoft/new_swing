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
  Keyboard,
  Alert,
  Dimensions,
  ScrollView,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import OTPTextView from "react-native-otp-textinput";
import CheckBox from "@react-native-community/checkbox";
import axios from "axios";
import CalendarPicker from "react-native-calendar-picker";
import DeviceInfo from "react-native-device-info";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { lang } from "../../lang";
import { colors } from "../../app/theme";

Keyboard.dismiss();
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const lettice = require("../../assets/let.png");
const carrot = require("../../assets/carrot.png");
const otp = require("../../assets/otp.png");
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

var Register = ({
  navigation,
  handler,
  profileHandler,
  setIsLoading,
  backHandlerWelcome,
}) => {
  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [mobilephone, onChangeMobilePhone] = useState("");
  const [dob, onChangeDob] = useState(new Date());
  const [password, onChangePassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [otpNumber, setOtpNumber] = useState("");
  const [trueOtp, setTrueOtp] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [selectedDob, setSelectedDob] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const back_arrow = require("../../assets/back-arrow.png");

  //Actions
  var getDeviceInfo = () => {
    var DeviceInfo = {
      deviceId: "ID",
      deviceOsType: DeviceInfo.getSystemName(),
      deviceOsVersion: DeviceInfo.getSystemVersion(),
      deviceModel: DeviceInfo.getModel(),
      appVersion: "1.0.0",
      pushNotificationToken: "PUSH_NOTIFICATION_TOKEN1",
    };

    // console.log(DeviceInfo);
  };
  var checkRegInfo = () => {
    getDeviceInfo();
    if (name == "" || mobilephone == "") {
      return 0;
    } else if (mobilephone.length != 8) {
      return 3;
    } else {
      return 2;
    }
  };

  var checkUserExistance = () => {
    axios
      .post(config.baseURL + "/api/register/signupGetUserPersonlInfo", {
        mobileNumber: mobilephone,
      })
      .then((response) => {
        console.log("Get Per Info response:", response.data);
        if (response.data.registerUser == 0) {
          //send registeration data
          console.log("Send registeration data");
          axios
            .post(config.baseURL + "/api/sendSmsOtp", {
              mobileNumber: mobilephone,
              language: "en",
            })
            .then(function (response) {
              console.log(response.data.message);
              if (response.data.message == "success") {
                setTrueOtp(response.data.otpCode);
                console.log("OTP CODE:", response.data.otpCode);
                Animated.timing(transAnim, {
                  toValue: 0.5,
                  easing: Easing.in(Easing.elastic(1)),
                  duration: 1600,
                  useNativeDriver: true,
                }).start();
                Keyboard.dismiss();
                setIsLoading(false);
                setIsOtp(true);
              } else {
                Alert.alert(lang[lang.lang].cantSendOTPTryAgain2);
                setIsLoading(false);
              }
            })
            .catch(function (error) {
              console.log(error);
              setIsLoading(false);
            });
        } else {
          Alert.alert(
            lang[lang.lang].registerationFailed, lang[lang.lang].mobileAlreadyUse,
            [{ text: "OK" }]
          );
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        Alert.alert(lang[lang.lang].somethingWentWrong, lang[lang.lang].tryAgainLater, [
          { text: "OK" },
        ]);
      });
  };

  const register = () => {
    //register in backend
    if (password != confirmPassword) {
      Alert.alert(lang[lang.lang].passwordDidntMatchTryAgain);
      setIsLoading(false);
    } else if (password == null || password.length < 9) {
      Alert.alert(lang[lang.lang].passwordMustGreaterThan8Characters);
      setIsLoading(false);
    } else if (!isSelected) {
      Alert.alert(lang[lang.lang].pleaseAgreeTermsConditions);
      setIsLoading(false);
    } else {
      console.log("Ready to register");
      var registerInfo = {
        otpVerified: 1,
        mobileNumber: mobilephone,
        password: password,
        email: email,
        gender: null,
        weight: null,
        height: null,
        firstName: name,
        lastName: "",
        dob: formatDate(dob),
        confirmPassword: confirmPassword,
        deviceDetails: {
          deviceId: "ID",
          deviceOsType: DeviceInfo.getSystemName(),
          deviceOsVersion: DeviceInfo.getSystemVersion(),
          deviceModel: DeviceInfo.getModel(),
          appVersion: "1.0.0",
          pushNotificationToken: "PUSH_NOTIFICATION_TOKEN1",
        },
        addressDetails: {
          area: null,
          block: null,
          street: null,
          jadda: null,
          building: null,
          floor: null,
          flat: null,
        },
        language: "en",
        platform: DeviceInfo.getSystemName(),
        deliveryTime: 1,
      };
      console.log(registerInfo);
      Animated.timing(transAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1600,
        useNativeDriver: true,
      }).start();
      profileHandler(registerInfo);
    }
  };

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
        {selectedDob ? (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#C4C4C4C4",
              zIndex: 9999,
              alignItems: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "white",
                borderColor: config.color_1,
                borderWidth: 4,
                width: "90%",
                alignSelf: "center",
                alignItems: "center",
                marginTop: "60%",
                margin: 20,
                borderRadius: 20,
              }}
            >
              <CalendarPicker
                selectedDayColor={config.color_1}
                onDateChange={onChangeDob}
                width={0.8 * windowWidth}
              />
            </View>
            <View style={{ height: "5%" }} />
            <TouchableOpacity
              style={{
                width: "85%",
                height: "6%",
                backgroundColor: config.color_1,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                borderColor: "black",
                borderWidth: 2,
              }}
              onPress={() => {
                setSelectedDob(false);
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 18,
                }}
              >
                {lang[lang.lang].register_1}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}

        <View style={{ height: "5%", width: "100%" }} />
        <View style={styles.inputBody}>
          {/* First Registeration Page */}
          <View
            style={{
              position: "absolute",
              left: 20,
              top: 30,
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
                backHandlerWelcome();
              }}
            >
              {/* <Image source={back_arrow} style={{ height: 30, width: 30 }} /> */}
              <Ionicons name="home" size={30} color={config.color_1} />
            </TouchableOpacity>
          </View>

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
                    outputRange: [0, -2 * windowWidth],
                  }),
                },
              ],
            }}
          >
            <View style={{ height: "20%" }} />
            <TouchableOpacity
              style={{
                width: "100%",
              }}
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <Image
                source={lettice}
                style={{
                  height: 80,
                  width: 50,
                  marginRight: "60%",
                  marginLeft: "10%",
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                width: "95%",
                alignSelf: "center",
                marginLeft: "15%",
                height: "40%",
                flexGrow: 1,
              }}
            >
              <View style={styles.field}>
                <TextInput
                  style={{ margin: 20, height: 100 }}
                  autoCorrect={false}
                  placeholder={lang[lang.lang].register_2}
                  placeholderTextColor="black"
                  onChangeText={onChangeName}
                  textAlign={lang.lang == "ar" ? "right" : "left"}
                ></TextInput>
              </View>
              <View style={styles.field}>
                <TextInput
                  style={{ margin: 20, height: 100 }}
                  autoCorrect={false}
                  placeholder={lang[lang.lang].register_3}
                  autoCompleteType={"tel"}
                  keyboardType="number-pad"
                  placeholderTextColor="black"
                  onChangeText={onChangeMobilePhone}
                  textAlign={lang.lang == "ar" ? "right" : "left"}
                ></TextInput>
              </View>
              <View style={styles.field}>
                <TextInput
                  style={{ margin: 20, height: 100 }}
                  autoCorrect={false}
                  placeholder={lang[lang.lang].register_4}
                  onChangeText={onChangeEmail}
                  placeholderTextColor="black"
                  textAlign={lang.lang == "ar" ? "right" : "left"}
                ></TextInput>
              </View>
              <TouchableOpacity
                style={styles.field}
                onPress={() => {
                  setSelectedDob(true);
                  Keyboard.dismiss();
                }}
              >
                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    color: "black",
                    fontSize: 14,
                    color: "#00000077",
                    textAlign: lang.lang == "ar" ? "right" : "left",
                  }}
                >
                  {lang[lang.lang].register_5}
                  {formatDate(dob)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: "5%" }} />

            <View style={{ height: "1%" }} />
            <TouchableOpacity
              style={{
                width: "85%",
                height: "6%",
                backgroundColor: config.color_1,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8%",
                borderColor: "black",
                borderWidth: 2,
              }}
              onPress={async () => {
                var check = checkRegInfo();
                if (check == 2) {
                  setIsLoading(true);
                  checkUserExistance();
                } else if (check == 0) {
                  Alert.alert(lang[lang.lang].register_alert_6);
                } else if (check == 1) {
                  Alert.alert(lang[lang.lang].register_alert_7);
                } else if (check == 3) {
                  Alert.alert(lang[lang.lang].register_alert_8);
                }
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 18,
                }}
              >
                {lang[lang.lang].register_9}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: lang.lang == "ar" ? "row-reverse" : "row",
                height: 50,
                marginTop: "2%",
                marginBottom: "5%",
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 18,
                  alignSelf: "center",
                  marginBottom: "1%",
                }}
              >
                {lang[lang.lang].register_10}
              </Text>

              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  width: "30%",
                  marginLeft: "3%",
                  marginRight: "3%",
                  height: "40%",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  Animated.timing(transAnim, {
                    toValue: 0,
                    easing: Easing.in(Easing.elastic(1)),
                    duration: 1600,
                    useNativeDriver: true,
                  }).start();
                  handler();
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 12,
                    textDecorationLine: "underline",
                  }}
                >
                  {lang[lang.lang].register_11}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* OTP Verification Page */}
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
                    outputRange: [windowWidth, -windowWidth],
                  }),
                },
              ],
            }}
          >
            <View style={{ height: "25%" }} />
            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <Image source={otp} style={{ height: 113, width: 79 }} />
              <View style={{ height: "2.5%" }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {lang[lang.lang].register_12}
              </Text>
              <View style={{ height: "2.5%" }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 14,
                }}
              >
                {lang[lang.lang].register_13}
              </Text>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 14,
                }}
              >
                {lang[lang.lang].register_14}
                {trueOtp}
              </Text>
            </TouchableOpacity>
            {isOtp ? (
              <OTPTextView
                tintColor={config.color_1}
                handleTextChange={(e) => {
                  setOtpNumber(e);
                  if (e.length == 6) {
                    console.log("true otp:", trueOtp);
                    console.log("entered otp:", e);
                    if (e == trueOtp) {
                      Keyboard.dismiss();
                      Animated.timing(transAnim, {
                        toValue: 1,
                        easing: Easing.in(Easing.elastic(1)),
                        duration: 1600,
                        useNativeDriver: true,
                      }).start();
                    } else {
                      Alert.alert(lang[lang.lang].register_alert_16);
                    }
                  }
                }}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
                defaultValue=""
                selectionColor={"white"}
                inputCount={6}
                keyboardType={"number-pad"}
              />
            ) : (
              <View />
            )}

            <View style={{ height: "2.5%" }} />
            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: "black",
                fontSize: 18,
              }}
            >
              {lang[lang.lang].register_15}
            </Text>
            <TouchableOpacity
              style={{
                width: "50%",
                height: "8%",
                backgroundColor: config.color_1 + "BB",
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                borderColor: "black",
                borderWidth: 2,
              }}
              onPress={() => {
                Animated.timing(transAnim, {
                  toValue: 0,
                  easing: Easing.in(Easing.elastic(1)),
                  duration: 1600,
                  useNativeDriver: true,
                }).start();
                setIsOtp(false);
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 18,
                }}
              >
                {lang[lang.lang].register_17}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Password Page */}
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
                    outputRange: [2 * windowWidth, 0],
                  }),
                },
              ],
            }}
          >
            <View style={{ height: "20%" }} />
            <Image
              source={carrot}
              style={{ height: 80, width: 50, marginRight: "70%" }}
            />
            <View style={styles.field}>
              <TextInput
                style={{ margin: 20, height: 100 }}
                autoCorrect={false}
                placeholder={lang[lang.lang].register_18}
                onChangeText={onChangePassword}
                secureTextEntry={true}
                placeholderTextColor="black"
                textAlign={lang.lang == "ar" ? "right" : "left"}
              ></TextInput>
            </View>
            <View style={{ height: "2.5%" }} />
            <View style={styles.field}>
              <TextInput
                style={{ margin: 20, height: 100 }}
                autoCorrect={false}
                placeholder={lang[lang.lang].register_19}
                onChangeText={onChangeConfirmPassword}
                secureTextEntry={true}
                placeholderTextColor="black"
                textAlign={lang.lang == "ar" ? "right" : "left"}
              ></TextInput>
            </View>
            <View style={{ height: "5%" }} />

            <View
              style={{
                width: "80%",
                flexDirection: lang.lang == "ar" ? "row-reverse" : "row",
              }}
            >
              <CheckBox
                value={isSelected}
                onValueChange={setSelection}
                style={{
                  borderRadius: 5,
                  backgroundColor: "white",
                  marginTop: "1%",
                }}
              />
              <View style={{ height: "2.5%", width: "3%" }} />
              <TouchableOpacity
                onPress={() => Linking.openURL('https://nubasoft.net/cust_photos/terms.pdf')}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color:colors.black,
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].register_20}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* First Registeration Page Next Button*/}
        <View style={{ height: "2%", width: "100%" }} />
        {/* <Animated.View
          style={{
            position: "absolute",
            top: "88%",
            height: "100%",
            width: "100%",
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
          <Text
            style={{
              // marginRight: "20%",
              fontFamily: "Handlee_400Regular",
              color: "black",
              fontSize: 18,
              alignSelf: "center",
              marginBottom: "1%",
            }}
          >
            {"Do you have an account?"}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: config.color_1 }]}
            onPress={() => {
              Animated.timing(transAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1600,
                useNativeDriver: true,
              }).start();
              handler();
            }}
          >
            <Text style={{ fontFamily: "Handlee_400Regular", color: "white" }}>
              {"Sign in"}
            </Text>
          </TouchableOpacity>
        </Animated.View> */}

        {/* Second OTP Verification Button */}
        <Animated.View
          style={{
            position: "absolute",
            top: "88%",
            height: "100%",
            width: "100%",
            alignItems: "center",
            transform: [
              {
                translateY: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 600],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  otpNumber.length == 6 ? config.color_1 : "#C4C4C4",
              },
            ]}
            onPress={() => {
              if (otpNumber.length != 6) {
                Alert.alert("Please input your access code");
              }
            }}
          >
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "white",
              }}>
              {lang[lang.lang].register_21}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Third Registeratiobn Button */}
        <Animated.View
          style={{
            position: "absolute",
            top: "88%",
            height: "100%",
            width: "100%",
            alignItems: "center",
            transform: [
              {
                translateY: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: config.color_1,
                height: "6%",
                width: "70%",
                borderColor: "black",
                borderWidth: 2,
              },
            ]}
            onPress={() => {
              setIsLoading(true);
              register();
            }}
          >
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              }}>
              {lang[lang.lang].register_22}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
};

export default Register;

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
    height: "90%",
    alignItems: "center",
  },
  button: {
    width: "60%",
    height: "3%",
    borderRadius: 15,

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
    width: "90%",
    height: 50,
    zIndex: 999,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: "5%",
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
