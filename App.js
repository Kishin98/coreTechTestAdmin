import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Button,
  Modal,
  Pressable,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as FileSystem from "expo-file-system";

//if the server is hosted on localhost, replace the IP address with localhost
//if you are building the app on a physical device, you need the explicit IP address
const API_URL = "http://SERVER_IP_ADDRESS:3000/";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

const Item = ({
  firstName,
  lastName,
  email,
  phone,
  age,
  education,
  jobClass,
  jobLocation,
  jobDetail,
  curriculum,
  download,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {expanded ? (
        <View style={styles.item}>
          <TouchableOpacity onPress={() => setExpanded(false)}>
            <>
              <Text style={styles.title}>Nome: {firstName}</Text>
              <Text style={styles.title}>Cognome: {lastName}</Text>
              <Text style={styles.title}>Età: {age}</Text>
              <Text style={styles.title}>Titolo di studio: {education}</Text>
              <Text style={styles.title}>Email: {email}</Text>
              <Text style={styles.title}>Telefono: {phone}</Text>
              <Text style={styles.title}>
                Candidatura: {jobClass} ({jobDetail})
              </Text>
              <Text style={styles.title}>Località: {jobLocation}</Text>
            </>
          </TouchableOpacity>
          <Button
            title={curriculum === "no file" ? "No curriculum" : "Scarica cv"}
            disabled={curriculum === "no file"}
            onPress={() => download(curriculum)}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={() => setExpanded(true)}>
          <View style={styles.item}>
            <Text style={styles.title}>Nome: {firstName}</Text>
            <Text style={styles.title}>Cognome: {lastName}</Text>
            <Text style={styles.title}>Età: {age}</Text>
            <Text style={styles.title}>Titolo di studio: {education}</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  //filters
  const [ageFileter, setAgeFilter] = useState("");
  const [educationFilter, setEducationFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [educationOpen, setEducationOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);
  const [jobLocationOpen, setJobLocationOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);

  const [downloadProgress, setDownloadProgress] = useState();

  useEffect(() => {
    setLoading(true);
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    try {
      let response = await fetch(API_URL, {
        method: "get",
      });
      let jsonResponse = await response.json();
      setCandidates(jsonResponse.message);
      setFilteredCandidates([...jsonResponse.message]);
      console.log(jsonResponse.message);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        firstName={item.firstName}
        lastName={item.lastName}
        email={item.email}
        phone={item.phone}
        age={item.age}
        education={item.education}
        jobClass={item.jobClass}
        jobLocation={item.jobLocation}
        jobDetail={item.jobDetail}
        curriculum={item.curriculum}
        download={downloadFile}
      />
    );
  };

  const onEducationOpen = (open) => {
    setJobOpen(false);
    setJobLocationOpen(false);
    setAgeOpen(false);
    setEducationOpen(open);
  };
  const onJobOpen = (open) => {
    setJobLocationOpen(false);
    setAgeOpen(false);
    setEducationOpen(false);
    setJobOpen(open);
  };
  const onJobLocationOpen = (open) => {
    setJobOpen(false);
    setAgeOpen(false);
    setEducationOpen(false);
    setJobLocationOpen(open);
  };
  const onAgeOpen = (open) => {
    setJobOpen(false);
    setJobLocationOpen(false);
    setEducationOpen(false);
    setAgeOpen(open);
  };

  const onEducationChange = (value) => {
    setEducationFilter(value);
  };
  const onJobChange = (value) => {
    setJobFilter(value);
  };
  const onJobLocationChange = (value) => {
    setLocationFilter(value);
  };
  const onAgeChange = (value) => {
    setAgeFilter(value);
  };

  const applyFilters = () => {
    var newCandidates = [...candidates];
    if (ageFileter === "1825") {
      newCandidates = newCandidates.filter(
        (candidate) => candidate.age >= 18 && candidate.age < 25
      );
    }
    if (ageFileter === "2535") {
      newCandidates = newCandidates.filter(
        (candidate) => candidate.age >= 25 && candidate.age < 35
      );
    }
    if (ageFileter === "3545") {
      newCandidates = newCandidates.filter(
        (candidate) => candidate.age >= 35 && candidate.age < 45
      );
    }
    if (ageFileter === "45") {
      newCandidates = newCandidates.filter((candidate) => candidate.age >= 45);
    }
    if (educationFilter === "Diploma") {
      newCandidates = newCandidates.filter(
        (candidate) => candidate.education === "Diploma"
      );
    }
    if (educationFilter === "Laurea") {
      newCandidates = newCandidates.filter(
        (candidate) => candidate.education === "Laurea"
      );
    }
    if (jobFilter === "Cuoco") {
      newCandidates = newCandidates.filter(
        (candidate) => candidate.jobClass === "Cuoco"
      );
    }
    if (jobFilter === "Cameriere") {
      newCandidates = newCandidates.filter(
        (candidate) => candidate.jobClass === "Cameriere"
      );
    }
    if (locationFilter === "Milano") {
      newCandidates = newCandidates.filter(
        (candidate) =>
          candidate.jobLocation === "Milano" ||
          candidate.jobLocation === "Qualsiasi"
      );
    }
    if (locationFilter === "Roma") {
      newCandidates = newCandidates.filter(
        (candidate) =>
          candidate.jobLocation === "Roma" ||
          candidate.jobLocation === "Qualsiasi"
      );
    }
    if (locationFilter === "Genova") {
      newCandidates = newCandidates.filter(
        (candidate) =>
          candidate.jobLocation === "Genova" ||
          candidate.jobLocation === "Qualsiasi"
      );
    }
    setFilteredCandidates(newCandidates);
  };

  const resetFilters = () => {
    setAgeFilter("");
    setEducationFilter("");
    setJobFilter("");
    setLocationFilter("");

    setEducationOpen(false);
    setJobOpen(false);
    setJobLocationOpen(false);
    setAgeOpen(false);
  };

  const downloadFile = async (file) => {
    const { uri } = await FileSystem.downloadAsync(
      `${API_URL}/download/${file}`,
      FileSystem.documentDirectory + file
    );
    console.log("dowloaded", uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={{ flex: 1 }}>
          <Button title="Filtri" onPress={() => setModalVisible(true)} />
          {filteredCandidates.length === 0 ? (
            <Text>
              Al momento non vi sono Candidati in base ai filtri selezionati
            </Text>
          ) : (
            <FlatList
              data={filteredCandidates}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={1}
            />
          )}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <SafeAreaView style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>Filtra per età</Text>
                <DropDownPicker
                  //listMode="SCROLLVIEW"
                  zIndex={10000}
                  zIndexInverse={6000}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  open={ageOpen}
                  value={ageFileter}
                  placeholder="Nessun filtro"
                  items={[
                    { label: "18-25 anni", value: "1825" },
                    { label: "25-35 anni", value: "2535" },
                    { label: "35-45 anni", value: "3545" },
                    { label: ">45 anni", value: "45" },
                    { label: "Nessun filtro", value: "" },
                  ]}
                  setOpen={onAgeOpen}
                  setValue={onAgeChange}
                />
                <Text>Filtra per titolo di studio</Text>
                <DropDownPicker
                  //listMode="SCROLLVIEW"
                  zIndex={9000}
                  zIndexInverse={7000}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  open={educationOpen}
                  value={educationFilter}
                  placeholder="Nessun filtro"
                  items={[
                    { label: "Diploma", value: "Diploma" },
                    { label: "Laurea", value: "Laurea" },
                    { label: "Nessun filtro", value: "" },
                  ]}
                  setOpen={onEducationOpen}
                  setValue={onEducationChange}
                />
                <Text>Filtra per posizione lavorativa</Text>
                <DropDownPicker
                  //listMode="SCROLLVIEW"
                  zIndex={8000}
                  zIndexInverse={6000}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  open={jobOpen}
                  value={jobFilter}
                  placeholder="Nessun filtro"
                  items={[
                    { label: "Cuoco", value: "Cuoco" },
                    { label: "Cameriere", value: "Cameriere" },
                    { label: "Nessun filtro", value: "" },
                  ]}
                  setOpen={onJobOpen}
                  setValue={onJobChange}
                />
                <Text>Filtra per sede lavorativa</Text>
                <DropDownPicker
                  //listMode="SCROLLVIEW"
                  zIndex={7000}
                  zIndexInverse={5000}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  open={jobLocationOpen}
                  value={locationFilter}
                  placeholder="Nessun filtro"
                  items={[
                    { label: "Milano", value: "Milano" },
                    { label: "Roma", value: "Roma" },
                    { label: "Genova", value: "Genova" },
                    { label: "Nessun filtro", value: "" },
                  ]}
                  setOpen={onJobLocationOpen}
                  setValue={onJobLocationChange}
                />
                <Pressable
                  style={[styles.button, styles.buttonApply]}
                  onPress={() => {
                    applyFilters();
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Applica filtri</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonReset]}
                  onPress={() => resetFilters()}
                >
                  <Text style={styles.textStyle}>Reset filtri</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: STATUSBAR_HEIGHT,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
  },

  /////////
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: -2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonApply: {
    backgroundColor: "#2196F3",
    marginVertical: 12,
  },
  buttonReset: {
    backgroundColor: "red",
    marginVertical: 12,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  dropdown: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
  },
  dropdownContainer: {
    width: 250,
    margin: 12,
    borderWidth: 1,
  },
});
