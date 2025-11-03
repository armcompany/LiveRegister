import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Ionicons name="settings" size={30} color={"#4c4949ff"} />
        <Text style={styles.title}>Live Register</Text>
      </View>
      <DrawerItemList
        {...props}
        itemStyle={styles.item}
        labelStyle={styles.label}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4c4949ff",
  },
  item: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    paddingVertical: 12,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});
