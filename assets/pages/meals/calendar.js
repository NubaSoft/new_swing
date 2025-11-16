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
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const otp = require("../../assets/otp.png");
const hm = require("../../assets/healthy_man.png");
const pys = require("../../assets/PngItem_5797927.png");
const male_img = require("../../assets/male.png");
const female_img = require("../../assets/female.png");

const profile_img = require("../../assets/profile.png");
const settings_img = require("../../assets/settings.png");

import axios from "axios";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { lang } from "../../lang";

var CalendarView = ({
  navigation,
  handler,
  FreezeDaysHandler,
  profileHandler,
  settingsHandler,
  setIsLoading,
}) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState(null);
  const [subscriptionDays, setSubscriptionDays] = useState([]);
  const [subscriptionDaysStatus, setSubscriptionDaysStatus] = useState([]);
  const [subscriptionWeekIds, setSubscriptionWeekIds] = useState([]);
  const [subscriptionDayIds, setSubscriptionDayIds] = useState([]);
  const [subscriptionCenterIds, setSubscriptionCenterIds] = useState([]);
  const [subscriptionOIds, setSubscriptionOIds] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(null);
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const customDatesStylesCallback = (date) => {
    var indx = subscriptionDays.indexOf(moment(date).format("YYYY-MM-DD"));
    var statusCode = subscriptionDaysStatus[indx];

    switch (statusCode) {
      case 0:
        return {
          style: {
            backgroundColor: "white",
          },
        };

      case 1:
        return {
          style: {
            backgroundColor: config.color_3,
          },
        };

      case 2:
        return {
          style: {
            backgroundColor: "red",
          },
        };
      case 3:
        return {
          style: {
            backgroundColor: config.color_4,
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

        var weekIds = [];
        for (let i = 0; i < response.data.packageDates.length; i++) {
          weekIds.push(response.data.packageDates[i].weekId);
        }

        var dayIds = [];
        for (let i = 0; i < response.data.packageDates.length; i++) {
          dayIds.push(response.data.packageDates[i].dayId);
        }
        var centerIds = [];
        for (let i = 0; i < response.data.packageDates.length; i++) {
          centerIds.push(response.data.packageDates[i].centerId);
        }
        var oIds = [];
        for (let i = 0; i < response.data.packageDates.length; i++) {
          oIds.push(response.data.packageDates[i].oId);
        }
        setSubscriptionDaysStatus(sdStatus);
        setSubscriptionDays(sdates);
        setSubscriptionWeekIds(weekIds);
        setSubscriptionDayIds(dayIds);
        setSubscriptionCenterIds(centerIds);
        setSubscriptionOIds(oIds);

        console.log("SUBSCRIPTION DAYS=");
        console.log(sdates);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  var selectedDateChanged = (selDate) => {
    console.log("Selected Date Changed = ");
    console.log(moment(selDate).format("dddd, MMMM DD"));
    var indx = subscriptionDays.indexOf(moment(selDate).format("YYYY-MM-DD"));
    var statusCode = subscriptionDaysStatus[indx];
    var weekId = subscriptionWeekIds[indx];
    var dayId = subscriptionDayIds[indx];
    var centerId = subscriptionCenterIds[indx];
    var oId = subscriptionOIds[indx];
    setIsLoading(true);
    if (statusCode == 2) {
      Alert.alert(lang[lang.lang].calendar_alert_8);
      setIsLoading(false);
    } else if (statusCode == 3) {
      Alert.alert(lang[lang.lang].calendar_alert_9);
      handler(
        moment(selDate).format("dddd, DD/MM"),
        moment(selDate).format("YYYY-MM-DD"),
        weekId,
        dayId,
        centerId,
        oId,
        statusCode
      );
    } else {
      handler(
        moment(selDate).format("dddd, DD/MM"),
        moment(selDate).format("YYYY-MM-DD"),
        weekId,
        dayId,
        centerId,
        oId,
        statusCode
      );
    }
  };
  useEffect(() => {
    console.log("Calendar View Page");
    getCalendarDetails();
    getSubscriptionDetails();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Focus Calendar View Page");
      getCalendarDetails();
      getSubscriptionDetails();
    }, [])
  );

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
            top: 0.05 * windowHeight,
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
              profileHandler();
            }}
          >
            <Image
              source={profile_img}
              style={{ height: 50, width: 30, resizeMode: "stretch" }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            right: 30,
            top: 0.05 * windowHeight,
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

        <View style={{ height: 0.15 * windowHeight }} />

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
                height: 100,
                width: 100,
                borderWidth: 9,
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
                  fontSize: 16,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                {subscriptionPeriod}
                {lang[lang.lang].calendar_1}
              </Text>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  // marginVertical: "4%",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 16,
                  backgroundColor: "white",
                  marginHorizontal: "5%",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                {subscriptionStartDate}
              </Text>
              <Text
                style={{
                  // marginVertical: "4%",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 16,
                  backgroundColor: "white",
                  marginHorizontal: "5%",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                {subscriptionEndDate}
              </Text>
            </View>

            <View style={{ height: 0.001 * windowHeight }} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log("Freeze");
                setIsLoading(true);
                FreezeDaysHandler();
              }}
            >
              <Ionicons name="pause-circle" size={24} color="black" />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                }}
              >
                {lang[lang.lang].calendar_2}
              </Text>
            </TouchableOpacity>
            <Image
              source={purp}
              style={{
                width: 80,
                height: 90,
                resizeMode: "stretch",
                position: "absolute",
                left: 20,
                top: 0.15 * windowHeight,
                zIndex: 999,
              }}
            />
            <View
              style={{
                width: "95%",
                height: "62%",
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
              <Text
                style={{
                  marginTop: "5%",
                  alignSelf: "center",
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  alignSelf: "center",
                  fontSize: 20,
                }}
              >
                {lang[lang.lang].calendar_3}
              </Text>

              <View style={{ height: "90%", width: "100%", marginTop: "5%" }}>
                <CalendarPicker
                  todayBackgroundColor={config.color_2}
                  // dayShape="circle"
                  selectedDayStyle={{
                    backgroundColor: "#6AA276",
                  }}
                  customDatesStyles={customDatesStylesCallback}
                  onDateChange={selectedDateChanged}
                  minDate={moment().toDate()}
                  width={0.85 * windowWidth}
                  height={0.45 * windowHeight}
                  disabledDatesTextStyle={{ color: "black" }}
                  monthTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderEndWidth: 10,
                    borderStartWidth: 10,
                  }}
                  yearTitleStyle={{
                    // fontFamily: "Handlee_400Regular",
                    fontSize: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
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
                    if (subscriptionDays.includes(moment(date).format("YYYY-MM-DD"))) {
                      return false;
                    } else {
                      return true;
                    }
                  }}
                />
              </View>
            </View>
            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: config.color_1,
                alignSelf: "center",
                fontSize: 16,
                marginTop: "1%",
              }}
            >
              {}
            </Text>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-evenly",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  alignSelf: "center",
                  fontSize: 15,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                {lang[lang.lang].calendar_4}
              </Text>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  alignSelf: "center",
                  fontSize: 15,
                  backgroundColor: config.color_4,
                  borderRadius: 20,
                  padding: 5,
                }}
              >
               {lang[lang.lang].calendar_5}
              </Text>

              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  alignSelf: "center",
                  fontSize: 15,
                  backgroundColor: "red",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                {lang[lang.lang].calendar_6}
              </Text>

              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "white",
                  alignSelf: "center",
                  fontSize: 15,
                  backgroundColor: config.color_3,
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                {lang[lang.lang].calendar_7}
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }
};

export default CalendarView;

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
    width: "30%",
    height: "6%",
    borderRadius: 15,
    backgroundColor: config.color_2,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: "3%",
    flexDirection: "row",
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
