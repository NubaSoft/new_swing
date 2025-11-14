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
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const bgImage = require("../../assets/profile_bg.jpg");
const logoAnimation = require("../../assets/logo.png");
const profilecover = require("../../assets/profile_cover.png");
import axios from "axios";
import CalendarView from "./calendar";
import Freeze from "./freeze";
import AddMeals from "./addmeals";
import Loading from "../loading/loading";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lang } from "../../lang";
import Ionicons from 'react-native-vector-icons/Ionicons';
const brook = require("../../assets/brook.png");
var Meals = ({ route, navigation }) => {
  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const logoAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const [selectedPage, setSelectedPage] = useState(0);
  const [paymentURL, setPaymentURL] = useState("");
  const [mealsDate, setMealsDate] = useState(null);
  const [mealsUsedDate, setUsedMealsDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [centerId, setCenterId] = useState(-1);
  const [oId, setOId] = useState(-1);
  const [meals, setMeals] = useState([]);
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [status, setStatus] = useState(-1);
  const [language, setLanguage] = useState(lang.lang);

  const AddMealsHandler = () => {
    console.log("Add Meals Handler");
  };
  const CalendarBackHandler = () => {
    setSelectedPage(0);
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const FreezeBackHandler = () => {
    setSelectedPage(0);
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setIsLoading(false);
  };
  const profileHandler = () => {
    navigation.navigate("personal");
  };
  const FreezeDaysHandler = () => {
    setSelectedPage(0.5);
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setIsLoading(false);
  };

  const CalendarViewHandler = (
    mdate,
    vdatei,
    weekIdi,
    dayIdi,
    centerId,
    oId,
    dayStatus
  ) => {
    setMealsDate(mdate);
    setCenterId(centerId);
    setOId(oId);
    setUsedMealsDate(vdatei);
    setStatus(dayStatus);
    axios
      .post(
        config.baseURL + "/api/meal/getMealsListByDate",
        {
          vdate: vdatei,
          weekId: parseInt(weekIdi),
          dayId: parseInt(dayIdi),
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setMeals(response.data);

        setSelectedPage(1);
        Animated.timing(pageAnim, {
          toValue: 1,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start();
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const FreezeViewHandler = (pDates) => {
    var filteredDates = [];
    for (var i = 0; i < pDates.length; i++) {
      var day = moment(pDates[i]).format("YYYY-MM-DD");
      if (moment(day).isSameOrAfter(moment().add(2, "days"))) {
        filteredDates.push(pDates[i]);
      }
    }
    console.log("FREEZE HANDLER DAYS");
    console.log(filteredDates);
    axios
      .post(
        config.baseURL + "/api/meal/pauseMeal",
        {
          pauseDates: filteredDates,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setSelectedPage(0);
        Animated.timing(pageAnim, {
          toValue: 0,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start();
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    console.log("Welcome to Meals page!");
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(0.5)),
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [transAnim]);

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View>
        {/* Animated background */}
        <Animated.View
          style={{
            width: "100%",
            height: "100%",

            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-320, -200],
                }),
              },
            ],
          }}
        >
          <Image
            source={bgImage}
            style={styles.bgImageStyle}
            resizeMode="cover"
          ></Image>
        </Animated.View>

        {/* Logo */}
        <Animated.View style={styles.logoWrapper}>
          <Image
            source={logoAnimation}
            style={styles.logo}
            resizeMode={"cover"}
          />
        </Animated.View>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: "5%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            right: "20%",
            zIndex: 999,
          }}
          onPress={() => {
            if (lang.lang == "ar") {
              lang.lang = "en";
              setLanguage(lang.lang);
            } else {
              lang.lang = "ar";
              setLanguage(lang.lang);
            }
          }}
        >
          <Ionicons name="language" size={30} color="black" marginRight="10%" />
          <Text
            style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              fontSize: 16,
              zIndex: 999,
            }}
          >
            {lang.lang == "ar" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>
        <Loading isLoading={isLoading} />
        {settingsMenu ? (
          <TouchableOpacity
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              zIndex: 1000,
              backgroundColor: "#55555555",
            }}
            onPress={() => {
              setSettingsMenu(false);
            }}
          >
            <View
              style={{
                height: 80,
                width: 200,
                backgroundColor: config.color_1 + "66",
                position: "absolute",
                right: 40,
                top: 110,
                borderRadius: 10,
                zIndex: 1000,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={brook}
                style={{
                  width: 50,
                  height: 60,
                  resizeMode: "stretch",
                  position: "absolute",
                  right: 20,
                  top: 0,
                  zIndex: 1002,
                }}
              />
              <TouchableOpacity
                style={{
                  height: "40%",
                  width: "90%",
                  backgroundColor: "white",
                  alignItems: "center",
                  borderRadius: 20,
                  zIndex: 1000,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
                onPress={() => {
                  config.Token = "";
                  AsyncStorage.setItem("keepLoggedIn", "");
                  AsyncStorage.setItem("data", "");
                  navigation.navigate("account");
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    fontSize: 14,
                    padding: 5,
                    paddingLeft: 30,
                  }}
                >
                  {lang[lang.lang].logout}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, -500],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 0.5 ? (
            <Freeze
              handler={FreezeViewHandler}
              setIsLoading={setIsLoading}
              FreezeBackHandler={FreezeBackHandler}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -1000],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 0 ? (
            <CalendarView
              handler={CalendarViewHandler}
              FreezeDaysHandler={FreezeDaysHandler}
              setIsLoading={setIsLoading}
              profileHandler={profileHandler}
              settingsHandler={setSettingsMenu}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.leftCoverWrapper,
            {
              transform: [
                {
                  translateX: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1000, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {selectedPage == 1 ? (
            <AddMeals
              handler={AddMealsHandler}
              date={mealsDate}
              usedDate={mealsUsedDate}
              meals={meals}
              CalendarBackHandler={CalendarBackHandler}
              profileHandler={profileHandler}
              settingsHandler={setSettingsMenu}
              setIsLoading={setIsLoading}
              centerId={centerId}
              oId={oId}
              status={status}
            />
          ) : (
            <View></View>
          )}
        </Animated.View>
      </View>
    );
  }
};

export default Meals;

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
  inputBody: {
    backgroundColor: "#C4C4C4CC",
    borderRadius: 15,
    width: "90%",
    height: "80%",
    alignItems: "center",
  },
  button: {
    width: "90%",
    height: "6%",
    borderRadius: 15,
    backgroundColor: config.color_1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    transform: [
      {
        translateY: 0.12 * windowHeight,
      },
    ],
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  logoWrapper: {
    position: "absolute",
    top: -0.07 * windowHeight,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "10%",
    alignItems: "center",
    zIndex: 999,
  },

  leftCover: {
    width: "10%",
    height: "10%",
  },
  leftCoverWrapper: {
    position: "absolute",
    height: "100%",
    width: "100%",
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
