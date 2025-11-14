import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from "axios"
import React, { useEffect } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { Row, Rows, Table } from "react-native-table-component"
import { Icon, Text } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { Packages } from "../../app/types"
import { config } from "../../config"
import { lang } from "../../lang"
import { getGuestPackagesApi } from "../../app/services/meals"

export const BrowsePackages = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false)
  const [packages, setPackages] = React.useState<Packages[]>([])
  const [data, setData] = React.useState([[]])

  useEffect(() => {
    if (packages.length === 0) {
      getPackages()
    }
  }, [])

  const getPackages = () => {
    setLoading(true)
    getGuestPackagesApi()
      .then(res => {
        if (res.kind === "ok") {
          setPackages(res.data.topSubs)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  };
  console.log('packages---------------', packages[0]);
  
  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <AntDesign name="close" size={24} />
        </TouchableOpacity>
        <Text text={lang[lang.lang].welcome_browse_packages} preset="t1" />
      </View>
      <ActivityIndicator animating={loading} color={colors.yellow} />
      <FlatList
        data={packages}
        renderItem={({ item }) => {
          const subscriptions = item?.subscriptionMaxDays?.map((days, index) => ({
            days: days,
            price: item?.subscriptionMaxPrice[index]
          }));
          const result = subscriptions.map(item => [item.days, item.price]);
          return (
            <View>
              <TouchableOpacity style={[styles.cardStyle]}>
                <View style={styles.checkmarkWrapper}>
                  <Icon icon="checkMark" />
                </View>
                <View style={globalStyle.flexOne}>
                  <Text preset="t2">
                    {lang.lang === "ar" ? item.subscriptionNameAr : item.subscriptionName}
                  </Text>
                  {item.arabic_note && item.notes ? (
                    <View>
                      {/* <Text preset="t2">{lang.lang === "ar" ? "ملاحظات: " : "Notes: "}</Text> */}
                      <Text preset="t2" color="black">
                        {lang.lang === "ar" ? item.arabic_note : item.notes}
                        {"\n"}
                      </Text>
                    </View>
                  ) : (
                    <View></View>
                  )}

                  <Table borderStyle={{ borderWidth: 1, borderColor: config.color_3 }}>
                    <Row
                      data={[lang[lang.lang].numberOfDays, lang[lang.lang].priceK]}
                      style={styles.head}
                      textStyle={{ color: colors.black, marginStart: 4 }}
                    />
                    <Rows data={result} textStyle={{ color: colors.black, marginStart: 4 }} />
                  </Table>
                </View>
              </TouchableOpacity>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: spacing.large,
  },
  head: { height: 40, backgroundColor: colors.lightYellow },
  text: { margin: 6 },

  backIcon: {
    position: "absolute",
    left: 0,
  },
  headerStyle: {
    alignItems: "center",
    margin: spacing.medium,
    justifyContent: "center",
  },
  cardStyle: {
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.medium,
    marginHorizontal: spacing.medium,
    marginVertical: spacing.extraSmall,
    borderColor: colors.grey,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  checkmarkWrapper: { flex: 0.1, marginTop: spacing.tiny },
})
