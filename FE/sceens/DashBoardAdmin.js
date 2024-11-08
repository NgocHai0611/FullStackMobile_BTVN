import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";

export default function DashBoardAdmin() {
  const [users, setUsers] = useState([]);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  // User data
  const [selectedUser, setSelectedUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const [resultChange, setResultChange] = useState(400);

  // Call API once when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3000/listUser")
      .then((response) => {
        // setUsers(response.data[0]); setDataApi cho MySQL
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [resultChange]);

  const openImagePicker = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setAvatar(imageUri);
      }
    });
  };

  const handleSave = () => {
    const newUser = {
      username: username,
      password: password,
      avatar:
        avatar ||
        "https://res.cloudinary.com/dkmwjkajj/image/upload/v1721703004/samples/tn5hdifprhwrjnevwsi9.jpg",
    };

    axios
      .post("http://localhost:3000/addUser", newUser)
      .then((respone) => {
        setResultChange(respone.status);
      })
      .catch((err) => {
        console.log(err);
      });

    resetModal();
  };

  const handleEdit = () => {
    if (selectedUser) {
      const updatedUser = {
        username: username,
        password: password,
        avatar: avatar || selectedUser.avatar, // Giữ nguyên avatar nếu không có mới
      };

      resetModal();

      // Gọi API để cập nhật người dùng
      axios
        .put(
          `http://localhost:3000/updateUser/${selectedUser._id}`,
          updatedUser
        ) // Sử dụng ID để cập nhật
        .then((respone) => {
          // Cập nhật danh sách người dùng sau khi cập nhật thành công
          setResultChange(respone.status);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const openEditModal = (user) => {
    setUsername(user.name);
    setPassword(user.pass);
    setAvatar(user.avatar);
    setSelectedUser(user);
    setModalType("edit");
    setModalVisible(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModalType("delete");
    setModalVisible(true);
  };

  const confirmDelete = () => {
    setUsers((prevData) =>
      prevData.filter((item) => item.name !== selectedUser.name)
    );
    resetModal();

    if (selectedUser) {
      // Gọi API để xóa người dùng

      axios
        .delete(`http://localhost:3000/deleteUser/${selectedUser._id}`) // Sử dụng ID để xóa
        .then((respone) => {
          setResultChange(respone.status);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const resetModal = () => {
    setUsername("");
    setPassword("");
    setSelectedUser(null);
    setAvatar("");
    setModalVisible(false);
  };

  const openAddUserModal = () => {
    resetModal();
    setModalType("add");
    setModalVisible(true);
  };

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.row} key={item.Id}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.pass}</Text>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.actions}>
        <Pressable
          onPress={() => openEditModal(item)}
          style={styles.buttonUpdate}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => openDeleteModal(item)}
          style={styles.buttonDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 25 }}>Danh Sách User</Text>

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.Id} // Hoặc sử dụng item.id nếu có
      />

      <Pressable style={styles.btnAddUser} onPress={openAddUserModal}>
        <Text style={{ color: "white" }}>Add New User</Text>
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {modalType === "delete" ? (
              <>
                <Text>Bạn có muốn xóa nhân viên này không?</Text>
                <View style={styles.modalActions}>
                  <Pressable onPress={resetModal} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={confirmDelete}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>
                </View>
              </>
            ) : modalType === "edit" ? (
              <>
                <Text style={styles.modalTitle}>Edit User</Text>

                {/* Avatar Preview and Picker */}
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={styles.previewAvatar}
                  />
                ) : null}
                <Pressable style={styles.imagePicker} onPress={openImagePicker}>
                  <Text>Pick an Avatar</Text>
                </Pressable>

                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />

                <Pressable onPress={handleEdit} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Update</Text>
                </Pressable>
              </>
            ) : modalType === "add" ? (
              <>
                <Text style={styles.modalTitle}>Add New User</Text>

                {/* Avatar Picker for new user */}
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={styles.previewAvatar}
                  />
                ) : null}
                <Pressable style={styles.imagePicker} onPress={openImagePicker}>
                  <Text>Pick an Avatar</Text>
                </Pressable>

                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />

                <Pressable onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Add User</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonUpdate: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 5,
  },
  buttonDelete: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  btnAddUser: {
    width: 100,
    height: 30,
    backgroundColor: "blue",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imagePicker: {
    backgroundColor: "#f1f8ff",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  previewAvatar: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
