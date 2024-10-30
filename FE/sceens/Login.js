import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ navigation }) {
  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    const data = { username: userName, password: pass };

    if (userName == "admin" && pass == "adminpassword") {
      navigation.navigate("DashBoardAdmin");
    } else {
      axios
        .post("http://localhost:3000/login", data)
        .then((respone) => {
          if (respone.status == 200) {
            toast.success("Đăng Nhập Thành Công");
            navigation.navigate("DashBoardUser", {
              user: respone.data.user[0],
            });
            // Chưa xử lý thông báo thêm
          } else if (respone.statusText == "Not Found") {
            toast.error("Tài Khoản Và Mật Khẩu Không Hợp Lệ");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: 700,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.layoutFormLogin}>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>Login</Text>
        <View>
          <Text>UserName</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setUserName}
          ></TextInput>
        </View>

        <View>
          <Text>Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={setPass}
          ></TextInput>
        </View>

        <Pressable style={styles.btnLogin} onPress={handleLogin}>
          <Text style={{ color: "white" }}>Login</Text>
        </Pressable>
      </View>
      <ToastContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  layoutFormLogin: {
    width: 300,
    height: 300,
    backgroundColor: "aqua",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: 20,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",
  },
  lable: {},
  btnLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 30,
    backgroundColor: "black",
    borderRadius: 20,
  },
});
