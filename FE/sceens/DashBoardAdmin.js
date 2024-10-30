import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { Table, Row } from "react-native-table-component";

export default function DashBoardAdmin() {
  // Tiêu đề của bảng
  const tableHead = ["Name", "Password", "Avatar", "Actions"];

  // Dữ liệu mẫu cho bảng
  const tableData = [
    { name: "user1", pass: "pass1", avatar: "https://via.placeholder.com/30" },
    { name: "user2", pass: "pass2", avatar: "https://via.placeholder.com/30" },
    { name: "user3", pass: "pass3", avatar: "https://via.placeholder.com/30" },
    { name: "user4", pass: "pass4", avatar: "https://via.placeholder.com/30" },
    { name: "user5", pass: "pass5", avatar: "https://via.placeholder.com/30" },
    { name: "user6", pass: "pass6", avatar: "https://via.placeholder.com/30" },
    { name: "user7", pass: "pass7", avatar: "https://via.placeholder.com/30" },
  ];

  // Hàm xử lý khi nhấn nút "Sửa"
  const handleEdit = (name) => {
    alert(`Edit user: ${name}`);
  };

  // Hàm xử lý khi nhấn nút "Xóa"
  const handleDelete = (name) => {
    alert(`Deleted user: ${name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 25 }}>Danh Sách User</Text>
      <ScrollView horizontal={true}>
        <ScrollView style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />

            {/* Hiển thị dữ liệu */}
            {tableData.map((rowData, index) => (
              <Row
                key={index}
                data={[
                  rowData.name,
                  rowData.pass,
                  <Image
                    source={{ uri: rowData.avatar }}
                    style={styles.avatar}
                  />,
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => handleEdit(rowData.name)}
                      style={styles.buttonUpdate}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDelete(rowData.name)}
                      style={styles.buttonDelte}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </Pressable>
                  </View>,
                ]}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>

      <Pressable style={styles.btnAddUser}>
        <Text style={{ color: "white" }}>Add New User</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  head: {
    width: 350, // Giới hạn chiều rộng của header là 300px
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  text: {
    margin: 6,
    textAlign: "center",
  },
  avatar: {
    width: 70,
    height: 70,
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonUpdate: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 5,
  },
  buttonDelte: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  tableContainer: {
    width: 350, // Giới hạn chiều rộng của bảng là 300px
  },
  btnAddUser: {
    width: 100,
    height: 30,
    backgroundColor: "blue",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
