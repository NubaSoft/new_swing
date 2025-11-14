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
const cardimg = require("../../assets/card.png");
const cashimg = require("../../assets/knet.png");
const transaction = require("../../assets/transaction.png");
const healthman = require("../../assets/healthy_man.png");
const profile_img = require("../../assets/profile.png");

const carrot = require("../../assets/carrot.png");
import axios from "axios";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";
import { lang } from "../../lang";

var CompletePayment = ({
  navigation,
  handler,
  subscribedays,
  totprice,
  editHandler,
  editshow,
  menuId,
  profilebackhandler,
}) => {
  const [subsDays, setSubsDays] = useState(subscribedays);
  const [totalPrice, setTotalPrice] = useState(totprice);
  const [menuid, setMenuId] = useState(menuId);
  const [cashSelected, setCashSelection] = useState(false);
  const [cardSelected, setCardSelection] = useState(false);
  //PromoCode Variables
  const [promoCode, onChangepromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [finalPrice, setFinalPrice] = useState(totprice);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountPercentage, setDiscountpercentage] = useState(0);
  const [marketingId, setMarketingId] = useState(0);
  const [applyPromoCode, setApplyPromoCode] = useState(0);
  const [PromoCodeFinal, setPromoCodeFinal] = useState("");

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
            left: '6%',
            top: "5%",
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
              profilebackhandler();
            }}
          >
            <Image
              source={profile_img}
              style={{ height: 50, width: 30, resizeMode: "stretch" }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: "10%", width: "100%" }} />
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
                height: "30%"
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  marginHorizontal: "5%",
                }}
              >
                <Text
                  style={{
                    margin: "4%",
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 15,
                    textAlign:"center"
                  }}
                >
                  {lang[lang.lang].payment_1}
                </Text>
                <View
                  style={{
                    height: '40%',
                    width: '70%',
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
                    {subsDays}
                    {lang[lang.lang].payment_2}
                  </Text>
                </View>
                {editshow ? (
                  <TouchableOpacity
                    style={styles.editbutton}
                    onPress={() => {
                      console.log("Edit PRESSED");
                      editHandler();
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "white",
                      }}
                    >
                      {lang[lang.lang].payment_3}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ height: "2%" }} />
                )}
              </View>

              <View
                style={{
                  flexDirection: "column",
                  marginHorizontal: "5%",
                  // marginTop: "5%",
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
                  {lang[lang.lang].payment_4}
                </Text>
                <View
                  style={{
                    height: '70%',
                    width: 120,
                    backgroundColor: config.color_1,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    borderColor: "black",
                    borderWidth: 2,
                  }}
                >
                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "white",
                      fontSize: 15,
                      alignSelf: "flex-start",
                      marginLeft: "9%",
                    }}
                  >
                   {lang[lang.lang].payment_5}
                  </Text>

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "white",
                      fontSize: 20,
                    }}
                  >
                    {finalPrice}
                  </Text>
                </View>
              </View>
            </View>
            {/* <View style={{ height: "10%" }} /> */}

            <View
              style={{
                height: "0%",
                width: "90%",
                borderWidth: 1,
                borderColor: "black",
              }}
            />

            {/* Promo Code Code here */}
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
                source={healthman}
                style={{ height: "70%", width: "12%" }}
              />
              <Text
                style={{
                  marginVertical: "2%",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 20,
                }}
              >
                {lang[lang.lang].payment_6}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
                height: "8%",
                marginVertical: "3%",
              }}
            >
              <View style={styles.field}>
                <TextInput
                  style={{ margin: 20, height: 100, textAlign:lang.lang=="ar"?"right":"left" }}
                  onChangeText={onChangepromoCode}
                  value={promoCode}
                  placeholder={lang[lang.lang].payment_7}
                  placeholderTextColor={"black"}
                ></TextInput>
              </View>

              <TouchableOpacity
                style={styles.buttonPromo}
                onPress={() => {
                  console.log("PROMOCODE PRESSED");
                  // /api/register/addPromoCode
                  console.log({
                    promoCode: promoCode,
                    menuId: menuid,
                    price: totalPrice,
                    days: subsDays,
                  });
                  axios
                    .post(
                      config.baseURL + "/api/register/addPromoCode",
                      {
                        promoCode: promoCode,
                        menuId: menuid,
                        price: totalPrice,
                        days: subsDays,
                      },
                      {
                        headers: {
                          Authorization: `bearer ${config.Token}`,
                        },
                      }
                    )
                    .then((response) => {
                      console.log(response.data);

                      if (response.data.applyPromoCode == 0) {
                        setPromoMessage(lang[lang.lang].payment_9);
                      } else {
                        setApplyPromoCode(response.data.applyPromoCode);
                        setDiscountValue(response.data.discountValue);
                        setDiscountpercentage(response.data.discountPercentage);
                        setMarketingId(response.data.marketingId);
                        setFinalPrice(response.data.finalPrice);
                        setPromoCodeFinal(response.data.promoCode);
                        setPromoMessage(
                          lang[lang.lang].payment_10 +
                            String(response.data.discountPercentage) +
                            " %"
                        );
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                      setPromoMessage(lang[lang.lang].payment_9);
                    });
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                  }}
                >
                  {lang[lang.lang].payment_8}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: "red",
                fontSize: 13,
                marginVertical: "1%",
              }}
            >
              {promoMessage}
            </Text>

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
                  margin: "2%",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 20,
                }}
              >
                {lang[lang.lang].payment_11}
              </Text>
            </View>
            <View
              style={{
                marginVertical: "3%",
                height: "10%",
                width: "85%",
                borderRadius: 30,
                backgroundColor: config.color_1,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => {
                setCashSelection(!cashSelected)
                setCardSelection(false)
              }} style={{ flexDirection: "row", width: "80%" }}>
                <CheckBox
                  value={cashSelected}
                  onValueChange={setCashSelection}
                  color="white"
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
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].payment_12}
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
                // marginVertical: "1%",
                height: "10%",
                width: "85%",
                borderRadius: 30,
                backgroundColor: config.color_1,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={()=>{setCardSelection(!cardSelected)
              setCashSelection(false)
              }}style={{ flexDirection: "row", width: "80%" }}>
                <CheckBox
                  value={cardSelected}
                  onValueChange={setCardSelection}
                  color="white"
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
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  {lang[lang.lang].payment_13}
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
          </Animated.View>
        </View>

        {/* <View style={{ height: "0%" }} /> */}

        {/* <View
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
        </View> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (cardSelected && cashSelected) {
              Alert.alert(lang[lang.lang].chooseOnlyOnePaymentMethod);
            } else if (cardSelected) {
              handler(
                2,
                finalPrice,
                PromoCodeFinal,
                discountPercentage,
                discountValue,
                marketingId,
                applyPromoCode
              );
            } else if (cashSelected) {
              handler(
                1,
                finalPrice,
                PromoCodeFinal,
                discountPercentage,
                discountValue,
                marketingId,
                applyPromoCode
              );
            } else {
              Alert.alert(lang[lang.lang].choosePaymentMethod);
            }
            console.log("PRESSED");
          }}
        >
          <Text style={{
            // fontFamily: "Handlee_400Regular",
            color: "white",
            fontWeight: '700',
            }}>
          {lang[lang.lang].payment_14}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default CompletePayment;

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
    marginTop: "10%",
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
    marginTop: "10%",
  },
  buttonPromo: {
    width: "25%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    marginHorizontal: "5%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
  },
  editbutton: {
    width: "55%",
    height: "22%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "5%",
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
    width: "50%",
    height: "100%",
    zIndex: 999,
    // backgroundColor: "",
    borderWidth: 2,
    borderColor: config.color_1,
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
