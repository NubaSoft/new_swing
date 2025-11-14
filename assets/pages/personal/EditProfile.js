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
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppLoading } from "expo";
// import { useFonts, Handlee_400Regular } from "@expo-google-fonts/handlee";
import { config } from "../../config";
import OTPTextView from "react-native-otp-textinput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import Slider from "@react-native-community/slider";
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

var EditProfile = ({ navigation, backHandler, setIsLoading }) => {
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current; //Initial value for translation is 0
  const [block, onChangeBlock] = useState("");
  const [building, onChangebuilding] = useState("");
  const [jadda, onChangejadda] = useState("");
  const [notes, onChangenotes] = useState("");
  const [street, onChangeStreet] = useState("");
  const [flat, onChangeflat] = useState("");
  const [floor, onChangeFloor] = useState("");
  const [areaOpen, setareaOpen] = useState(false);
  const [areaValue, setareaValue] = useState(0);
  const [areaItems, setareaItems] = useState([
    { label: lang[lang.lang].edit_profile_6, value: "0" },
  ]);
  const [governOpen, setgovernOpen] = useState(false);
  const [governValue, setgovernValue] = useState(0);
  const [governItems, setgovernItems] = useState([
    { label: "Hawaly", value: "hawaly" },
    { label: "Salmeya", value: "salmeya" },
  ]);
  const [deliveryDaysOpen, setdeliveryDaysOpen] = useState(false);
  const [deliveryDaysValue, setdeliveryDaysValue] = useState([]);
  const [deliveryDaysItems, setdeliveryDaysItems] = useState([]);

  const [deliveryTimeOpen, setdeliveryTimeOpen] = useState(false);
  const [deliveryTimeValue, setdeliveryTimeValue] = useState(0);
  const [deliveryTimeItems, setdeliveryTimeItems] = useState([]);
  const [deliveryTimeInfo, setDeliveryTimeInfo] = useState("");

  const [governAreasResponse, setGovernAreasResponse] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [delivaryDays, setDeliveryDays] = useState([]);
  const [weekdays, setWeekDays] = useState([]);
  const [editAdressID, setEditAdressID] = useState(0);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [status, setStatus] = useState(1);
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
        // console.log(response.data[0].governmentNameEn)
        //   console.log(response.data.dislikesItems[1].id);
        setGovernAreasResponse(response.data);
        for (let i = 0; i < response.data.length; i++) {
          Governs.push({
            label:
              lang.lang == "ar"
                ? response.data[i].governmentNameAr
                : response.data[i].governmentNameEn,
            value: response.data[i].governmentId,
          });
        }
        // console.log(Areas);
        setgovernItems(Governs);

        axios
          .get(config.baseURL + "/api/address/getAdresses")
          .then((response) => {
            setDeliveryDays(response.data[0].deliveryDays);
            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  var getAddresses = () => {
    setIsLoading(true);
    axios
      .get(config.baseURL + "/api/address/getAdresses", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          setAddresses(response.data);
        }
        console.log(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  var deleteAddress = (address) => {
    setIsLoading(true);
    axios
      .delete(config.baseURL + "/api/address/deleteAddress", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
        data: {
          addressId: address.did,
        },
      })
      .then((response) => {
        getAddresses();
      })
      .catch((e) => {
        Alert.alert(
          lang[lang.lang].edit_profile_alert_28,
          lang[lang.lang].edit_profile_alert_29
        );
        console.log(e);
        setIsLoading(false);
      });
  };
  var addAddress = () => {
    setIsLoading(true);
    console.log({
      addressName: addressName,
      area: parseInt(areaValue),
      block: parseInt(block),
      street: parseInt(street),
      jadda: parseInt(jadda),
      building: parseInt(building),
      floor: parseInt(floor),
      flat: parseInt(flat),
      timeslot: deliveryTimeValue,
      deliveryDays: deliveryDaysValue,
      notes: notes,
    });
    axios
      .post(
        config.baseURL + "/api/address/addAddress",
        {
          addressName: addressName,
          area: areaValue,
          block: block,
          street: street,
          jadda: jadda,
          building: building,
          floor: floor,
          flat: flat,
          timeslot: deliveryTimeValue,
          deliveryDays: deliveryDaysValue,
          notes: notes,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.hasOwnProperty("message")) {
          getAddresses();
          Alert.alert(
            lang[lang.lang].edit_profile_alert_30,
            lang[lang.lang].edit_profile_alert_31 +
            addressName +
            lang[lang.lang].edit_profile_alert_32
          );
          setIsAdd(false);
          setIsLoading(false);
        } else {
          getAddresses();
          Alert.alert(
            lang[lang.lang].edit_profile_alert_28,
            response.data.errorMessage
          );
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  var getTimeSlots = () => {
    axios
      .post(
        config.baseURL + "/api/address/deliveryTimes",
        { centerId: 1 },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        let Timeslots = [];
        for (let i = 0; i < response.data.length; i++) {
          console.log(response.data[i]);
          Timeslots.push({
            label:
              (lang.lang == "ar"
                ? response.data[i].nameAr
                : response.data[i].nameEn) +
              "( from: " +
              response.data[i].startTime +
              " to: " +
              response.data[i].endTime +
              ")",
            value: response.data[i].id,
          });
        }
        setdeliveryTimeItems(Timeslots);
        console.log(TimeInfo);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  var getWeekDays = () => {
    axios
      .put(
        config.baseURL + "/api/register/getDietDetails",
        {
          renew: 0,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        var weekDaysArr = [];
        for (let i = 0; i < response.data.weekDays.length; i++) {

          if (response.data.weekDays[i] !== "Friday") {
            weekDaysArr.push({
              label: lang[lang.lang][response.data.weekDays[i]],
              value: response.data.weekDays[i],
            });
          }
        }
        setdeliveryDaysItems(weekDaysArr);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  var setEditAdressValues = (adressChoosen) => {
    let areaID = 0;
    for (let i = 0; i < governAreasResponse.length; i++) {
      for (let j = 0; j < governAreasResponse[i].data.length; j++) {
        if (governAreasResponse[i].data[j].name == adressChoosen.area) {
          areaID = governAreasResponse[i].data[j].id;
          console.log("AREAAAA FOUNDDDDD");
        }
      }
    }
    setEditAdressID(adressChoosen.did);
    setAddressName(adressChoosen.addressName);
    setareaValue(areaID);
    onChangeBlock(adressChoosen.block);
    onChangeStreet(adressChoosen.street);
    onChangejadda(adressChoosen.jadda);
    onChangebuilding(adressChoosen.building);
    setdeliveryTimeValue(adressChoosen.timeSlotId);
    setdeliveryDaysValue(adressChoosen.deliveryDays);
    onChangenotes(adressChoosen.notes);
  };
  var editAdress = () => {
    setIsLoading(true);
    console.log({
      addressId: editAdressID,
      addressName: addressName,
      area: areaValue,
      block: block,
      street: street,
      jadda: jadda,
      building: building,
      timeslot: deliveryTimeValue,
      deliveryDays: deliveryDaysValue,
    });
    axios
      .put(
        config.baseURL + "/api/address/editAddress",
        {
          addressId: editAdressID,
          addressName: addressName,
          area: areaValue,
          block: block,
          street: street,
          jadda: jadda,
          building: building,
          timeslot: deliveryTimeValue,
          deliveryDays: deliveryDaysValue,
          notes: notes,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        getAddresses();
        Alert.alert(
          lang[lang.lang].edit_profile_alert_25,
          lang[lang.lang].edit_profile_alert_31 +
          addressName +
          lang[lang.lang].edit_profile_alert_32
        );
        setIsEdit(false);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("EDIT ADDRESS EROR !!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(e.message);
        setIsLoading(false);
      });
  };

  var daysString = (days) => {
    var daysStr = "";
    for (var i = 0; i < days.length; i++) {
      daysStr += lang[lang.lang][days[i]] + "\n";
    }
    return daysStr;
  };
  useEffect(() => {
    getAddresses();
    getTimeSlots();
    getAreas();
    getWeekDays();
  }, []);

  useEffect(() => {
    console.log(governValue);
    if (governValue != 0) {
      var areasf = [];
      for (let i = 0; i < governAreasResponse.length; i++) {
        console.log(governAreasResponse[i].governmentId);
        if (governAreasResponse[i].governmentId == governValue) {
          areasf = governAreasResponse[i].data;
        }
      }
      // Change this code to set areas
      // setmaxAreaSelect(1);
      var areasItemsformat = [];
      for (let i = 0; i < areasf.length; i++) {
        areasItemsformat.push({
          label: lang.lang == "ar" ? areasf[i].name : areasf[i].nameEn,
          value: areasf[i].id,
        });
      }
      setareaItems(areasItemsformat);
    } else {
      setareaItems([{ label: lang[lang.lang].edit_profile_6, value: "0" }]);
      // setmaxAreaSelect(0);
    }
  }, [governValue]);

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
                setStatus(1);
                getAddresses();
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
                {lang[lang.lang].edit_profile_1}
              </Text>
            </View>
            <View style={{ height: "4%" }} />
            {status != 1 ? (
              <MaterialIcons
                onPress={() => {
                  setStatus(1);
                }}
                name="arrow-left"
                size={34}
                color="black"
                style={{ position: "absolute", left: 10, top: 10 }}
              />
            ) : (
              <View />
            )}

            {status == 1 ? (
              <View>
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
                      textAlign: lang.lang == "ar" ? "right" : "left",
                    }}
                  >
                    {lang[lang.lang].edit_profile_2}
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
                      textAlign: lang.lang == "ar" ? "right" : "left",
                    }}
                    multiple={true}
                    searchable={true}
                    open={deliveryDaysOpen}
                    value={deliveryDaysValue}
                    items={deliveryDaysItems}
                    setOpen={setdeliveryDaysOpen}
                    setValue={setdeliveryDaysValue}
                    setItems={setdeliveryTimeItems}
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
                    {lang[lang.lang].edit_profile_3}
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
                      textAlign: lang.lang == "ar" ? "right" : "left",
                    }}
                    multiple={false}
                    searchable={true}
                    open={deliveryTimeOpen}
                    value={deliveryTimeValue}
                    items={deliveryTimeItems}
                    setOpen={setdeliveryTimeOpen}
                    setValue={setdeliveryTimeValue}
                    setItems={setdeliveryTimeItems}
                  />
                </View>

                <View
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "3%",
                    zIndex: 850,
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
                    {lang[lang.lang].edit_profile_4}
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
                      textAlign: lang.lang == "ar" ? "right" : "left",
                    }}
                    multiple={false}
                    searchable={true}
                    open={governOpen}
                    value={governValue}
                    items={governItems}
                    setOpen={setgovernOpen}
                    setValue={setgovernValue}
                    setItems={setgovernItems}
                  />
                </View>

                <View
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "3%",
                    zIndex: 800,
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
                    {lang[lang.lang].edit_profile_5}
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
                      textAlign: lang.lang == "ar" ? "right" : "left",
                    }}
                    multiple={false}
                    searchable={true}
                    open={areaOpen}
                    value={areaValue}
                    items={areaItems}
                    setOpen={setareaOpen}
                    setValue={setareaValue}
                    setItems={setareaItems}
                  />
                </View>
                <View style={{ height: "2%" }} />

                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 40,
                    borderRadius: 15,
                    backgroundColor: config.color_3,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderColor: "black",
                    borderWidth: 2,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    if (
                      areaValue != 0 &&
                      governValue != 0 &&
                      deliveryTimeValue != 0 &&
                      deliveryDaysValue.length > 0
                    ) {
                      setStatus(2);
                    } else {
                      Alert.alert(lang[lang.lang].complete_residence_alert_15);
                    }
                  }}
                >
                  <Text
                    style={{
                      // fontFamily: "Handlee_400Regular",
                      color: "black",
                    }}
                  >
                    {lang[lang.lang].edit_profile_7}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <KeyboardAwareScrollView
                style={{ width: "100%", alignSelf: "center" }}
                enableAutomaticScroll={false}
              >
                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    alignSelf: "center",
                  }}
                >
                  {lang[lang.lang].edit_profile_8}
                </Text>
                <View style={styles.field}>
                  <TextInput
                    style={{ margin: 20, height: 100 }}
                    autoCorrect={false}
                    placeholder={lang[lang.lang].edit_profile_8}
                    onChangeText={setAddressName}
                    textAlign={lang.lang == "ar" ? "right" : "left"}
                  ></TextInput>
                </View>
                <View style={{ height: "2%" }} />

                <Text
                  style={{
                    // fontFamily: "Handlee_400Regular",
                    color: "black",
                    alignSelf: "center",
                  }}
                >
                  {lang[lang.lang].complete_residence_6}
                </Text>
                <View style={styles.field}>
                  <TextInput
                    style={{ margin: 20, height: 100 }}
                    autoCorrect={false}
                    placeholder={lang[lang.lang].complete_residence_6}
                    onChangeText={onChangenotes}
                    textAlign={lang.lang == "ar" ? "right" : "left"}
                  ></TextInput>
                </View>
                <View style={{ height: "2%" }} />

                <View
                  style={{
                    flexDirection: "row",
                    height: "80%",
                    justifyContent: "center",
                  }}
                >
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
                        style={{ margin: 20, height: 100 }}
                        autoCorrect={false}
                        placeholder={lang[lang.lang].complete_residence_7}
                        onChangeText={onChangeBlock}
                        textAlign={lang.lang == "ar" ? "right" : "left"}
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
                        style={{ margin: 20, height: 100 }}
                        autoCorrect={false}
                        placeholder={lang[lang.lang].complete_residence_8}
                        onChangeText={onChangebuilding}
                        textAlign={lang.lang == "ar" ? "right" : "left"}
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
                        style={{ margin: 20, height: 100 }}
                        autoCorrect={false}
                        placeholder={lang[lang.lang].complete_residence_9}
                        onChangeText={onChangejadda}
                        textAlign={lang.lang == "ar" ? "right" : "left"}
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
                        style={{ margin: 20, height: 100 }}
                        autoCorrect={false}
                        placeholder={lang[lang.lang].complete_residence_10}
                        onChangeText={onChangeStreet}
                        textAlign={lang.lang == "ar" ? "right" : "left"}
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
                        style={{ margin: 20, height: 100 }}
                        autoCorrect={false}
                        placeholder={lang[lang.lang].complete_residence_11}
                        onChangeText={onChangeflat}
                        textAlign={lang.lang == "ar" ? "right" : "left"}
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
                        style={{ margin: 20, height: 100 }}
                        autoCorrect={false}
                        placeholder={lang[lang.lang].complete_residence_12}
                        onChangeText={onChangeFloor}
                        textAlign={lang.lang == "ar" ? "right" : "left"}
                      ></TextInput>
                    </View>
                  </View>
                </View>

                <View style={{ height: "2%" }} />
              </KeyboardAwareScrollView>
            )}
          </View>
        ) : isEdit ? (
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
                getAddresses();
                setIsEdit(false);
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
                {lang[lang.lang].edit_profile_26}
                {lang[lang.lang].edit_profile_27}
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
                {lang[lang.lang].edit_profile_2}
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
                  textAlign: lang.lang == "ar" ? "right" : "left",
                }}
                multiple={true}
                searchable={true}
                open={deliveryDaysOpen}
                value={deliveryDaysValue}
                items={deliveryDaysItems}
                setOpen={setdeliveryDaysOpen}
                setValue={setdeliveryDaysValue}
                setItems={setdeliveryTimeItems}
              />
            </View>
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginTop: "15%",
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
                {lang[lang.lang].edit_profile_3}
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
                  textAlign: lang.lang == "ar" ? "right" : "left",
                }}
                multiple={false}
                searchable={true}
                open={deliveryTimeOpen}
                value={deliveryTimeValue}
                items={deliveryTimeItems}
                setOpen={setdeliveryTimeOpen}
                setValue={setdeliveryTimeValue}
                setItems={setdeliveryTimeItems}
              />
            </View>

            <View style={{ height: "10%" }} />

            <Text
              style={{
                // fontFamily: "Handlee_400Regular",
                color: "black",
                alignSelf: "center",
              }}
            >
              {lang[lang.lang].complete_residence_6}
            </Text>
            <View
              style={{
                width: "80%",
                height: "8%",
                backgroundColor: config.color_2,
                borderRadius: 10,
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "black",
                alignSelf: "center",
              }}
            >
              <TextInput
                style={{ margin: 20, height: 100 }}
                autoCorrect={false}
                placeholder={lang[lang.lang].complete_residence_6}
                value={notes}
                onChangeText={onChangenotes}
                textAlign={lang.lang == "ar" ? "right" : "left"}
              ></TextInput>
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
              {lang[lang.lang].edit_profile_10}
            </Text>
            <View style={{ height: "2%" }} />
            <View style={{ height: "90%", width: "100%" }}>
              <ScrollView
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {addresses.map((address) => (
                  <View
                    key={address.did}
                    style={{
                      width: "95%",
                      height: windowHeight * 0.4,
                      backgroundColor: config.color_3,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                      marginTop: "5%",
                      borderWidth: 2,
                      borderColor: "black",
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
                            marginTop: 5,
                            // fontFamily: "Handlee_400Regular",
                            color: "black",
                            fontSize: 24,
                          }}
                        >
                          {address.addressName}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              // fontFamily: "Handlee_400Regular",
                              color: "black",
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            {lang[lang.lang].edit_profile_11}
                            {daysString(address.deliveryDays)}
                            {lang[lang.lang].edit_profile_12}
                            {lang[lang.lang].edit_profile_13}
                            {address.fromTime}
                            {lang[lang.lang].edit_profile_14}
                            {address.toTime}
                            {"\n"}
                          </Text>

                          <View style={{ marginLeft: 10 }}>
                            <Text
                              style={{
                                // fontFamily: "Handlee_400Regular",
                                color: "black",
                                fontSize: 12,
                                marginTop: 5,
                                textAlign: "center",
                              }}
                            >
                              {lang[lang.lang].edit_profile_15 +
                                address.area +
                                "\n   "}
                              {lang[lang.lang].edit_profile_17 + address.block}
                            </Text>
                            <Text
                              style={{
                                // fontFamily: "Handlee_400Regular",
                                color: "black",
                                fontSize: 12,

                                flexShrink: 1,
                                width: 100,
                                textAlign: "center",
                              }}
                            >
                              {lang[lang.lang].edit_profile_18 +
                                address.building +
                                "\n  "}
                              {lang[lang.lang].edit_profile_22 +
                                address.floor +
                                "\n   "}
                              {lang[lang.lang].edit_profile_21 + address.flat}
                              {"\n"}
                              {lang[lang.lang].edit_profile_20 +
                                address.street +
                                "\n   "}
                              {lang[lang.lang].edit_profile_19 +
                                address.jadda +
                                "\n\n   "}
                              {lang[lang.lang].edit_profile_16 + address.notes}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ width: "10%" }} />

                      <View style={{ flexDirection: "column" }}>
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View style={{ height: "10%" }} />
                          <Ionicons
                            name="trash-bin"
                            size={24}
                            color="red"
                            onPress={() => {
                              Alert.alert(
                                lang[lang.lang].edit_profile_alert_33,
                                lang[lang.lang].edit_profile_alert_34 +
                                address.addressName,
                                [
                                  {
                                    text: lang[lang.lang].edit_profile_alert_35,
                                    onPress: () =>
                                      console.log("Cancel Pressed"),
                                  },
                                  {
                                    text: lang[lang.lang].edit_profile_alert_36,
                                    onPress: () => deleteAddress(address),
                                  },
                                ]
                              );
                            }}
                          />
                          <Text
                            style={{
                              // fontFamily: "Handlee_400Regular",
                              color: "black",
                              fontSize: 16,
                            }}
                          >
                            {lang[lang.lang].edit_profile_23}
                          </Text>
                        </View>

                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View style={{ height: "10%" }} />
                          <Ionicons
                            name="pencil"
                            size={24}
                            color="black"
                            onPress={() => {
                              setEditAdressValues(address);
                              setIsEdit(true);
                            }}
                          />
                          <Text
                            style={{
                              // fontFamily: "Handlee_400Regular",
                              color: "black",
                              fontSize: 16,
                            }}
                          >
                            {lang[lang.lang].edit_profile_24}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{ height: "2%" }}></View>
          </View>
        )}
        <View style={{ height: "2%" }}></View>
        {isAdd && status == 2 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (
                areaValue != 0 &&
                block != "" &&
                building != "" &&
                street != "" &&
                deliveryTimeValue != 0 &&
                deliveryDaysValue.length > 0
              ) {
                addAddress();
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
        ) : isEdit ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (
                // areaValue != 0 &&
                // block != "" &&
                // building != "" &&
                // jadda != "" &&
                // street != "" &&
                deliveryTimeValue != 0 &&
                deliveryDaysValue.length > 0
              ) {
                console.log("EDIT ADDRESS PRESSED");
                editAdress();
              } else {
                Alert.alert(lang[lang.lang].complete_residence_alert_15);
              }
            }}
          >
            <Text style={{
              // fontFamily: "Handlee_400Regular",
              color: "black",
              }}>
              {lang[lang.lang].edit_profile_25}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row-reverse" }}>
            <View style={{ width: "5%" }}></View>
            <TouchableOpacity
              style={{
                borderRadius: 1000,
                backgroundColor: config.color_2,
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

export default EditProfile;

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
    marginTop: 20,
    borderRadius: 15,
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
    width: "90%",
    height: "8%",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
    alignSelf: "center",
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
