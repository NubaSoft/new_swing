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
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
const back_arrow = require("../../assets/back-arrow.png");

const pys = require("../../assets/PngItem_5797927.png");

import axios from "axios";

import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { lang } from "../../lang";

var FastRenewPackageSelection = ({
  navigation,
  handler,
  offdays,
  mealsnum,
  snacksnum,
  periodnum,
  menuID,
  price,
  handleBack,
}) => {
  const [ValueMeal, setValueMeal] = useState("1");
  const [Message, setMessage] = useState(lang[lang.lang].package_selection_3);
  const [value, setValue] = useState("1");
  const [valueDays, setValueDays] = useState("0");

  const [startD, onChangeStartD] = useState(null);
  const [endD, onChangeEndD] = useState(null);
  const windowWidth = Dimensions.get("window").width;

  const [subscriptionStartDates, setSubscriptionStartDates] = useState([]);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState([]);
  const [choosenSubscriptionPeriod, setChoosenSubscriptionPeriod] = useState(0);
  const [subdays, setSubDays] = useState();
  const [disableDaysPicker, setDisableDaysPicker] = useState(true);
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  const customDatesStylesCallback = (date) => {
    return {
      style: {
        backgroundColor: "white",
      },
    };
  };

  var getPackageStartDates = () => {
    console.log("OFF-DAYS-Sent");
    console.log(offdays);
    axios
      .post(
        config.baseURL + "/api/register/getSubscribtionStartDates",
        {
          offDays: offdays,
          renew: 1,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log("Get Subscription Start Dates Response:");
        console.log(response.data.subscriptionStartDates);
        setSubscriptionStartDates(response.data.subscriptionStartDates);
      })
      .catch((e) => {
        console.log("GET SUBSC DAYS");
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("Package Selections");
    // getAvailableDays();
    getPackageStartDates();
    console.log("INCOMING DATA:");
    console.log(snacksnum);
    console.log(mealsnum);
    console.log(periodnum);
    setValue(snacksnum);
    setValueMeal(mealsnum);
    setValueDays(periodnum);
  }, []);

  useEffect(() => {
    setMessage(lang[lang.lang].package_selection_3);
    setSubDays(valueDays);
  }, [valueDays, subdays]);

  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  var onChangeSEDate = (date, type) => {
    console.log(type);

    onChangeStartD(date);
    onChangeEndD(
      moment(moment(date).format("DD-MM-YYYY"), "DD-MM-YYYY").add(valueDays, "days")
    );
    if (date != null) {
      setDisableDaysPicker(false);
    }
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
            left: 10,
            top: 50,
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
              console.log("fast back pressed");
              handleBack();
            }}
          >
            <Image source={back_arrow} style={{ height: 15, width: 20 }} />
            <View style={{ height: 2 }} />
            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: "black",
                fontWeight: "900",
                fontSize: 15,
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
            { borderColor: config.color_1, borderWidth: 0 },
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
            <View
              style={{
                flexDirection: "row",
                borderRadius: 20,
                backgroundColor: "#DBDBDBCC",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: "80%",
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
                {lang[lang.lang].subscription_data_17}
              </Text>
            </View>

            <View
              style={{
                width: "95%",
                height: "70%",
                marginTop: "15%",
                borderWidth: 0,
                backgroundColor: "#DBCCCCCC",
                borderColor: "black",
                borderRadius: 20,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: "10%",
                  marginTop: "10%",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <View
                  style={{
                    width: "70%",
                    backgroundColor: config.color_2,
                    borderColor: "black",
                    borderWidth: 0,
                    borderRadius: 20,
                    height: "70%",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                    }}
                  >
                    {Message}
                  </Text>
                </View>
              </View>
              <View style={{ height: "90%", width: "100%", marginTop: "5%" }}>
                <CalendarPicker
                  todayBackgroundColor={config.color_1}
                  // dayShape="square"
                  selectedRangeStyle={{
                    backgroundColor: config.color_2,
                  }}
                  customDatesStyles={customDatesStylesCallback}
                  allowRangeSelection={false}
                  selectedDayColor={config.color_4}
                  onDateChange={onChangeSEDate}
                  width={0.85 * windowWidth}
                  disabledDatesTextStyle={{ color: "black" }}
                  monthTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
                    // backgroundColor: "white",
                    borderEndWidth: 10,
                    borderStartWidth: 10,
                  }}
                  yearTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
                    // backgroundColor: "white",
                    borderEndWidth: 10,
                    borderStartWidth: 10,
                  }}
                  nextTitle=">"
                  previousTitle="<"
                  nextTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
                    fontWeight: "bold",
                    // backgroundColor: "white",
                    borderEndWidth: 10,
                    borderStartWidth: 10,
                  }}
                  previousTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
                    fontWeight: "bold",
                    // backgroundColor: "white",
                    borderEndWidth: 10,
                    borderStartWidth: 10,
                  }}
                  textStyle={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 14,
                  }}
                  disabledDates={(date) => {
                    if (
                      subscriptionStartDates.includes(moment(date).format("YYYY-MM-DD"))
                      // ) &&
                      //   disableDaysPicker) ||
                      // inBetweenDates.includes(moment(date).format("YYYY-MM-DD"))
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  }}
                />
              </View>

              <View style={{ height: "3%" }} />
            </View>

            <View style={{ height: "1%" }} />
          </Animated.View>
        </View>

        {/* <View style={{ height: "3%" }} /> */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (startD) {
              handler(
                ValueMeal,
                value,
                subdays,
                startD.format("YYYY-MM-DD"),
                menuID,
                price
              );
            } else {
              Alert.alert(lang[lang.lang].selectSubscriptionStartDate);
            }
          }}
        >
          <Text style={{
            // fontFamily: "Handlee_400Regular",
            color: "black",
            }}>
          {lang[lang.lang].subscription_data_18}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default FastRenewPackageSelection;

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
    // backgroundColor: "#DBDBDBCC",
    borderRadius: 15,
    width: "100%",
    height: "75%",
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
