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
  Linking,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import { WebView } from "react-native-webview";
const back_arrow = require("../../assets/back-arrow.png");
const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const cardimg = require("../../assets/card.png");
const cross = require("../../assets/cross.png");
const check = require("../../assets/check.png");
const carrot = require("../../assets/carrot.png");
import axios from "axios";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";
import { lang } from "../../lang";

var PaymentLinking = ({ navigation, handler, paymentURL, handleBack }) => {
  const [openedURL, setopened] = useState(false);
  const [newURL, setNewURL] = useState("");
  const [paymentstat, setPaymentStat] = useState(0);
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  useEffect(() => {
    console.log(paymentURL);
  }, []);

  useEffect(() => {
    console.log(newURL);
    if (newURL.includes(config.baseURL)) {
      console.log("PAYMENTID= ");
      console.log(newURL.split("paymentId=")[1].split("&")[0]);
      setTimeout(() => {
        axios
          .post(
            config.baseURL + "/api/paymentStatus",
            {
              paymentId: newURL.split("paymentId=")[1].split("&")[0],
            },
            {
              headers: {
                Authorization: `bearer ${config.Token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data.message);
            if (response.data.message == "success") {
              setPaymentStat(1);
            } else {
              setPaymentStat(2);
            }
          })
          .catch((e) => {
            console.log(e);
            // setPaymentStat(2);
          });
      }, 3000);
    }
  }, [newURL]);

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      setopened(true);
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    if (paymentstat == 1) {
      return (
        <View style={styles.body}>
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
                justifyContent: "center",
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
              {/* <View style={styles.container}>
              <OpenURLButton style={styles.container} url={paymentURL}>
                Open Payment URL
              </OpenURLButton>
            </View> */}
              <Image source={check} style={{ height: 100, width: 100 }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  marginTop: "5%",
                }}
              >
                {lang[lang.lang].payment_16}
              </Text>
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
              handler(1);
              console.log("Check Payment Pressed");
            }}
          >
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              }}>
            {lang[lang.lang].payment_17}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (paymentstat == 0) {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: "absolute",
              left: 10,
              top: 60,
              zIndex: 999,
              backgroundColor:"white",
              padding:10,
              borderRadius:20
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
                handleBack();
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
               {lang[lang.lang].payment_15}
              </Text>
            </TouchableOpacity>
          </View>
          <WebView
            onNavigationStateChange={(link) => {
              setNewURL(link.url);
            }}
            source={{
              uri: paymentURL,
            }}
            style={{
              width: "100%",
              height: "100%",
              marginTop: 50,
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.body}>
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
                justifyContent: "center",
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
              {/* <View style={styles.container}>
            <OpenURLButton style={styles.container} url={paymentURL}>
              Open Payment URL
            </OpenURLButton>
          </View> */}
              <Image source={cross} style={{ height: 50, width: 50 }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  marginTop: "5%",
                }}
              >
                {lang[lang.lang].payment_18}
              </Text>
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
              handler(2);
            }}
          >
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "white",
              }}>
            {lang[lang.lang].payment_19}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
};

export default PaymentLinking;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
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
