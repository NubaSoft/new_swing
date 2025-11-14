import {
  Animated,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  Easing,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { lang } from "../../lang";

const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const otp = require("../../assets/otp.png");
const pm = require("../../assets/personal.png");
const male_img = require("../../assets/pro.png");
const subs_image = require("../../assets/transaction.png");
const per_img = require("../../assets/healthy-diet.png");
const ruler = require("../../assets/ruler.png");
const back_arrow = require("../../assets/back-arrow.png");

var EditAllergDislikes = ({ navigation, backHandler, setIsLoading }) => {
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  const [userAllergies, setUserAllergies] = useState([]);
  const [userDislikes, setUserDislikes] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [itemsDislike, setItemsDislike] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
  const [itemsAllergies, setItemsAllergies] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
  const [open_dis, setOpen_Dis] = useState(false);
  const [value_dis, setValue_Dis] = useState([]);

  const [isAdd, setIsAdd] = useState(false);

  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  var getDislikeAlerg = () => {
    // Get Dislikes
    axios
      .get(config.baseURL + "/api/items/dislikeItems")
      .then((response) => {
        var dislikeArr = [];
        //   console.log(response.data.dislikesItems[1].id);
        for (let i = 0; i < response.data.dislikesItems.length; i++) {
          dislikeArr.push({
            label: response.data.dislikesItems[i].name,
            value: response.data.dislikesItems[i].id,
          });
        }
        //   console.log(dislikeArr)
        setItemsDislike(dislikeArr);
      })
      .catch((e) => {
        console.log(e);
      });

    // Get Allergies

    axios
      .get(config.baseURL + "/api/items/allergiesItems")
      .then((response) => {
        var allergiesArr = [];
        for (let i = 0; i < response.data.allergiesItems.length; i++) {
          allergiesArr.push({
            label: response.data.allergiesItems[i].name,
            value: response.data.allergiesItems[i].id,
          });
        }
        //   console.log(allergiesArr)
        setItemsAllergies(allergiesArr);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  var getUserAllergies = () => {
    setIsLoading(true);
    axios
      .get(config.baseURL + "/api/meals/getUserAllergies", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then((response) => {
        setUserAllergies(response.data.allergies);
        var aller = [];
        for (let i = 0; i < response.data.allergies.length; i++) {
          aller.push(response.data.allergies[i].id);
        }
        //   console.log(dislikeArr)
        setValue(aller);
        console.log(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setUserAllergies({ id: 1, name: "No Allergies found" });
        setIsLoading(false);
      });
  };

  var getUserDislikes = () => {
    setIsLoading(true);
    axios
      .get(config.baseURL + "/api/meals/getUserDislikes", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then((response) => {
        setUserDislikes(response.data.dislikesItems);
        var disl = [];
        for (let i = 0; i < response.data.dislikesItems.length; i++) {
          disl.push(response.data.dislikesItems[i].id);
        }
        //   console.log(dislikeArr)
        setValue_Dis(disl);
        console.log(response.data.dislikesItems);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  var addAllergDislikes = () => {
    setIsLoading(true);
    axios
      .post(
        config.baseURL + "/api/meals/setDislikedItems",
        {
          ids: value_dis,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        axios
          .post(
            config.baseURL + "/api/meals/setAllergyItems",
            {
              ids: value,
            },
            {
              headers: {
                Authorization: `bearer ${config.Token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            getUserAllergies();
            getUserDislikes();
            Alert.alert(lang[lang.lang].allergies_dislikes_alert_4);
            setIsAdd(false);
            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
            console.log("Error in setAllergyItems");
          });
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        console.log("ERROR IN clearDislikesItems");
      });
  };

  useEffect(() => {
    getUserAllergies();
    getUserDislikes();
    getDislikeAlerg();
  }, []);

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View style={styles.body}>
        <View
          style={{
            position: "absolute",
            left: 20,
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
              backHandler();
            }}
          >
            <Image source={back_arrow} style={{ height: 30, width: 30 }} />
          </TouchableOpacity>
        </View>

        <View style={{ height: "12%", width: "100%" }} />

        {isAdd ? (
          <View
            style={[
              styles.inputBody,
              {
                alignSelf: "center",
                backgroundColor: config.color_3,
              },
            ]}
          >
            <MaterialIcons
              onPress={() => {
                getUserAllergies();
                getUserDislikes();
                setIsAdd(false);
              }}
              name="cancel"
              size={28}
              color="black"
              style={{ position: "absolute", right: 10, top: 10 }}
            />
            <View style={{ height: "3%" }} />

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {lang[lang.lang].allergies_dislikes_1}
              </Text>
            </View>
            <View style={{ height: "8%" }} />

            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
                zIndex: 999,
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                }}
              >
                {lang[lang.lang].allergies_dislikes_2}
              </Text>
              <DropDownPicker
                style={{
                  width: "80%",

                  alignSelf: "center",
                  backgroundColor: config.color_2,
                }}
                textStyle={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                }}
                multiple={true}
                min={0}
                max={10}
                searchable={true}
                open={open_dis}
                value={value_dis}
                items={itemsDislike}
                setOpen={setOpen_Dis}
                setValue={setValue_Dis}
                setItems={setItemsDislike}
              />
            </View>

            <View style={{ height: "4%" }} />
            <View
              style={{
                width: "80%",
                alignContent: "center",
                alignItems: "center",
                zIndex: 900,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                }}
              >
                {lang[lang.lang].allergies_dislikes_3}
              </Text>
              <DropDownPicker
                style={{
                  alignSelf: "center",
                  backgroundColor: config.color_2,
                  width: "80%",
                }}
                textStyle={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                }}
                multiple={true}
                min={0}
                max={10}
                searchable={true}
                open={open}
                value={value}
                items={itemsAllergies}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItemsAllergies}
              />
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.inputBody,
              {
                alignSelf: "center",
                backgroundColor: "#53535311",
              },
            ]}
          >
            <View style={{ height: "2%" }} />
            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: "black",
                fontSize: 24,
              }}
            >
              <MaterialCommunityIcons name="allergy" size={25} color="black" />

              {lang[lang.lang].allergies_dislikes_3}
            </Text>
            <View style={{ height: "2%" }} />
            <View
              style={{
                height: "40%",
                width: "100%",
              }}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "90%",
                  height: 200,
                  backgroundColor: config.color_3,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginTop: "2%",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "space-evenly",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <ScrollView
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    contentContainerStyle={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {userAllergies.map((allergies) => (
                      <View
                        key={allergies.id}
                        style={{
                          // fontFamily: "Handlee_400Regular",
                          color: "black",
                          width: "100%",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 50,
                        }}
                      >
                        <Text
                          style={{
                            // fontFamily: "Handlee_400Regular",
                            color: "black",
                            fontSize: 15,
                          }}
                        >
                          {allergies.name}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={{ width: "10%" }} />
                </View>
              </View>
            </View>

            <View style={{ height: "2%" }} />

            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: "black",
                fontSize: 24,
              }}
            >
              <Ionicons name="heart-dislike" size={25} color="black" />
              {lang[lang.lang].allergies_dislikes_2}
            </Text>
            <View style={{ height: "5%" }} />
            <View
              style={{
                height: "40%",
                width: "100%",
              }}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "90%",
                  height: 200,
                  backgroundColor: config.color_3,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginTop: "2%",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "space-evenly",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <ScrollView
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    contentContainerStyle={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {userDislikes.map((dislikes) => (
                      <View
                        key={dislikes.id}
                        style={{
                          // fontFamily: "Handlee_400Regular",
                          color: "black",
                          width: "100%",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 50,
                        }}
                      >
                        <Text
                          style={{
                            // fontFamily: "Handlee_400Regular",
                            color: "black",
                            fontSize: 15,
                          }}
                        >
                          {dislikes.name}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={{ width: "10%" }} />
                </View>
              </View>
            </View>
          </View>
        )}
        <View style={{ height: "2%" }}></View>
        {isAdd ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (value.length >= 0 && value_dis.length >= 0) {
                addAllergDislikes();
              } else {
                Alert.alert(lang[lang.lang].complete_residence_alert_15);
              }
            }}
          >
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              }}>
              {lang[lang.lang].edit_profile_9}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row-reverse" }}>
            <View style={{ width: "5%" }}></View>
            <TouchableOpacity
              style={{
                borderRadius: 1000,
                backgroundColor: config.color_3,
                height: 50,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setIsAdd(true);
              }}
            >
              <Ionicons name="add" size={50} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
};

export default EditAllergDislikes;

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
    borderRadius: 15,
    marginTop: 20,
    width: "90%",
    height: "75%",
    alignItems: "center",
  },
  maleBody: {
    borderRadius: 15,
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  femaleBody: {
    borderRadius: 15,
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "90%",
    height: "5%",
    borderRadius: 15,
    backgroundColor: config.color_3,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
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
