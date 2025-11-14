import AntDesign from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

import { Text } from "../../app/components"
import { getMealsApi } from "../../app/services/meals"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"

const dimensions = Dimensions.get("window")

export const BrowseMenu = ({ navigation }) => {
  const [activeMealType, setActiveMealType] = React.useState(0)
  const [menuList, setMenuList] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (menuList.length === 0) {
      getMeals()
    }
  }, [])

  const getMeals = () => {
    setLoading(true)
    getMealsApi()
      .then(res => {
        if (res.kind === "ok") {
          setMenuList(res.data.topMeals)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const renderMealTypeItem = ({ item, index }) => {
    const activeBackground = activeMealType === index ? colors.yellow : colors.white
    const activeTextColor = activeMealType === index ? colors.white : colors.text
    const borderColor = activeMealType === index ? colors.yellow : colors.grey
    return (
      <TouchableOpacity
        style={[
          styles.mealTypeItemStyle,
          {
            borderColor,
            backgroundColor: activeBackground,
          },
        ]}
        onPress={() => {
          setActiveMealType(index)
        }}>
        <Text
          text={item.mealType}
          preset="button01"
          style={styles.mealTypeStyle}
          color={activeTextColor}
        />
      </TouchableOpacity>
    )
  }

  const renderMealCard = ({ item, index }) => {
    const isLastItem =
      menuList[activeMealType].items?.length % 2 === 1 &&
      index === menuList[activeMealType].items?.length - 1
    return (
      <View style={[styles.mealCard, isLastItem ? styles.lastItemCard : {}]}>
        <Image
          source={{ uri: item.mealImage }}
          defaultSource={require("../../assets/icon.png")}
          style={styles.mealImageStyle}
        />
        <View style={styles.mealInfo}>
          <Text text={lang.lang === "ar" ? item.itemNameAr : item.itemNameEn} preset="t3" numberOfLines={2} style={styles.mealNameText} />
          <View style={styles.macrosContainerStyle}>
            <View>
              <Text text={lang[lang.lang].protine} preset="t3" color={colors.text} />
              <Text text={`${item.proteins ?? 0}`} preset="t3" />
            </View>
            <View>
              <Text text={lang[lang.lang].callorie} preset="t3" color={colors.text} />
              <Text text={`${item.calories ?? 0}`} preset="t3" />
            </View>
            <View>
              <Text text={lang[lang.lang].carb} preset="t3" color={colors.text} />
              <Text text={`${item.carbs ?? 0}`} preset="t3" />
            </View>
            <View>
              <Text text={lang[lang.lang].fat} preset="t3" color={colors.text} />
              <Text text={`${item.fats ?? 0}`} preset="t3" />
            </View>
          </View>
        </View>
      </View>
    )
  }

  console.log('menuList--------------', menuList[activeMealType]?.items?.length);
  
  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <AntDesign name="close" size={24} />
        </TouchableOpacity>
        <Text text={lang[lang.lang].browse_heading} preset="t1" />
      </View>
      <ActivityIndicator animating={loading} color={colors.yellow} />
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={menuList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={item => renderMealTypeItem(item)}
          contentContainerStyle={styles.mealTypeContentContainerStyle}
        />
      </View>
      <View style={styles.mealListWrapperStyle}>
        <FlatList
          extraData={menuList}
          numColumns={2}
          keyExtractor={(_, index) => index.toString()}
          data={menuList.length > 0 ? menuList[activeMealType].items : []}
          renderItem={({ item, index }) => renderMealCard({ item, index })}
          contentContainerStyle={styles.mealListContentContainerStyle}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
   marginTop: 44,
  },
  backIcon: {
    position: "absolute",
    left: 0,
  },
  headerStyle: {
    alignItems: "center",
    margin: spacing.medium,
    justifyContent: "center",
  },
  mealTypeStyle: {
    textTransform: "capitalize",
  },
  mealTypeItemStyle: {
    marginHorizontal: spacing.extraSmall,
    borderRadius: 10,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny,

    borderWidth: 1,
  },
  mealTypeContentContainerStyle: {
    paddingHorizontal: spacing.extraSmall,
    marginEnd: spacing.medium,
  },
  mealCard: {
    borderWidth: 1,
    borderColor: colors.grey,
    flex: 1,
    marginEnd: spacing.extraSmall,
    borderRadius: 8,
    marginVertical: spacing.extraSmall,
  },
  mealImageStyle: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  mealNameText: {
    textTransform: "capitalize",
  },
  macrosContainerStyle: {
    marginTop: spacing.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealListWrapperStyle: { flex: 1, marginTop: spacing.extraSmall },
  mealInfo: {
    padding: spacing.extraSmall,
  },
  mealListContentContainerStyle: {
    padding: spacing.extraSmall,
    paddingBottom: spacing.huge,
  },
  lastItemCard: {
    flex: 0,
    flexShrink: 1,
    width: (dimensions.width - 30) / 2,
  },
})
