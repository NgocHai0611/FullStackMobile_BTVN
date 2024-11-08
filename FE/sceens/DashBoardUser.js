import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DashBoard({ navigation, route }) {
  const { user } = route.params; // Lấy danh sách người dùng từ tham số route
  console.log(user[0]);
  const [data, setData] = useState([]);

  const [location, setLocation] = useState([
    { img: require("../assets/img/photo1.png") },
    { img: require("../assets/img/photo2.png") },
    { img: require("../assets/img/photo3.png") },
  ]);

  useEffect(() => {
    axios
      .get("https://671d40ae09103098807ca930.mockapi.io/category")
      .then((respone) => {
        setData(respone.data);
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerFind}>
          <Image
            source={require("../assets/img/logoicon.png")}
            style={styles.imgSizeHeader}
          ></Image>
          <View style={{ flexDirection: "row" }}>
            <TextInput style={styles.textInput}></TextInput>
            <Image
              source={require("../assets/img/findicon.png")}
              style={styles.imgSizeHeader}
            ></Image>
          </View>
        </View>

        <View style={styles.headerNotify}>
          <View
            style={{
              flexDirection: "row",
              width: 200,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: user[0].avatar }}
                style={[styles.imgSizeHeader, { borderRadius: "50%" }]}
              ></Image>

              <View>
                <Text style={{ color: "white" }}>Welcome</Text>
                <Text style={{ color: "white" }}>{user[0].name}</Text>
              </View>
            </View>

            <Image
              source={require("../assets/img/ringicon.png")}
              style={[styles.imgSizeHeader, { borderRadius: "50%" }]}
            ></Image>

            <Pressable
              style={{
                width: 60,
                height: 30,
                backgroundColor: "aqua",
                borderRadius: 30,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text>Log Out</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <View
          style={{
            width: "100%",
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Category</Text>
          <Image
            source={require("../assets/img/3gach.png")}
            style={{ width: 30, height: 30 }}
          ></Image>
        </View>

        <View style={styles.contentCategory}>
          <FlatList
            numColumns={4}
            data={data}
            renderItem={({ item }) => (
              <View style={{ marginLeft: 30 }}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.imgSizeCategory}
                ></Image>
                <Text>{item.name}</Text>
              </View>
            )}
            contentContainerStyle={{
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></FlatList>
        </View>

        <View style={styles.contentPopularDestination}>
          <View style={styles.headerDestination}>
            <Text style={{ fontWeight: "bold" }}>Popular Destination</Text>
            <Image
              source={require("../assets/img/3gach.png")}
              style={{ width: 30, height: 30 }}
            ></Image>
          </View>

          <View style={styles.contentLocation}>
            <FlatList
              horizontal={true}
              data={location}
              renderItem={({ item }) => (
                <View>
                  <Image
                    source={item.img}
                    style={styles.sizeImgLocation}
                  ></Image>
                </View>
              )}
              contentContainerStyle={styles.layoutLocation}
            ></FlatList>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.layoutFooter}>
          <View>
            <Image
              source={require("../assets/img/homeicon.png")}
              style={styles.imgFooter}
            ></Image>
            <Text>Home</Text>
          </View>

          <View>
            <Image
              source={require("../assets/img/exploreicon.png")}
              style={styles.imgFooter}
            ></Image>
            <Text>Explore</Text>
          </View>

          <View>
            <Image
              source={require("../assets/img/searchicon.png")}
              style={styles.imgFooter}
            ></Image>
            <Text>Sreach</Text>
          </View>

          <View>
            <Image
              source={{ uri: user[0].avatar }}
              style={styles.imgFooter}
            ></Image>
            <Text>Profile</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layoutFooter: {
    width: "80%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  imgFooter: {
    width: 50,
    height: 50,
  },

  container: { width: "100%", height: 500 },
  header: {
    flexDirection: "column",
    width: "100%",
    height: 150,
    backgroundColor: "#764993",
    alignItems: "center",
    justifyContent: "center",
  },
  headerFind: {
    width: 200,
    flexDirection: "row",

    justifyContent: "space-between",
  },

  headerNotify: {
    marginTop: 30,
  },

  textInput: {
    width: 100,
    height: 30,
    backgroundColor: "white",
  },

  imgSizeHeader: {
    width: 30,
    height: 30,
  },

  content: {
    width: "100%",
    height: 420,
    justifyContent: "space-between",
    flexDirection: "column",
  },

  contentCategory: {},

  contentPopularDestination: {},

  imgSizeCategory: {
    width: 50,
    height: 50,
  },

  headerDestination: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  contentLocation: {},

  sizeImgLocation: { width: 100, height: 150, borderRadius: 10 },
  layoutLocation: {
    width: "100%",
    justifyContent: "space-between",
  },

  footer: {
    marginTop: 15,
    width: "100%",
    height: 80,
    backgroundColor: "#5958b2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
