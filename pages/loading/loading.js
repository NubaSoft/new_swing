import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import BouncingPreloader from "react-native-bouncing-preloaders";
const purp = require("../../assets/purp.png");
const lettice = require("../../assets/let.png");
const carrot = require("../../assets/carrot.png");
const brook = require("../../assets/brook.png");
export default function Loading({ isLoading }) {
  if (isLoading) {
    return (
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#33333388",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
      >
        <View style={{ height: "60%" }} />
        <BouncingPreloader
          icons={[lettice, purp]}
          speed={1400}
          size={100}
          leftDistance={-250}
          rightDistance={-310}
        />
        <BouncingPreloader
          icons={[carrot, brook]}
          speed={1400}
          size={100}
          leftDistance={-450}
          rightDistance={-500}
        />
      </View>
    );
  } else {
    return <View></View>;
  }
}
