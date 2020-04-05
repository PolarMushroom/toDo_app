import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, Alert } from 'react-native'
import PropTypes from 'prop-types'
const { height, width } = Dimensions.get("window");


export default class toDo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            toDoValue: props.text
        }
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired,
        uncompleteToDo: PropTypes.func.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        completeToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    }

    _toggleComplete = () => {

        const { isCompleted, uncompleteToDo, completeToDo, id } = this.props
        if (isCompleted) {
            uncompleteToDo(id);
        } else {
            completeToDo(id);
        }
    }
    _startEditing = () => {

        const { text } = this.props
        this.setState({
            isEditing: true,
            toDoValue: text
        })
    }
    _finishEditing = () => {

        const { toDoValue } = this.state;
        const { id, updateToDo } = this.props
        updateToDo(id, toDoValue);
        this.setState({
            isEditing: false

        })
    }

    _controlInput = (text) => {
        this.setState({ toDoValue: text })
    }

    render() {
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;
        return <View style={styles.container}>
            <View style={styles.column}>
                <TouchableOpacity onPress={this._toggleComplete}>
                    <View style={[styles.raido, isCompleted ? styles.completedRadio : styles.unCompletedRaido]}></View>
                </TouchableOpacity>
                {isEditing ? (
                    <TextInput style={[styles.input, styles.text, isCompleted ? styles.completedText : styles.unCompletedText]} onChangeText={this._controlInput} value={toDoValue} returnKeyType="done" onBlur={this._finishEditing} multiline={true}></TextInput>
                ) : (
                        <Text style={[styles.text, isCompleted ? styles.completedText : styles.unCompletedText]}>{text}</Text>
                    )}
            </View>
            {isEditing ? (
                <View style={styles.actions}>
                    <TouchableOpacity onPressOut={this._finishEditing} >
                        <View style={styles.actionContainer}  >
                            <Text style={styles.actionText}>✅</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._startEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText} >✏️</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={() => { deleteToDo(id) }}>
                            <View style={styles.actionContainer}  >
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>

    }

}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    actionContainer: {

        marginVertical: 10,
        marginHorizontal: 8
    },
    actions: {

        flexDirection: "row",

    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        width: width / 2
    },
    raido: {
        width: 30,
        height: 30,
        borderRadius: 15,

        borderWidth: 3,
        marginRight: 20
    },
    completedRadio: {
        borderColor: "#bbb"
    },
    unCompletedRaido: {
        borderColor: "#F23657"
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    unCompletedText: {

    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20
    },
    input: {

        width: width / 2
    }
})