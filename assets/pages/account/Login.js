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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import axios from "axios";
import AwesomeLoading from "react-native-awesome-loading";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DeviceInfo from "react-native-device-info";
import OTPTextView from "react-native-otp-textinput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lang } from "../../lang";
const back_arrow = require("../../assets/back-arrow.png");
const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const lettice = require("../../assets/let.png");
const carrot = require("../../assets/carrot.png");
const otp = require("../../assets/otp.png");

var Login = ({
  navigation,
  handler,
  AfterLoginHandler,
  setIsLoading,
  backHandlerWelcome,
}) => {
  const [mobilephone, onChangeMobilePhone] = useState("");
  const [password, onChangePassword] = useState("");
  const [ResetPasswordFlag, setResetPasswordFlag] = useState(false);
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [otpNumber, setOtpNumber] = useState("");
  const [trueOtp, setTrueOtp] = useState("");
  useEffect(() => {
    setIsLoading(false);
    Keyboard.dismiss();
  }, []);
  //Actions

  const login = () => {
    
    axios
      .post(config.baseURL + "/api/auth/login", {
        mobileNumber: mobilephone,
        password: password,
        deviceId: "ID",
        deviceOsType: DeviceInfo.getSystemName(),
        deviceOsVersion: DeviceInfo.getSystemVersion(),
        deviceModel: DeviceInfo.getModel(),
        appVersion: "1.0.0",
        language: "en",
        platform: DeviceInfo.getSystemName(),
        pushNotificationToken: "PUSH_NOTIFICATION_TOKEN1",
      })
      .then(function (response) {
        console.log('response----------------', response);
        
        // console.log(response.data);
        config.Token = response.data.accessToken;
        config.profile = response.data;
        AsyncStorage.setItem("keepLoggedIn", JSON.stringify(true));
        AsyncStorage.setItem("data", JSON.stringify(response.data));

        AfterLoginHandler(mobilephone);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log('error---------------', error);
        
        // console.log(error.message);
        Alert.alert(lang[lang.lang].loginFailed, lang[lang.lang].checkLoginDataAndTryAgain);
        setIsLoading(false);
      });
  };

  var checkUserExistance = () => {
    setIsLoading(true);
    axios
      .post(config.baseURL + "/api/sendSmsOtp", {
        mobileNumber: mobilephone,
        language: "en",
      })
      .then(function (response) {
        console.log(response.data.message);
        setIsLoading(false);
        if (response.data.message == "success") {
          setTrueOtp(response.data.otpCode);
          console.log("OTP CODE:", response.data.otpCode);
          Animated.timing(transAnim, {
            toValue: 0.5,
            easing: Easing.in(Easing.elastic(1)),
            duration: 1600,
            useNativeDriver: true,
          }).start();
        } else {
          Alert.alert(lang[lang.lang].cantSendOTPTryAgain);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };
  var backHandler = () => {
    setResetPasswordFlag(false);
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1600,
      useNativeDriver: true,
    }).start();
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert(lang[lang.lang].didntMatchTryAgain)
      setIsLoading(false)
    } else if (password == null || password.length < 9) {
      Alert.alert(lang[lang.lang].passwordMustGreaterThan8Characters)
      setIsLoading(false)
    } else {
      setIsLoading(true);
      const response1 = await axios.post(config.baseURL + "/api/auth/verifyResetOtpCode", {
        mobileNumber: mobilephone,
        otpCode: otpNumber,
        centerId: config.branch_code,
      })
      if (response1?.data?.accessToken) {
        console.log("response1_data_accessToken-------", response1?.data?.accessToken)
        console.log("password-------", password)
        config.Token = response1.data.accessToken
        const response2 = await axios.post(
          config.baseURL + "/api/auth/resetPassword",
          {
            newPassword: password,
            centerId: config.branch_code,
          },
          {
            headers: {
              Authorization: `bearer ${config.Token}`,
            },
          },
        )
        if (response2) {
          console.log("response1_data_accessToken-------", response2?.data)
          // console.log('password-------', password);
          Alert.alert(lang[lang.lang].changedSuccessfully)
          setResetPasswordFlag(false)
          setIsLoading(false)
          Animated.timing(transAnim, {
            toValue: 0,
            easing: Easing.in(Easing.elastic(1)),
            duration: 1600,
            useNativeDriver: true,
          }).start()
        } else {
          console.log("response2-------", "error")
          Alert.alert(lang[lang.lang].cantTesetPasswordTryAgain)
          setResetPasswordFlag(false)
          setIsLoading(false)
          Animated.timing(transAnim, {
            toValue: 0,
            easing: Easing.in(Easing.elastic(1)),
            duration: 1600,
            useNativeDriver: true,
          }).start()
        }
      } else {
        console.log("response1-------==========>>>>>", "error")
        Alert.alert(lang[lang.lang].cantVerifyOtp)
        setResetPasswordFlag(false)
        setIsLoading(false)
        Animated.timing(transAnim, {
          toValue: 0,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1600,
          useNativeDriver: true,
        }).start()
      }
    }
  }

  const register = () => {
    //register in backend
    if (password != confirmPassword) {
      Alert.alert(lang[lang.lang].didntMatchTryAgain);
      setIsLoading(false);
    } else if (password == null || password.length < 9) {
      Alert.alert(lang[lang.lang].passwordMustGreaterThan8Characters);
      setIsLoading(false);
    } else {
      console.log("Ready to resetPassword");
      console.log({ mobileNumber: mobilephone, otpCode: otpNumber });
      axios
        .post(config.baseURL + "/api/auth/verifyResetOtpCode", {
          mobileNumber: mobilephone,
          otpCode: otpNumber,
        })
        .then((response) => {
          console.log(response.data);
          config.Token = response.data.accessToken;
          axios
            .post(
              config.baseURL + "/api/auth/resetPassword",
              {
                newPassword: password,
              },
              {
                headers: {
                  Authorization: `bearer ${config.Token}`,
                },
              }
            )
            .then((response) => {
              console.log(response.data);
              Alert.alert(lang[lang.lang].changedSuccessfully);
              setResetPasswordFlag(false);
              setIsLoading(false);
              Animated.timing(transAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1600,
                useNativeDriver: true,
              }).start();
            })
            .catch((e) => {
              console.log(e);
              Alert.alert(lang[lang.lang].cantTesetPasswordTryAgain);
              setResetPasswordFlag(false);
              setIsLoading(false);
              Animated.timing(transAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1600,
                useNativeDriver: true,
              }).start();
            });
        })
        .catch((e) => {
          console.log('=========>>>>>>>>>>>>>>>>', e);
          Alert.alert(lang[lang.lang].cantVerifyOtp);
          setResetPasswordFlag(false);
          setIsLoading(false);
          Animated.timing(transAnim, {
            toValue: 0,
            easing: Easing.in(Easing.elastic(1)),
            duration: 1600,
            useNativeDriver: true,
          }).start();
        });
      onChangePassword("");
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
        {ResetPasswordFlag ? (
          <View></View>
        ) : (
          <View
            style={{
              position: "absolute",
              left: 30,
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
                Keyboard.dismiss();
                backHandlerWelcome();
              }}
            >
              <Image source={back_arrow} style={{ height: 30, width: 30 }} />
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: "5%", width: "100%" }} />
        {ResetPasswordFlag ? (
          <View style={styles.inputBody}>
            {/* First Registeration Page */}
            <View
              style={{
                position: "absolute",
                left: 20,
                top: 5,
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
                      outputRange: [0, -4000],
                    }),
                  },
                ],
              }}
            >
              <View style={{ height: "22%" }} />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 40,
                  justifyContent: "space-between",
                }}
              >
                <Ionicons
                  name="key-sharp"
                  size={30}
                  color="black"
                  marginRight="10%"
                />
                <Text
                  style={{
                    fontSize: 24,
                    alignSelf: "center",
                    // fontFamily: "Handlee_400Regular",
                  }}
                >
                  {lang[lang.lang].login_1}
                </Text>
              </View>

              <KeyboardAwareScrollView
                style={{
                  width: "95%",
                  alignSelf: "center",
                  marginLeft: "15%",
                  height: "60%",
                }}
              >
                <View style={styles.fieldcp}>
                  <TextInput
                    style={{ margin: 20, height: 100 }}
                    autoCorrect={false}
                    placeholder={lang[lang.lang].login_2}
                    autoCompleteType={"tel"}
                    keyboardType="number-pad"
                    placeholderTextColor="black"
                    onChangeText={onChangeMobilePhone}
                    textAlign={lang.lang == "ar" ? "right" : "left"}
                  ></TextInput>
                </View>
              </KeyboardAwareScrollView>

              <View style={{ height: "5%" }} />

              <TouchableOpacity
                style={{
                  width: "85%",
                  height: "6%",
                  backgroundColor: config.color_1,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "8%",
                }}
                onPress={async () => {
                  checkUserExistance();
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].login_3}
                </Text>
              </TouchableOpacity>
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
                      outputRange: [2000, -2000],
                    }),
                  },
                ],
              }}
            >
              <View style={{ height: "25%" }} />
              <Image source={otp} style={{ height: 113, width: 79 }} />
              <View style={{ height: "2.5%" }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {lang[lang.lang].login_4}
              </Text>
              <View style={{ height: "2.5%" }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 14,
                }}
              >
                {lang[lang.lang].login_5}
              </Text>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 14,
                }}
              >
                {lang[lang.lang].login_6}
                {trueOtp}
              </Text>

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
                      Alert.alert(lang[lang.lang].enterOTPNumber);
                    }
                  }
                }}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
                defaultValue=""
                selectionColor={"black"}
                inputCount={6}
              />

              <View style={{ height: "2.5%" }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 18,
                }}
              >
                {lang[lang.lang].login_7}
              </Text>
              <TouchableOpacity
                style={{
                  width: "50%",
                  height: "8%",
                  backgroundColor: config.color_1 + "BB",
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].login_8}
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
                      outputRange: [4000, 0],
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
              <View style={styles.fieldcp}>
                <TextInput
                  style={{ margin: 20, height: 100 }}
                  autoCorrect={false}
                  placeholder={lang[lang.lang].login_9}
                  onChangeText={onChangePassword}
                  secureTextEntry={true}
                  placeholderTextColor="black"
                  textAlign={lang.lang == "ar" ? "right" : "left"}
                ></TextInput>
              </View>
              <View style={{ height: "2.5%" }} />
              <View style={styles.fieldcp}>
                <TextInput
                  style={{ margin: 20, height: 100 }}
                  autoCorrect={false}
                  placeholder={lang[lang.lang].login_10}
                  onChangeText={onChangeConfirmPassword}
                  secureTextEntry={true}
                  placeholderTextColor="black"
                  textAlign={lang.lang == "ar" ? "right" : "left"}
                ></TextInput>
              </View>
              <View style={{ height: "30%" }} />
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
                    width: "90%",
                  },
                ]}
                onPress={() => {
                  setIsLoading(true);
                  // register();
                  resetPassword();
                }}
              >
                <Text
                  style={{ 
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                   }}
                >
                  {lang[lang.lang].login_11}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.inputBody}>
            {/* First Login Page */}

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
                      outputRange: [0, -2000],
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
                  source={purp}
                  style={{ height: 71, width: 64, marginRight: "70%" }}
                />
              </TouchableOpacity>
              <View style={styles.field}>
                <TextInput
                  style={{ margin: 20, height: 100 }}
                  autoCorrect={false}
                  placeholder={lang[lang.lang].login_12}
                  keyboardType="number-pad"
                  placeholderTextColor={"black"}
                  onChangeText={onChangeMobilePhone}
                  textAlign={lang.lang == "ar" ? "right" : "left"}
                ></TextInput>
              </View>
              <View style={{ height: "2.5%" }} />
              <View style={styles.field}>
                <TextInput
                  style={{ margin: 20, height: 100 }}
                  onChangeText={onChangePassword}
                  value={password}
                  placeholder={lang[lang.lang].login_13}
                  placeholderTextColor={"black"}
                  secureTextEntry={true}
                  textAlign={lang.lang == "ar" ? "right" : "left"}
                ></TextInput>
              </View>
              <View style={{ height: "1%" }} />
              <TouchableOpacity
                style={{
                  marginLeft: "55%",
                  width: "30%",
                  height: "3%",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setResetPasswordFlag(true);
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
                  {lang[lang.lang].login_14}
                </Text>
              </TouchableOpacity>
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
                  setIsLoading(true);
                  login();
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 16,
                    fontWeight: '700'

                  }}
                >
                  {lang[lang.lang].login_15}
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: lang.lang == "ar" ? "row-reverse" : "row",
                  height: "10%",
                  marginTop: "2%",
                  width: "100%",
                  alignSelf: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 18,
                    alignSelf: "center",
                    marginBottom: "1%",
                  }}
                >
                  {lang[lang.lang].login_16}
                </Text>

                <TouchableOpacity
                  style={{
                    width: "30%",
                    margin: "3%",
                    height: "40%",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={handler}
                >
                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "white",
                      fontSize: 12,
                      textDecorationLine: "underline",
                    }}
                  >
                    {lang[lang.lang].login_17}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: "19%",
                  width: "33%",
                  marginVertical: "3%",
                }}
              >
                <Image
                  source={groceries}
                  style={{ height: "90%", width: "90%", resizeMode: "contain" }}
                />
              </View>
            </Animated.View>
            <View style={{ height: "2%", width: "100%" }} />
          </View>
        )}
      </View>
    );
  }
};

export default Login;

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
    height: "4%",
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
    zIndex: 996,
  },
  field: {
    width: "85%",
    height: "8%",
    zIndex: 997,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
  },
  fieldcp: {
    width: "90%",
    height: 50,
    zIndex: 997,
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
