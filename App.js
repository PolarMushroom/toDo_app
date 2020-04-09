import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import ToDo from './toDo'
import { AppLoading } from 'expo'
// import DeviceInfo from 'react-native-device-info';
import { v5 as uuidv5 } from 'uuid';


const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  }
  componentDidMount = () => {
    this._loadToDos();
  }

  _deleteToDo = (id) => {
    // console.log("testing")
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDo(newState.toDos);
      return { ...newState }
    });
  }
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;

    if (!loadedToDos) {
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput style={styles.input}
            placeholder="New To Do"
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor="#999"
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addTodo}
          />
          <ScrollView contentContainerStyle={styles.List}>
            {Object.values(toDos).reverse().map(
              toDo => <ToDo
                key={toDo.id}
                {...toDo}
                uncompleteToDo={this._uncompleteToDo}
                deleteToDo={this._deleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateText}
              />)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }
  _loadToDos = async () => {
    try {
      const toDoss = await AsyncStorage.getItem("ToDos");
      const parsedToDos = JSON.parse(toDoss)

      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {}
      });
    } catch (error) {
      console.log(error)
    }

  }
  _saveToDo = (newToDo) => {
    const saveToDos = AsyncStorage.setItem("ToDos", JSON.stringify(newToDo))
  }
  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      console.log(prevState);
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }

        }
      }
      this._saveToDo(newState.toDos);
      return { ...newState }
    });
  }
  _completeToDo = (id) => {
    this.setState(prevState => {
      console.log(prevState);
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }

        }
      }
      this._saveToDo(newState.toDos);
      return { ...newState }
    });
  }

  _updateText = (id, text) => {
    this.setState(prevState => {
      console.log(prevState);
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }

        }
      }
      this._saveToDo(newState.toDos);
      return { ...newState }
    });
  }

  _addTodo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {

      this.setState(prevState => {
        const ID = uuidv5(`${Date.now()}`, uuidv5.DNS);
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            created: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        // console.log(newState.toDos);
        this._saveToDo(newState.toDos);
        return { ...newState }
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      android: {
        elevation: 3

      },
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: {
          height: -1,
          width: 0
        }
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderWidth: 0,
    fontSize: 25,
    borderBottomWidth: 2

  },
  List: {
    alignItems: "center"
  }
});
