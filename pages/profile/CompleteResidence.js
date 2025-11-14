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
import OTPTextView from "react-native-otp-textinput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView } from "react-native-gesture-handler";

const purp = require("../../assets/purp.png");
const groceries = require("../../assets/groceries.png");
const otp = require("../../assets/otp.png");
const hm = require("../../assets/healthy_man.png");
const male_img = require("../../assets/male.png");
const female_img = require("../../assets/female.png");
import axios from "axios";
import { lang } from "../../lang";

var CompleteResidence = ({ navigation, handler }) => {
  const [block, onChangeBlock] = useState("");
  const [building, onChangebuilding] = useState("");
  const [jadda, onChangejadda] = useState("");
  const [street, onChangeStreet] = useState("");
  const [flat, onChangeflat] = useState("");
  const [floor, onChangeFloor] = useState("");
  const [areaOpen, setareaOpen] = useState(false);
  const [areaValue, setareaValue] = useState(0);
  const [areaItems, setareaItems] = useState([
    { label: lang[lang.lang].complete_residence_14, value: "0" },
  ]);
  const [governOpen, setgovernOpen] = useState(false);
  const [governValue, setgovernValue] = useState(0);
  const [governItems, setgovernItems] = useState([]);
  const [governAreasResponse, setGovernAreasResponse] = useState([]);
  const [notes, onChangenotes] = useState("");

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0

  //Load font
  // let [fontsLoaded] = useFonts({
  //   Handlee_400Regular,
  // });

  var getAreas = () => {
    // Get Areas
    axios
      .get(config.baseURL + "/api/address/getAreas")
      .then((response) => {
        var Governs = [];
        console.log(response.data)
        // governAreasResponse = response.data;
        setGovernAreasResponse(response.data);
        for (let i = 0; i < response.data.length; i++) {
          Governs.push({
            label: lang.lang == "ar" ? response.data[i].governmentNameAr : response.data[i].governmentNameEn,
            value: response.data[i].governmentId,
          });
        }
        setgovernItems(Governs);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAreas();
  }, []);

  useEffect(() => {
    console.log(governValue);
    console.log(governAreasResponse);
    if (governValue != 0) {
      var areasf = [];
      for (let i = 0; i < governAreasResponse.length; i++) {
        if (governAreasResponse[i].governmentId == governValue) {
          areasf = governAreasResponse[i].data;
        }
      }
      var areasItemsformat = [];
      for (let i = 0; i < areasf.length; i++) {
        areasItemsformat.push({
          label: lang.lang == "ar" ? areasf[i].name : areasf[i].nameEn,
          value: areasf[i].id,
        });
      }
      setareaItems(areasItemsformat);
      // setareaItems([{ label: "Test Area", value: "0" }]);
      console.log(areasItemsformat);
    } else {
      setareaItems([{ label: "Choose government first", value: "0" }]);
      // setmaxAreaSelect(0);
    }
  }, [governValue]);

  if (false/* !fontsLoaded */) {
    //to do: create custom loader
    return <View />;
  } else {
    return (
      <View style={styles.body}>
        <View style={{ height: "20%", width: "100%" }} />
        <View
          style={[
            styles.inputBody,
            { borderColor: config.color_1, borderWidth: 2 },
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
            <View style={{ height: "1%" }} />

            <View style={{ flexDirection: "row" }}>
              <Image source={hm} style={{ height: "125%", width: "12%" }} />
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  fontSize: 24,
                }}
              >
                {lang[lang.lang].complete_residence_1}
              </Text>
            </View>
            <View style={{ height: "4%" }} />

            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                zIndex: 999,
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  alignSelf: "center",
                  marginRight: "15%",
                  marginLeft: "15%",
                }}
              >
                {lang[lang.lang].complete_residence_2}
              </Text>

              <DropDownPicker
                style={{
                  alignSelf: "center",
                  backgroundColor: config.color_2,
                  width: "80%",
                  marginRight: "15%",
                  marginLeft: "15%",
                }}
                textStyle={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  textAlign: lang.lang == "ar" ? "right" : "left"
                }}
                multiple={false}
                searchable={true}
                open={governOpen}
                value={governValue}
                items={governItems}
                setOpen={setgovernOpen}
                setValue={setgovernValue}
                setItems={setgovernItems}
                placeholder={lang[lang.lang].complete_residence_3}
              />
            </View>

            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginTop: "3%",
                zIndex: 900,
              }}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  alignSelf: "center",
                  marginRight: "15%",
                  marginLeft: "15%",
                }}
              >
                {lang[lang.lang].complete_residence_4}
              </Text>
              <DropDownPicker
                style={{
                  alignSelf: "center",
                  backgroundColor: config.color_2,
                  width: "80%",
                  marginRight: "15%",
                  marginLeft: "15%",
                }}
                textStyle={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  textAlign: lang.lang == "ar" ? "right" : "left"
                }}
                multiple={false}
                searchable={true}
                open={areaOpen}
                value={areaValue}
                items={areaItems}
                setOpen={setareaOpen}
                setValue={setareaValue}
                setItems={setareaItems}
                placeholder={lang[lang.lang].complete_residence_5}
              />
            </View>
            <View style={{ height: "2%" }} />

            <KeyboardAwareScrollView
              style={{
                width: "95%",
                alignSelf: "center",
              }}
              enableAutomaticScroll={false}
            >
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: "black",
                  alignSelf: "center",
                }}
              >
                {lang[lang.lang].complete_residence_6}
              </Text>
              <View style={{
                width: "80%",
                height: "8%",
                backgroundColor: config.color_2,
                borderRadius: 10,
                justifyContent: "center",
                borderWidth: 2,
                borderColor: config.color_2,
                alignSelf: "center"
              }}>
                <TextInput
                  style={{ margin: 20, height: 100, textAlign: lang.lang == "ar" ? "right" : "left" }}
                  autoCorrect={false}
                  placeholder={lang[lang.lang].complete_residence_6}
                  value={notes}
                  onChangeText={onChangenotes}

                ></TextInput>
              </View>
              <View style={{ flexDirection: "row", height: "150%", justifyContent: "center", marginTop: "2%" }}>


                <View>




                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                      marginRight: "15%",
                    }}
                  >
                    {lang[lang.lang].complete_residence_7}
                  </Text>
                  <View style={styles.field}>
                    <TextInput
                      style={{ margin: 20, height: 100, textAlign: lang.lang == "ar" ? "right" : "left" }}
                      autoCorrect={false}
                      placeholder={lang[lang.lang].complete_residence_7}
                      onChangeText={onChangeBlock}
                    ></TextInput>
                  </View>
                  <View style={{ height: "2%" }} />

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                      marginRight: "15%",
                    }}
                  >
                    {lang[lang.lang].complete_residence_8}
                  </Text>
                  <View style={styles.field}>
                    <TextInput
                      style={{ margin: 20, height: 100, textAlign: lang.lang == "ar" ? "right" : "left" }}
                      autoCorrect={false}
                      placeholder={lang[lang.lang].complete_residence_8}
                      onChangeText={onChangebuilding}
                    ></TextInput>
                  </View>
                  <View style={{ height: "2%" }} />

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                      marginRight: "15%",
                    }}
                  >
                    {lang[lang.lang].complete_residence_9}
                  </Text>
                  <View style={styles.field}>
                    <TextInput
                      style={{ margin: 20, height: 100, textAlign: lang.lang == "ar" ? "right" : "left" }}
                      autoCorrect={false}
                      placeholder={lang[lang.lang].complete_residence_9}
                      onChangeText={onChangejadda}
                    ></TextInput>
                  </View>


                </View>




                <View>




                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                      marginRight: "15%",
                    }}
                  >
                    {lang[lang.lang].complete_residence_10}
                  </Text>
                  <View style={styles.field}>
                    <TextInput
                      style={{ margin: 20, height: 100, textAlign: lang.lang == "ar" ? "right" : "left" }}
                      autoCorrect={false}
                      placeholder={lang[lang.lang].complete_residence_10}
                      onChangeText={onChangeStreet}
                    ></TextInput>
                  </View>
                  <View style={{ height: "2%" }} />

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                      marginRight: "15%",
                    }}
                  >
                    {lang[lang.lang].complete_residence_11}
                  </Text>
                  <View style={styles.field}>
                    <TextInput
                      style={{ margin: 20, height: 100, textAlign: lang.lang == "ar" ? "right" : "left" }}
                      autoCorrect={false}
                      placeholder={lang[lang.lang].complete_residence_11}
                      onChangeText={onChangeflat}
                    ></TextInput>
                  </View>
                  <View style={{ height: "2%" }} />

                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                      alignSelf: "center",
                      marginRight: "15%",
                    }}
                  >
                    {lang[lang.lang].complete_residence_12}
                  </Text>
                  <View style={styles.field}>
                    <TextInput
                      style={{ margin: 20, height: 100, textAlign: lang.lang == "ar" ? "right" : "left" }}
                      autoCorrect={false}
                      placeholder={lang[lang.lang].complete_residence_12}
                      onChangeText={onChangeFloor}
                    ></TextInput>
                  </View>



                </View>



              </View>


            </KeyboardAwareScrollView>
          </Animated.View>
        </View>

        <View style={{ height: "2%" }} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (
              areaValue != 0 &&
              block != "" &&
              building != "" &&
              street != ""
            ) {
              handler(areaValue, block, building, jadda, street, flat, floor, notes);
            } else {
              Alert.alert(lang[lang.lang].complete_residence_alert_15);
            }
          }}
        >
          <Text style={{
            // fontFamily: "Handlee_400Regular",
            color: "black",
            }}>
            {lang[lang.lang].complete_residence_13}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default CompleteResidence;

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
    backgroundColor: "#DBDBDBCC",
    borderRadius: 15,
    width: "90%",
    height: "65%",
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
    height: "5%",
    // zIndex: 0,
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
