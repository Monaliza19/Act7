import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Picker,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row } from 'react-native-table-component';
import { TouchableOpacity } from 'react-native-gesture-handler';

const STUDENT_DATA_KEY = 'studentData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'green',
    color: 'purple',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  tableHead: { height: 40, backgroundColor: 'yellow' },
  tableText: { margin: 5, textAlign: 'center', color: '#333' },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
});

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const storeStudentData = async (studentData) => {
    try {
      const existingData = await AsyncStorage.getItem(STUDENT_DATA_KEY);
      const newData = existingData ? JSON.parse(existingData) : [];
      newData.push(studentData);
      await AsyncStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(newData));
      setData(newData);
      setModalVisible(false);
    } catch (error) {
      console.error('Error storing student data:', error);
    }
  };

  const getStudentData = async () => {
    try {
      const studentData = await AsyncStorage.getItem(STUDENT_DATA_KEY);
      setData(studentData ? JSON.parse(studentData) : []);
    } catch (error) {
      console.error('Error getting student data:', error);
    }
  };

  const handleAddStudent = () => {
    if (firstName && lastName && course && username && password) {
      const studentData = {
        firstName,
        lastName,
        course,
        username,
        password,
      };
      storeStudentData(studentData);
      setFirstName('');
      setLastName('');
      setCourse('');
      setUsername('');
      setPassword('');
    } else {
      Alert.alert('Please put data in all fields');
    }
  };

  const handleViewStudents = () => {
    getStudentData();
    setModalVisible(true);
  };

  const handleRowClick = (index) => {
    setSelectedStudent(data[index]);
    setDetailsModalVisible(true);
  };

  const renderStudentDetails = () => {
    if (selectedStudent) {
      return (
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>Student Details</Text>
          <Text>Name: {selectedStudent.firstName} {selectedStudent.lastName}</Text>
          <Text>Course: {selectedStudent.course}</Text>
          <Text>Username: {selectedStudent.username}</Text>
          <Text>Password: {selectedStudent.password}</Text>
          <Button
            title="Close"
            onPress={() => setDetailsModalVisible(false)}
            style={[styles.button, { marginTop: 20 }]}
          />
        </View>
      );
    }
    return null;
  };

  useEffect(() => {
    getStudentData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Student Form</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Picker
        style={styles.picker}
        selectedValue={course}
        onValueChange={(itemValue) => setCourse(itemValue)}>
        <Picker.Item label="Select Course" value="" />
        <Picker.Item label="BSIT" value="BSIT" />
        <Picker.Item label="BSCS" value="BSCS" />
        <Picker.Item label="BSIT-FPSM" value="BSIT-FPSM" />
        <Picker.Item label="BS CRIM" value="BS CRIM" />
        <Picker.Item label="BS ELEX" value="BS ELEX" />
        <Picker.Item label="BS ELEC" value="BS ELEEC" />
      </Picker>
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
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, { marginTop: 50 }]}
        onPress={handleAddStudent}>
        <Text style={styles.buttonText}>ADD STUDENT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={handleViewStudents}>
        <Text style={styles.buttonText}>VIEW STUDENT DETAILS</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row
              data={['No.', 'Full Name', 'Course', 'Username']}
              style={styles.tableHead}
              textStyle={styles.tableText}
            />
            {data.map((rowData, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRowClick(index)}>
                <Row
                  data={[
                    index + 1,
                    `${rowData.firstName} ${rowData.lastName}`,
                    rowData.course,
                    rowData.username,
                  ]}
                  textStyle={styles.tableText}
                />
              </TouchableOpacity>
            ))}
          </Table>
          <Button
            title="Close"
            onPress={() => setModalVisible(false)}
            style={[styles.button, { marginTop: 20 }]}
          />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}>
        {renderStudentDetails()}
      </Modal>
    </ScrollView>
  );
};

export default App;
