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
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
const purp = require("../../assets/purp.png");
const hm = require("../../assets/eggplant.png");
const pys = require("../../assets/PngItem_5797927.png");
const female_img = require("../../assets/female.png");
const back_arrow = require("../../assets/back_arrow_inverted.png");

import axios from "axios";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { lang } from "../../lang";

var Freeze = ({ navigation, handler, setIsLoading, FreezeBackHandler }) => {
  const windowWidth = Dimensions.get("window").width;
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState(null);
  const [subscriptionDays, setSubscriptionDays] = useState([]);
  const [pausedDays, setPausedDays] = useState([]);
  const [pausedDayslength, setPausedDayslength] = useState([]);
  const back_arrow = require("../../assets/back_arrow_inverted.png");

  const [subscriptionDaysStatus, setSubscriptionDaysStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  useEffect(() => {
    setIsLoading(false);
  }, []);
  const unPause = (pDates) => {
    axios
      .post(
        config.baseURL + "/api/meal/unpauseMeal",
        {
          unPauseDates: [pDates],
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  var onChangeDate = (date, type) => {
    var indx = pausedDays.indexOf(date.format("YYYY-MM-DD"));
    var pausedD = pausedDays;
    if (indx == -1) {
      pausedD.push(date.format("YYYY-MM-DD"));
    } else {
      unPause(date.format("YYYY-MM-DD"));
      pausedD = pausedD.filter(function (value, index, arr) {
        return value != date.format("YYYY-MM-DD");
      });
    }
    setPausedDays(pausedD);
    setPausedDayslength(pausedD.length);
    console.log("**************");
    console.log(pausedD);
    console.log("**************");
  };
  const customDatesStylesCallback = (date) => {
    var indx = subscriptionDays.indexOf(date.format("YYYY-MM-DD"));
    var pausindx = pausedDays.indexOf(date.format("YYYY-MM-DD"));
    if (pausindx != -1) {
      return {
        style: {
          backgroundColor: "red",
        },
      };
    } else if (indx != -1) {
      return {
        style: {
          backgroundColor: "white",
        },
      };
    }
  };

  var getSubscriptionDetails = () => {
    axios
      .get(config.baseURL + "/api/package/subscriptionDetails", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then((response) => {
        console.log("Get subscription details response:");
        console.log(response.data.subscriptionStartDate);
        console.log(response.data.subscriptionEndDate);
        console.log(response.data.subscriptionDays);
        console.log(response.data.remainingDays);
        setSubscriptionStartDate(response.data.subscriptionStartDate);
        setSubscriptionEndDate(response.data.subscriptionEndDate);
        setSubscriptionPeriod(response.data.subscriptionDays);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  var getCalendarDetails = () => {
    axios
      .get(config.baseURL + "/api/package/calenderDetails", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then((response) => {
        console.log("Get calendar details response:");
        console.log(response.data.packageDates[0]);
        var sdates = [];
        for (let i = 0; i < response.data.packageDates.length; i++) {
          sdates.push(response.data.packageDates[i].vdate);
        }
        var sdStatus = [];
        for (let i = 0; i < response.data.packageDates.length; i++) {
          sdStatus.push(response.data.packageDates[i].status);
        }
        setSubscriptionDaysStatus(sdStatus);
        setSubscriptionDays(sdates);
        var temppause = [];
        for (let i = 0; i < sdates.length; i++) {
          if (sdStatus[i] == 2) {
            temppause.push(sdates[i]);
          }
          setPausedDays(temppause);
          setPausedDayslength(temppause.length);
        }

        console.log("SUBSCRIPTION DAYS=");
        console.log(sdates);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("Calendar View Page");
    getCalendarDetails();
    getSubscriptionDetails();
  }, []);

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
              FreezeBackHandler();
            }}
          >
            <Image source={back_arrow} style={{ height: 30, width: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={{ height: "13%", width: "100%" }} />
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
                marginTop: 20,
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
                {lang[lang.lang].freeze_1}
              </Text>
            </View>
            <View style={{ height: "5%" }} />
            <View
              style={{
                width: "95%",
                height: "60%",
                marginTop: "4%",
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
                  width: "90%",
                  height: "13%",
                  marginTop: "13%",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "35%",
                    backgroundColor: config.color_2,
                    borderColor: "black",
                    borderWidth: 0,
                    borderRadius: 20,
                    height: "70%",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    marginLeft: "25%",
                  }}
                >
                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                    }}
                  >
                    {subscriptionPeriod}
                    {lang[lang.lang].freeze_2}
                  </Text>
                </View>
                <View style={{ height: "1%", width: "10%" }} />

                <Image
                  source={hm}
                  style={{ height: "90%", width: "12%", alignSelf: "flex-end" }}
                />
              </View>
              <View style={{ height: "90%", width: "100%", marginTop: "5%" }}>
                <CalendarPicker
                  todayBackgroundColor="#6AA276"
                  selectedDayStyle={customDatesStylesCallback}
                  customDatesStyles={customDatesStylesCallback}
                  onDateChange={onChangeDate}
                  minDate={moment().add(3, "days").toDate()}
                  width={0.85 * windowWidth}
                  disabledDatesTextStyle={{ color: "black" }}
                  monthTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
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
                    borderEndWidth: 10,
                    borderStartWidth: 10,
                  }}
                  previousTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
                    fontWeight: "bold",
                    borderEndWidth: 10,
                    borderStartWidth: 10,
                  }}
                  textStyle={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 14,
                  }}
                  disabledDates={(date) => {
                    if (subscriptionDays.includes(date.format("YYYY-MM-DD"))) {
                      return false;
                    } else {
                      return true;
                    }
                  }}
                />
              </View>
            </View>
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
                marginTop: "8%",
              }}
            >
              <Text
                style={{
                  marginVertical: "4%",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {" "}
                {pausedDayslength}
                {lang[lang.lang].freeze_3}
              </Text>
              <Image source={purp} style={{ height: "70%", width: "12%" }} />
            </View>
          </Animated.View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log("_____");
            setIsLoading(true);
            handler(pausedDays);
          }}
        >
          <Text style={{
            // fontFamily: "Handlee_400Regular",
            color: "black",
            }}>
            {lang[lang.lang].freeze_4}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Freeze;

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
    height: "4%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
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
