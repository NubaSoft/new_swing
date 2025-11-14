// SUB PACKAGES MODULE
import React, { useEffect, useRef, useState } from "react";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import axios from "axios";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Easing from "react-native/Libraries/Animated/Easing";
import { lang } from "../../lang";
import { colors, spacing } from "../../app/theme";
import { Text as Tex} from "../../app/components"

const dimensions = Dimensions.get("window")

const purp = require("../../assets/purp.png");
const breakfast = require("../../assets/breakfast.png");
const lunch = require("../../assets/lunch.png");
const fruit = require("../../assets/fruit.png");
const dinner = require("../../assets/dinner.png");
const soup = require("../../assets/soup.png");
const snack1 = require("../../assets/snack.png");
const snack2 = require("../../assets/snack2.png");
const salad = require("../../assets/salad.png");
const leaf = require("../../assets/leaf.png");
const placeholder = require("../../assets/fresh.png");
const profile_img = require("../../assets/profile.png");
const settings_img = require("../../assets/settings.png");
var AddMeals = ({
  navigation,
  handler,
  date,
  usedDate,
  meals,
  CalendarBackHandler,
  profileHandler,
  settingsHandler,
  setIsLoading,
  centerId,
  oId,
  status,
}) => {
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const menuAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const mealsFadeAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const [filteredMeals, setFilteredMeals] = useState([[]]);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [selectedMeal, setSelectedMeal] = useState(-1);

  const [currDate, setCurrDate] = useState(date);
  const [selectedType, setSelectedType] = useState(meals[0]);
  const [selectedCat, setSelectedCat] = useState(meals[0].category[0]);
  const [showInfo, setShowInfo] = useState(false);
  const [showMeal, setShowMeal] = useState({});
  const [snackType, setSnackType] = useState("salad");

  const [calories, setCalories] = useState(0)
  const [fats, setFats] = useState(0)
  const [proteins, setProteins] = useState(0)
  const [carbs, setCarbs] = useState(0)

  function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }
  var refreshMeal = () => {
    var listings = [];
    var i = 0;
    var listing = [];
    if (selectedCat == undefined) {
      listings = [];
    } else {
      for (var pkg of selectedCat.mealListItems) {
        if (i == 0) {
          listing.push(pkg);
          i = i + 1;
        } else {
          i = 0;
          listing.push(pkg);
          listings.push(listing);
          listing = [];
        }
      }
    }
    if (i == 1) {
      listings.push(listing);
    }
    setFilteredMeals(listings);
  };

  const onCalc = () => {
    console.log("savedMeals------useEffect------>>>>>>")
    const alertTitle = lang[lang.lang].completeMealsFirst
    let alertMessage = ""
    let error = false
    const savedMeals = []
    let calories = 0
    let fats = 0
    let proteins = 0
    let carbs = 0

    if (Object.keys(selectedMeals).length === 0) {
      error = true
    } else {
      console.log("---meals----------------", selectedMeals)
      for (let i = 0; i < meals.length; i++) {
        if (meals[i].categoryId in selectedMeals && selectedMeals[meals[i].categoryId] !== -1) {
          const mealsList = []

          for (let k = 0; k < meals[i]["category"].length; k++) {
            for (let c = 0; c < meals[i]["category"][k]["mealListItems"].length; c++) {
              mealsList.push(meals[i]["category"][k]["mealListItems"][c])
            }
          }

          for (let j = 0; j < mealsList.length; j++) {
            if (mealsList[j]["id"] === selectedMeals[meals[i].categoryId]) {
              var savedMeal = {
                calories: mealsList[j]["calories"],
                fats: mealsList[j]["fats"],
                proteins: mealsList[j]["proteins"],
                carbs: mealsList[j]["carbs"],
              }
              calories = calories + mealsList[j]["calories"]
              fats = fats + mealsList[j]["fats"]
              proteins = proteins + mealsList[j]["proteins"]
              carbs = carbs + mealsList[j]["carbs"]
              setCalories(calories)
              setFats(fats)
              setProteins(proteins)
              setCarbs(carbs)
              break
            }
          }
          savedMeals.push(savedMeal)
          console.log("savedMeals------useEffect--->>>---", savedMeal)

          // [
          //   {"calories": 312, "carbs": 19, "fats": 22, "proteins": 13},
          //   {"calories": 376, "carbs": 23, "fats": 19, "proteins": 30},
          //   {"calories": 299, "carbs": 42, "fats": 3, "proteins": 28},
          //   {"calories": 236, "carbs": 18, "fats": 19, "proteins": 5},
          //   {"calories": 236, "carbs": 18, "fats": 19, "proteins": 5}]

        } else {
          alertMessage = alertMessage + "Select " + meals[i].titleEn + "\n"
          error = true
        }
      }
    }
  }

  useEffect(() => {
    onCalc()
  }, [selectedMeals, selectedMeal])

  useEffect(() => {
    var listings = [];
    var i = 0;
    var listing = [];
    if (selectedCat == undefined) {
      listings = [];
    } else {
      for (var pkg of selectedCat.mealListItems) {
        var selMeals = selectedMeals;
        if (pkg.mealSelected) {
          selMeals[selectedCat["snackTypeId"]] = pkg["id"];
        }
        if (i == 0) {
          listing.push(pkg);
          i = i + 1;
        } else {
          i = 0;
          listing.push(pkg);
          listings.push(listing);
          listing = [];
        }
      }
    }
    if (i == 1) {
      listings.push(listing);
    }
    setFilteredMeals(listings);
    Animated.timing(menuAnim, {
      toValue: 0,
      easing: Easing.out(Easing.in(Easing.elastic(1))),
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(mealsFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    onCalc()
  }, [selectedCat, snackType]);

  useEffect(() => {
    var selMeals = {};
    console.log(selMeals);
    for (var idx in meals) {
      for (var catIdx in meals[idx]["category"]) {
        for (var mealIdx in meals[idx]["category"][catIdx]["mealListItems"]) {
          var meal = meals[idx]["category"][catIdx]["mealListItems"][mealIdx];
          if (meal["mealSelected"]) {
            selMeals[meals[idx].categoryId] = meal["id"];
          }
        }
      }
    }
    setSelectedMeal(selMeals["1"]);
    console.log(selMeals);
    setSelectedMeals(selMeals);
    onCalc()
  }, [meals]);

  console.log('filteredMeals--------------------', filteredMeals);
  
  [
    [
      {"calories": 312, "carbs": 19, "categoryId": 1, "date": "2024-10-10", "dayId": 6, "fats": 22, "favourite": 0, "fixedMicros": 0, "heatingInstruction": "", "heatingTime": 0, "id": 1, "ingredientsNutrition": "", "isAmend": 0, "isHighCal": 0, "isSpicy": 0, "itemCode": "1025", "itemId": 1025, "kitchenConfirmed": false, "mealId": 1, "mealImage": "https://nubasoft.net/cust_photos/1025.jpg", "mealSelected": false, "menuId": 23, "mid": 142, "newMeal": 0, "originAr": "", "originEn": "", "portionValue": 1, "proteins": 13, "rating": 0, "snack_typ": 0, "titleAr": "ساندويتش بيبيروني", "titleEn": "Pepperoni pesto baguette", "weekId": 1, "wonderOfTheDish": "", "wonderOfTheDishAr": ""},
      {"calories": 297, "carbs": 20, "categoryId": 1, "date": "2024-10-10", "dayId": 6, "fats": 20, "favourite": 0, "fixedMicros": 0, "heatingInstruction": "", "heatingTime": 0, "id": 2, "ingredientsNutrition": "", "isAmend": 0, "isHighCal": 0, "isSpicy": 0, "itemCode": "S18544", "itemId": 18544, "kitchenConfirmed": false, "mealId": 1, "mealImage": "https://nubasoft.net/cust_photos/S18544.jpg", "mealSelected": true, "menuId": 23, "mid": 0, "newMeal": 0, "originAr": "", "originEn": "", "portionValue": 1, "proteins": 11, "rating": 0, "snack_typ": 0, "titleAr": "ساندويتش بيض بالزعتر", "titleEn": "zaatar egg", "weekId": 1, "wonderOfTheDish": "", "wonderOfTheDishAr": ""}]]

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View style={styles.body}>
        {status == 3 ? (
          <Text
            style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              fontSize: 16,
              position: "absolute",
              bottom: 5,
              left: 5,
              zIndex: -1,
            }}
          >
            {lang[lang.lang].add_meals_1}
          </Text>
        ) : (
          <View />
        )}
        <View
          style={{
            position: "absolute",
            left: 30,
            top: windowHeight * 0.05,
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
            top: windowHeight * 0.05,
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

        <View style={{ height: "10%", width: "100%" }} />
        <View style={[styles.inputBody]}>
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
                width: "100%",
                height: "10%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 35,
                  marginTop: "15%",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: config.color_2,
                    alignSelf: "flex-start",
                    borderRadius: 20,
                    width: "20%",
                    height: windowHeight * 0.04,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    console.log("Back Calendar");
                    CalendarBackHandler();
                  }}
                >
                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      fontSize: 14,
                      padding: 5,
                    }}
                  >
                    {lang[lang.lang].add_meals_2}
                  </Text>
                </TouchableOpacity>
                <View style={{ width: "18%", height: 1 }} />
                <Image source={leaf} style={{ width: "20%", height: "100%" }} />
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 18,
                    position: "absolute",
                    top: "40%",
                    textShadowColor: "black",
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 4,
                  }}
                >
                  {currDate}
                </Text>
                <View style={{ width: "18%", height: 1 }} />
                {status == 3 ? (
                  <View />
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: config.color_2,
                      alignSelf: "flex-start",
                      borderRadius: 20,
                      width: "20%",
                      height: windowHeight * 0.04,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      var alertTitle = lang[lang.lang].completeMealsFirst;
                      var alertMessage = "";
                      var error = false;
                      var savedMeals = [];

                      if (Object.keys(selectedMeals).length == 0) {
                        error = true;
                      } else {
                        for (var i = 0; i < meals.length; i++) {
                          if (
                            meals[i].categoryId in selectedMeals &&
                            selectedMeals[meals[i].categoryId] != -1
                          ) {
                            var mealsList = [];

                            for (
                              var k = 0;
                              k < meals[i]["category"].length;
                              k++
                            ) {
                              for (
                                var c = 0;
                                c <
                                meals[i]["category"][k]["mealListItems"].length;
                                c++
                              ) {
                                mealsList.push(
                                  meals[i]["category"][k]["mealListItems"][c]
                                );
                              }
                            }

                            for (var j = 0; j < mealsList.length; j++) {
                              if (
                                mealsList[j]["id"] ==
                                selectedMeals[meals[i].categoryId]
                              ) {
                                var savedMeal = {
                                  centerId: centerId,
                                  oid: parseInt(oId),
                                  date: usedDate,
                                  subMealId: parseInt(meals[i]["categoryId"]),
                                  mealNameAr: mealsList[j]["titleAr"],
                                  mealNameEn: mealsList[j]["titleEn"],
                                  portionValue: mealsList[j]["portionValue"],
                                  snackType: mealsList[j]["snack_typ"],
                                  sid: parseInt(selectedCat["snackTypeId"]),
                                  itemId: parseInt(mealsList[j]["itemId"]),
                                  itemCode: mealsList[j]["itemCode"],
                                  weekId: parseInt(mealsList[j]["weekId"]),
                                  dayId: parseInt(mealsList[j]["dayId"]),
                                  menuId: parseInt(mealsList[j]["menuId"]),
                                  mealId: parseInt(mealsList[j]["mealId"]),
                                };
                                console.log("Saved Meal");
                                console.log(savedMeal);
                                break;
                              }
                            }
                            savedMeals.push(savedMeal);
                          } else {
                            alertMessage =
                              alertMessage +
                              "Select " +
                              meals[i].titleEn +
                              "\n";
                            error = true;
                          }
                        }
                      }

                      if (error) {
                        Alert.alert(alertTitle, alertMessage);
                      } else {
                        console.log(savedMeals);

                        //send meals
                        setIsLoading(true);
                        axios
                          .post(
                            config.baseURL + "/api/meal/setMeals",
                            {
                              meals: savedMeals,
                            },
                            {
                              headers: {
                                Authorization: `bearer ${config.Token}`,
                              },
                            }
                          )
                          .then((response) => {
                            // console.log(response.data);
                            setIsLoading(false);
                            // console.log("Back Calendar");
                            CalendarBackHandler();
                          })
                          .catch((e) => {
                            console.log(e);
                            setIsLoading(false);
                          });
                      }
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        fontSize: 14,
                        padding: 5,
                      }}
                    >
                      {lang[lang.lang].add_meals_3}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "white",
                    fontSize: 20,
                  }}
                >
                  {lang.lang == "ar"
                    ? selectedCat.titleAr
                    : selectedCat.titleEn}
                </Text>
              </View>
            </View>
            <View style={{ height: 0.05 * windowHeight }} />
            <View style={styles.countContainer}>
              <View style={styles.countView}>
                <Text preset="t2">{lang[lang.lang].callorie}</Text>
                <Text preset="default">{calories}</Text>
              </View>
              <View style={styles.countView}>
                <Text preset="t2">{lang[lang.lang].fat}</Text>
                <Text preset="default">{fats}</Text>
              </View>
              <View style={styles.countView}>
                <Text preset="t2">{lang[lang.lang].protine}</Text>
                <Text preset="default">{proteins}</Text>
              </View>
              <View style={styles.countView}>
                <Text preset="t2">{lang[lang.lang].carb}</Text>
                <Text preset="default">{carbs}</Text>
              </View>
            </View>
            <View
              style={{
                borderRadius: 20,
                backgroundColor: "#DBDBDBCC",
                // backgroundColor: 'red',
                width: "95%",
                height: "93%",
                paddingBottom: 4,
              }}
            >
              <ScrollView
                snapToInterval={165}
                style={{ width: "100%", height: "80%" }}
              >
                <Animated.View
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    opacity: mealsFadeAnim,
                  }}
                >
                  {filteredMeals.map((filteredMealsRow) => (
                    <View
                      style={{
                        width: "100%",
                        height: 0.32 * windowHeight,
                      }}
                    >
                      <View style={{ height: 15 }} />
                      <View
                        style={{
                          height: "65%",
                          width: 0.99 * windowWidth,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        <View style={{ width: 0.025 * windowWidth }} />
                        {filteredMealsRow.map((filteredMeal, index) => {
                          console.log('filteredMeal------------', filteredMeal);
                          
                          // {"calories": 282, "carbs": 26, "categoryId": 1, "date": "2024-10-05", "dayId": 1, "fats": 18, "favourite": 0, "fixedMicros": 0, "heatingInstruction": "", "heatingTime": 0, "id": 1, "ingredientsNutrition": "", "isAmend": 0, "isHighCal": 0, "isSpicy": 0, "itemCode": "1021", "itemId": 1021, "kitchenConfirmed": false, "mealId": 1, "mealImage": "https://nubasoft.net/cust_photos/1021.jpg", "mealSelected": false, "menuId": 23, "mid": 17, "newMeal": 0, "originAr": "", "originEn": "", "portionValue": 1, "proteins": 6, "rating": 0, "snack_typ": 0, "titleAr": "بريوش الذرة بالجبن", "titleEn": "Corn cheese brioche", "weekId": 1, "wonderOfTheDish": "", "wonderOfTheDishAr": ""}
                          const isLastItem =
                          filteredMealsRow.length % 2 === 1 &&
                          index === filteredMealsRow.length - 1
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                onCalc();
                                var selMeals = selectedMeals;
                                console.log('selectedMeals------------------', selectedMeals);
                                
                                if (selectedType.categoryId in selMeals) {
                                  if (selMeals[selectedType.categoryId] == -1) {
                                    selMeals[selectedType.categoryId] =
                                      filteredMeal.id;
                                  } else {
                                    if (
                                      selMeals[selectedType.categoryId] ==
                                      filteredMeal.id
                                    ) {
                                      selMeals[selectedType.categoryId] = -1;
                                      setSelectedMeal(-1);
                                    } else {
                                      selMeals[selectedType.categoryId] =
                                        filteredMeal.id;
                                    }
                                  }
                                } else {
                                  selMeals[selectedType.categoryId] =
                                    filteredMeal.id;
                                }
                                // console.log(selectedMeals);
                                setSelectedMeals(selMeals);

                                var idx = meals.indexOf(selectedType);

                                if (
                                  idx + 1 < meals.length &&
                                  selMeals[selectedType.categoryId] != -1 &&
                                  selectedType.categoryId in selMeals &&
                                  (selMeals[meals[idx + 1].categoryId] == -1 ||
                                    !(meals[idx + 1].categoryId in selMeals))
                                ) {
                                  console.log(selMeals);
                                  setSelectedMeal(
                                    selMeals[meals[idx + 1].categoryId]
                                  );
                                  setSelectedType(meals[idx + 1]);
                                  setSelectedCat(meals[idx + 1].category[0]);
                                } else if (
                                  selMeals[selectedType.categoryId] != -1 &&
                                  selectedType.categoryId in selMeals
                                ) {
                                  console.log(
                                    selMeals[selectedType.categoryId]
                                  );
                                  setSelectedMeal(
                                    selMeals[selectedType.categoryId]
                                  );
                                }
                              }}
                              style={[styles.mealCard, {backgroundColor:
                                selectedMeal == filteredMeal.id
                                  ? status == 3
                                    ? 'white'
                                    : config.color_2
                                  : 'white',
                            }]}>
                              <Image
                                source={{ uri: filteredMeal.mealImage }}
                                defaultSource={require("../../assets/icon.png")}
                                style={styles.mealImageStyle}
                              />
                              <View style={styles.mealInfo}>
                                <Tex text={lang.lang == "ar" ? filteredMeal.titleAr : filteredMeal.titleEn} preset="t3" numberOfLines={2} style={styles.mealNameText} />
                                <View style={styles.macrosContainerStyle}>
                                  <View style={{alignItems: 'center'}}>
                                    <Tex text={lang[lang.lang].callorie} preset='footnote' color={colors.text} />
                                    <Tex text={`${filteredMeal.calories ?? 0}`} preset="t3" />
                                  </View>
                                  <View style={{alignItems: 'center'}}>
                                    <Tex text={lang[lang.lang].fat} preset='footnote' color={colors.text} />
                                    <Tex text={`${filteredMeal.fats ?? 0}`} preset="t3" />
                                  </View>
                                  <View style={{alignItems: 'center'}}>
                                    <Tex text={lang[lang.lang].protine} preset='footnote' color={colors.text} />
                                    <Tex text={`${filteredMeal.proteins ?? 0}`} preset="t3" />
                                  </View>
                                  <View style={{alignItems: 'center'}}>
                                    <Tex text={lang[lang.lang].carb} preset='footnote' color={colors.text} />
                                    <Tex text={`${filteredMeal.carbs ?? 0}`} preset="t3" />
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )
                        }
                          // <View
                          //   key={filteredMeal.id}
                          //   style={{ width: "50%", height: "100%" }}
                          // >
                          //   <TouchableOpacity
                          //     style={{
                          //       width: "90%",
                          //       height: "100%",
                          //       borderTopRightRadius: 10,
                          //       borderTopLeftRadius: 10,
                          //       backgroundColor:
                          //         selectedMeal == filteredMeal.id
                          //           ? status == 3
                          //             ? config.color_2 + "77"
                          //             : config.color_2
                          //           : config.color_1 + "99",

                          //       alignItems: "center",
                          //       justifyContent: "center",
                          //       borderWidth:
                          //         selectedMeal == filteredMeal.id ? 3 : 0,
                          //       borderColor: config.color_2,
                          //     }}
                          //     disabled={status == 3}
                              // onPress={() => {
                              //   var selMeals = selectedMeals;
                              //   if (selectedType.categoryId in selMeals) {
                              //     if (selMeals[selectedType.categoryId] == -1) {
                              //       selMeals[selectedType.categoryId] =
                              //         filteredMeal.id;
                              //     } else {
                              //       if (
                              //         selMeals[selectedType.categoryId] ==
                              //         filteredMeal.id
                              //       ) {
                              //         selMeals[selectedType.categoryId] = -1;
                              //         setSelectedMeal(-1);
                              //       } else {
                              //         selMeals[selectedType.categoryId] =
                              //           filteredMeal.id;
                              //       }
                              //     }
                              //   } else {
                              //     selMeals[selectedType.categoryId] =
                              //       filteredMeal.id;
                              //   }
                              //   // console.log(selectedMeals);
                              //   setSelectedMeals(selMeals);

                              //   var idx = meals.indexOf(selectedType);

                              //   if (
                              //     idx + 1 < meals.length &&
                              //     selMeals[selectedType.categoryId] != -1 &&
                              //     selectedType.categoryId in selMeals &&
                              //     (selMeals[meals[idx + 1].categoryId] == -1 ||
                              //       !(meals[idx + 1].categoryId in selMeals))
                              //   ) {
                              //     console.log(selMeals);
                              //     setSelectedMeal(
                              //       selMeals[meals[idx + 1].categoryId]
                              //     );
                              //     setSelectedType(meals[idx + 1]);
                              //     setSelectedCat(meals[idx + 1].category[0]);
                              //   } else if (
                              //     selMeals[selectedType.categoryId] != -1 &&
                              //     selectedType.categoryId in selMeals
                              //   ) {
                              //     console.log(
                              //       selMeals[selectedType.categoryId]
                              //     );
                              //     setSelectedMeal(
                              //       selMeals[selectedType.categoryId]
                              //     );
                              //   }
                              // }}
                          //   >
                          //     <View style={{ height: 15 }} />
                          //     <ImageBackground source={placeholder}
                          //         style={{
                          //           width: "100%",
                          //           height: "100%",
                          //           // resizeMode: "contain",
                          //           position: "absolute",
                          //           alignSelf: "flex-start",
                          //         }}>
                          //       {validURL(filteredMeal.mealImage) ? (
                          //       <Image
                          //         source={{
                          //           uri: filteredMeal.mealImage,
                          //         }}
                          //         style={{
                          //           width: "100%",
                          //           height: "100%",
                          //           resizeMode: "cover",
                          //           position: "absolute",
                          //           borderRadius: 10,
                          //         }}
                          //       />
                          //     ) : (
                          //       <Image
                          //         source={placeholder}
                          //         style={{
                          //           width: "100%",
                          //           height: "70%",
                          //           resizeMode: "contain",
                          //           position: "absolute",
                          //           alignSelf: "flex-start",
                          //         }}
                          //       />
                          //     )}
                          //     </ImageBackground>

                          //     <View
                          //       style={{
                          //         flexDirection: "row",
                          //         alignItems: "center",
                          //         justifyContent: "center",
                          //         position: "absolute",
                          //         top: -10,
                          //         left: 5,
                          //       }}
                          //     >
                          //       {/* <View
                          //         style={{
                          //           alignItems: "center",
                          //           justifyContent: "center",
                          //           backgroundColor: "black",
                          //           borderRadius: 30,
                          //           padding: 5,
                          //         }}
                          //       >
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 16,
                          //             textAlign: "center",
                          //           }}
                          //         >
                          //           {lang[lang.lang].add_meals_4}
                          //         </Text>
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 14,
                          //           }}
                          //         >
                          //           {filteredMeal.calories}
                          //         </Text>
                          //       </View> */}
                          //     </View>
                          //     <View
                          //       style={{
                          //         position: "absolute",
                          //         right: 5,
                          //         top: 5,
                          //       }}
                          //     >
                          //       <AntDesign
                          //         name="star"
                          //         size={24}
                          //         color={
                          //           filteredMeal.favourite == 1
                          //             ? "yellow"
                          //             : "white"
                          //         }
                          //         onPress={() => {
                          //           var category = selectedCat;
                          //           var meal = filteredMeal;
                          //           var idx = category.mealListItems.findIndex(
                          //             (o) => {
                          //               return o.id == filteredMeal.id;
                          //             }
                          //           );
                          //           if (filteredMeal.favourite == 0) {
                          //             meal.favourite = 1;
                          //             category.mealListItems[idx] = meal;

                          //             axios
                          //               .post(
                          //                 config.baseURL +
                          //                   "/api/meal/addFavouriteMeal",
                          //                 {
                          //                   mealId: filteredMeal.itemId,
                          //                 },
                          //                 {
                          //                   headers: {
                          //                     Authorization: `bearer ${config.Token}`,
                          //                   },
                          //                 }
                          //               )
                          //               .then((response) => {
                          //                 console.log(response);
                          //               })
                          //               .catch((e) => {
                          //                 console.log(e);
                          //               });
                          //           } else {
                          //             meal.favourite = 0;
                          //             category.mealListItems[idx] = meal;

                          //             axios
                          //               .post(
                          //                 config.baseURL +
                          //                   "/api/meal/deleteFavouriteMeal",
                          //                 {
                          //                   mealId: filteredMeal.itemId,
                          //                 },
                          //                 {
                          //                   headers: {
                          //                     Authorization: `bearer ${config.Token}`,
                          //                   },
                          //                 }
                          //               )
                          //               .then((response) => {
                          //                 console.log(response);
                          //               })
                          //               .catch((e) => {
                          //                 console.log(e);
                          //               });
                          //           }

                          //           setSelectedCat(category);
                          //           refreshMeal();
                          //           // console.log(selectedCat);
                          //         }}
                          //       />
                          //     </View>
                          //     <View style={{ height: 5 }} />
                          //     {/* <View
                          //       style={{
                          //         flexDirection: "row",
                          //         alignItems: "center",
                          //         justifyContent: "center",
                          //         marginTop: 0.1 * windowHeight,
                          //       }}
                          //     >
                          //       <View
                          //         style={{
                          //           alignItems: "center",
                          //           justifyContent: "center",
                          //         }}
                          //       >
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 14,
                          //           }}
                          //         >
                          //           {lang[lang.lang].add_meals_5}
                          //         </Text>
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 14,
                          //           }}
                          //         >
                          //           {filteredMeal.proteins + "g"}
                          //         </Text>
                          //       </View>
                          //       <View style={{ width: "5%" }} />
                          //       <View
                          //         style={{
                          //           alignItems: "center",
                          //           justifyContent: "center",
                          //         }}
                          //       >
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 14,
                          //           }}
                          //         >
                          //           {lang[lang.lang].add_meals_6}
                          //         </Text>
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 14,
                          //           }}
                          //         >
                          //           {filteredMeal.fats + "g"}
                          //         </Text>
                          //       </View>
                          //       <View style={{ width: "5%" }} />
                          //       <View
                          //         style={{
                          //           alignItems: "center",
                          //           justifyContent: "center",
                          //         }}
                          //       >
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 14,
                          //           }}
                          //         >
                          //           {lang[lang.lang].add_meals_7}
                          //         </Text>
                          //         <Text
                          //           style={{
                          //             fontFamily: "Handlee_400Regular",
                          //             color: "white",
                          //             textShadowColor: config.color_2,
                          //             textShadowOffset: { x: -5, y: -5 },
                          //             textShadowRadius: 3,
                          //             fontSize: 14,
                          //           }}
                          //         >
                          //           {filteredMeal.carbs + "g"}
                          //         </Text>
                          //       </View>
                          //     </View> */}
                          //   </TouchableOpacity>
                          //   <View
                          //     style={{
                          //       position: "absolute",
                          //       top: "100%",
                          //       width: "90%",
                          //       backgroundColor:
                          //         selectedMeal == filteredMeal.id
                          //           ? status == 3
                          //             ? config.color_2 + "77"
                          //             : config.color_2
                          //           : "#FFFFFF77",
                          //       borderRadius: 0,
                          //       alignItems: "center",
                          //       borderBottomLeftRadius: 10,
                          //       borderBottomRightRadius: 10,
                          //     }}
                          //   >
                          //     <Text
                          //       numberOfLines={1}
                          //       style={{
                          //         fontFamily: "Handlee_400Regular",
                          //         color: "black",
                          //         fontSize: 16,
                          //         textShadowColor: "white",
                          //         textShadowOffset: { x: 2, y: 2 },
                          //         textShadowRadius: 5,
                          //         alignItems: "center",
                          //         justifyContent: "center",
                          //         width: "90%",

                          //         textAlign: "center",
                          //       }}
                          //     >
                          //       {lang.lang == "ar"
                          //         ? filteredMeal.titleAr
                          //         : filteredMeal.titleEn}
                          //     </Text>
                          //     <MaterialIcons
                          //       style={{
                          //         alignSelf: "center",
                          //         justifyContent: "center",
                          //         marginLeft: "75%",
                          //       }}
                          //       onPress={() => {
                          //         setShowInfo(true);
                          //         setShowMeal(filteredMeal);
                          //       }}
                          //       name="info"
                          //       size={26}
                          //       color={"black"}
                          //     />
                          //   </View>
                          //   <View style={{ width: 0.1 * windowWidth }} />
                          // </View>
                        )}
                        <View style={{ width: 0.05 * windowWidth }} />
                      </View>
                    </View>
                  ))}
                  <View style={{ height: 0.01 * windowHeight }} />
                </Animated.View>
              </ScrollView>
            </View>
          </Animated.View>
          {showInfo ? (
            <View
              style={{
                borderRadius: 10,
                backgroundColor: config.color_2 + "EE",
                width: "90%",
                height: "88%",
                position: "absolute",
                top: "23%",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
              }}
            >
              <MaterialIcons
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 999,
                }}
                onPress={() => {
                  setShowInfo(false);
                }}
                name="close"
                size={28}
                color={"black"}
              />
              <ScrollView
                style={{
                  height: "100%",
                  width: "100%",
                  marginTop: "10%",
                }}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageBackground source={placeholder}
                      style={{
                        width: "95%",
                        height: 350,
                        resizeMode: "contain",
                        marginTop: 5,
                      }}>
                  {validURL(showMeal.mealImage) ? (
                    <Image
                      source={{
                        uri: showMeal.mealImage,
                      }}
                      style={{
                        width: "95%",
                        height: 350,
                        resizeMode: "cover",
                        marginTop: 5,
                        borderRadius: 5,
                      }}
                    />
                  ) : (
                    <Image
                      source={placeholder}
                      style={{
                        width: "95%",
                        height: 350,
                        resizeMode: "contain",
                        marginTop: 5,
                      }}
                    />
                  )}
                </ImageBackground>
                {/* <View
                  style={{
                    width: "90%",
                    height: 60,

                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    marginTop: "6%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "stretch",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: "Handlee_400Regular",
                          color: "black",
                          fontSize: 22,
                        }}
                      >
                        {lang.lang == "ar"
                          ? showMeal.titleAr
                          : showMeal.titleEn}
                      </Text>
                    </View>
                  </View>
                </View> */}

                {/* {showMeal.isSpicy == 1 ? (
                  <View
                    style={{
                      width: "95%",
                      height: 60,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      marginTop: "2%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "stretch",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontFamily: "Handlee_400Regular",
                            color: "black",
                            fontSize: 18,
                          }}
                        >
                          {lang[lang.lang].add_meals_8}{" "}
                          <MaterialIcons
                            name="fireplace"
                            size={24}
                            color={"black"}
                          />
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View />
                )} */}
                {/* {showMeal.isHighCal == 1 ? (
                  <View
                    style={{
                      width: "95%",
                      height: 60,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      marginTop: "2%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "stretch",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontFamily: "Handlee_400Regular",
                            color: "black",
                            fontSize: 18,
                            textAlign: "center",
                          }}
                        >
                          {lang[lang.lang].add_meals_9}{" "}
                          <MaterialIcons
                            name="arrow-upward"
                            size={24}
                            color={"black"}
                          />
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View />
                )} */}

                <View
                  style={{
                    width: "95%",
                    height: 60,
                    backgroundColor: config.color_2,
                    borderRadius: 10,
                    marginTop: "2%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_1,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {lang[lang.lang].add_meals_10}
                    </Text>
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_2,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {showMeal.calories}
                    </Text>
                  </View>
                  <View style={{ width: "5%" }} />
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_1,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {lang[lang.lang].add_meals_5}
                    </Text>
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_2,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {showMeal.proteins + "g"}
                    </Text>
                  </View>
                  <View style={{ width: "5%" }} />
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_1,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {lang[lang.lang].add_meals_6}
                    </Text>
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_2,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {showMeal.fats + "g"}
                    </Text>
                  </View>
                  <View style={{ width: "5%" }} />
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_1,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {lang[lang.lang].add_meals_7}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Handlee_400Regular",
                        color: "black",
                        textShadowColor: config.color_2,
                        textShadowOffset: { x: -5, y: -5 },
                        textShadowRadius: 3,
                        fontSize: 14,
                      }}
                    >
                      {showMeal.carbs + "g"}
                    </Text>
                  </View>
                </View>

                {/* <View
                  style={{
                    width: "95%",
                    height: "auto",
                    backgroundColor: config.color_2,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    marginTop: "2%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "stretch",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: "Handlee_400Regular",
                          color: "black",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {lang[lang.lang].add_meals_11}
                        {"\n\n" + showMeal.wonderOfTheDish}
                      </Text>
                    </View>
                  </View>
                </View> */}

                {/* <View
                  style={{
                    width: "95%",
                    height: "auto",
                    backgroundColor: config.color_2,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    marginTop: "2%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "stretch",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: "Handlee_400Regular",
                          color: "black",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {lang[lang.lang].add_meals_12}
                        {"\n\n" + showMeal.heatingInstruction}
                      </Text>
                    </View>
                  </View>
                </View> */}

                {/* <View
                  style={{
                    width: "95%",
                    height: "auto",
                    backgroundColor: config.color_2,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    marginTop: "2%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "stretch",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: "Handlee_400Regular",
                          color: "black",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {lang[lang.lang].add_meals_13}
                        {"\n\n" + showMeal.ingredientsNutrition}
                      </Text>
                    </View>
                  </View>
                </View> */}
                {/* <View style={{ height: 10 }} /> */}
              </ScrollView>
            </View>
          ) : (
            <View />
          )}
        </View>

        <Animated.View
          style={{
            position: "absolute",
            height: "24%",
            width: "100%",
            top: "84%",
            alignItems: "center",

            transform: [
              {
                translateY: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 500],
                }),
              },
            ],
          }}
        >
          <View
            style={{
              width: "90%",
              height: "60%",
              justifyContent: "center",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <View style={{ width: "10%", height: "1%" }} />

            {selectedType.titleEn.toLowerCase().includes("snack") ? (
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                }}
              >
                <ScrollView horizontal={true}>
                  {selectedType.category.map((typeCategory) => (
                    <View>
                      <TouchableOpacity
                        style={[
                          {
                            width: windowWidth * 0.15,
                            height: windowHeight * 0.08,
                            borderRadius: 15,
                            backgroundColor:
                              selectedCat == typeCategory
                                ? config.color_6 + "AA"
                                : config.color_1 + "AA",
                            alignItems: "center",
                            justifyContent: "center",

                            marginRight: 0.03 * windowWidth,
                          },
                          {
                            flexDirection: "column",
                            alignSelf: "flex-end",
                            alignItems: "center",
                            justifyContent: "center",
                          },
                        ]}
                        onPress={() => {
                          setSelectedCat(typeCategory);
                        }}
                      >
                        <Text
                          style={{
                            // fontFamily: "Handlee_400Regular",
                            color: "black",
                          }}
                        >
                          {typeCategory.snackTypeName}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={soup}
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: "contain",
                            }}
                          />
                        </View>

                        <View style={{ height: "10%", width: 1 }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      flexDirection: "column",
                      alignSelf: "flex-end",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => {
                    Animated.timing(menuAnim, {
                      toValue: 1,
                      easing: Easing.out(Easing.in(Easing.elastic(1))),
                      duration: 1000,
                      useNativeDriver: true,
                    }).start();

                    Animated.timing(mealsFadeAnim, {
                      toValue: 0,
                      duration: 1000,
                      useNativeDriver: true,
                    }).start();
                  }}
                >
                  <View style={{ height: "10%", width: "1%" }} />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedType.titleEn == "breakfast" ? (
                      <Image
                        source={breakfast}
                        style={{ width: 55, height: 35 }}
                      />
                    ) : selectedType.titleEn.toLowerCase().includes("lunch") ? (
                      <Image source={lunch} style={{ width: 30, height: 35 }} />
                    ) : selectedType.titleEn
                        .toLowerCase()
                        .includes("dinner") ? (
                      <Image
                        source={dinner}
                        style={{ width: 30, height: 35 }}
                      />
                    ) : selectedType.titleEn.toLowerCase().includes("soup") ? (
                      <Image source={soup} style={{ width: 45, height: 35 }} />
                    ) : selectedType.titleEn.toLowerCase().includes("salad") ? (
                      <Image source={salad} style={{ width: 40, height: 35 }} />
                    ) : selectedType.titleEn.toLowerCase().includes("snack") ? (
                      <Image
                        source={snack1}
                        style={{ width: 30, height: 35 }}
                      />
                    ) : selectedType.titleEn.toLowerCase().includes("snack") ? (
                      <Image
                        source={snack2}
                        style={{ width: 30, height: 35 }}
                      />
                    ) : (
                      <Image
                        source={breakfast}
                        style={{ width: 55, height: 35 }}
                      />
                    )}
                    <View style={{ width: "5%", height: 1 }} />
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        fontWeight: "800",
                      }}
                    >
                      {lang.lang == "ar"
                        ? selectedType.titleAr
                        : selectedType.titleEn}
                    </Text>
                    <View style={{ width: "5%", height: 1 }} />
                    <Feather name="chevron-up" size={20} color="black" />
                  </View>

                  <View style={{ height: "10%", width: 1 }} />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{ flexDirection: "row", height: "100%", width: "100%" }}
              >
                <View style={{ width: "60%" }} />

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      flexDirection: "column",
                      alignSelf: "flex-end",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => {
                    Animated.timing(menuAnim, {
                      toValue: 1,
                      easing: Easing.out(Easing.in(Easing.elastic(1))),
                      duration: 1000,
                      useNativeDriver: true,
                    }).start();

                    Animated.timing(mealsFadeAnim, {
                      toValue: 0,
                      duration: 1000,
                      useNativeDriver: true,
                    }).start();
                  }}
                >
                  <View style={{ height: "10%", width: "1%" }} />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedType.titleEn == "breakfast" ? (
                      <Image
                        source={breakfast}
                        style={{ width: 55, height: 35 }}
                      />
                    ) : selectedType.titleEn.toLowerCase().includes("lunch") ? (
                      <Image source={lunch} style={{ width: 30, height: 35 }} />
                    ) : selectedType.titleEn
                        .toLowerCase()
                        .includes("dinner") ? (
                      <Image
                        source={dinner}
                        style={{ width: 30, height: 35 }}
                      />
                    ) : selectedType.titleEn.toLowerCase().includes("soup") ? (
                      <Image source={soup} style={{ width: 45, height: 35 }} />
                    ) : selectedType.titleEn.toLowerCase().includes("salad") ? (
                      <Image source={salad} style={{ width: 40, height: 35 }} />
                    ) : selectedType.titleEn.toLowerCase().includes("snack") ? (
                      <Image
                        source={snack1}
                        style={{ width: 30, height: 35 }}
                      />
                    ) : selectedType.titleEn.toLowerCase().includes("snack") ? (
                      <Image
                        source={snack2}
                        style={{ width: 30, height: 35 }}
                      />
                    ) : (
                      <Image
                        source={breakfast}
                        style={{ width: 55, height: 35 }}
                      />
                    )}
                    <View style={{ width: "5%", height: 1 }} />
                    <Text
                      style={{
                        // fontFamily: "Handlee_400Regular",
                        color: "black",
                        fontWeight: "800",
                      }}
                    >
                      {lang.lang == "ar"
                        ? selectedType.titleAr
                        : selectedType.titleEn}
                    </Text>
                    <View style={{ width: "5%", height: 1 }} />
                    <Feather name="chevron-up" size={20} color="black" />
                  </View>

                  <View style={{ height: "10%", width: 1 }} />
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: "10%" }} />
          </View>
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            height: "40%",
            width: "100%",
            top: "85%",
            alignItems: "center",
            transform: [
              {
                translateY: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0],
                }),
              },
            ],
          }}
        >
          <ScrollView
            horizontal={true}
            bounces={true}
            snapToInterval={windowWidth * 0.2}
            style={{ height: "100%", width: "100%", zIndex: 999, flex: 1 }}
          >
            <View style={{ width: "2%" }} />
            {meals.map((cat) => (
              <View style={{ width: windowWidth * 0.2, height: "100%" }}>
                <View style={{ width: "10%" }} />

                <TouchableOpacity
                  style={{
                    width: "80%",
                    height: "60%",
                    borderRadius: 15,
                    backgroundColor:
                      selectedType == cat
                        ? config.color_2
                        : config.color_1 + "66",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setSelectedType(cat);
                    var selMeals = selectedMeals;
                    if (cat.categoryId in selMeals) {
                      console.log(selMeals[3]);
                      setSelectedMeal(selMeals[cat.categoryId]);
                    } else {
                      setSelectedMeal(-1);
                    }

                    setSelectedCat(cat.category[0]);
                    Animated.timing(mealsFadeAnim, {
                      toValue: 1,
                      easing: Easing.out(Easing.in(Easing.elastic(1))),
                      duration: 1000,
                      useNativeDriver: true,
                    }).start();
                    Animated.timing(menuAnim, {
                      toValue: 0,
                      easing: Easing.out(Easing.in(Easing.elastic(1))),
                      duration: 1000,
                      useNativeDriver: true,
                    }).start();
                  }}
                >
                  <View style={{ height: 5 }} />

                  {cat.titleEn == "breakfast" ? (
                    <Image
                      source={breakfast}
                      style={{ width: 55, height: 35 }}
                    />
                  ) : cat.titleEn.toLowerCase().includes("lunch") ? (
                    <Image source={lunch} style={{ width: 30, height: 35 }} />
                  ) : cat.titleEn.toLowerCase().includes("dinner") ? (
                    <Image source={dinner} style={{ width: 30, height: 35 }} />
                  ) : cat.titleEn.toLowerCase().includes("soup") ? (
                    <Image source={soup} style={{ width: 30, height: 35 }} />
                  ) : cat.titleEn.toLowerCase().includes("salad") ? (
                    <Image source={salad} style={{ width: 40, height: 35 }} />
                  ) : cat.titleEn.toLowerCase().includes("snack") ? (
                    <Image source={snack1} style={{ width: 30, height: 35 }} />
                  ) : cat.titleEn.toLowerCase().includes("snack") ? (
                    <Image source={snack2} style={{ width: 30, height: 35 }} />
                  ) : (
                    <Image
                      source={breakfast}
                      style={{ width: 55, height: 35 }}
                    />
                  )}

                  <View style={{ height: 8 }} />

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                    }}
                  >
                    {lang.lang == "ar" ? cat.titleAr : cat.titleEn}
                  </Text>
                </TouchableOpacity>

                <View style={{ width: "10%" }} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
};

export default AddMeals;

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
    height: "68%",
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
    width: "40%",
    height: 0.06 * windowHeight,
    borderRadius: 15,
    backgroundColor: config.color_2,
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


  mealCard: {
    borderWidth: 1,
    borderColor: colors.grey,
    flex: 1,
    marginEnd: spacing.extraSmall,
    borderRadius: 8,
    marginBottom: spacing.extraSmall * 3,
    borderWidth: 1,
    borderColor: colors.grey,
    height: 266,
  },
  lastItemCard: {
    flex: 0,
    flexShrink: 1,
    width: (dimensions.width - 30) / 2,
  },
  mealImageStyle: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  macrosContainerStyle: {
    marginTop: spacing.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealInfo: {
    padding: spacing.extraSmall,
  },

  countContainer: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderBlockColor: colors.lightYellow,
    borderBottomWidth: 1,
    borderBlockColor: colors.lightYellow,
  },
  countView: {
    width: "23%",
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  countView2: {
    marginVertical: 4,
  },
  countKey: {
    // fontFamily: "Handlee_400Regular",
    color: "black",
    fontSize: 14,
    textShadowColor: "white",
    textShadowOffset: { x: 2, y: 2 },
    textShadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",

    textAlign: "center",
  },
});
