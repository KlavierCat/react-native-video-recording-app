import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

export default class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <Image source={require('../assets/stride-bg.jpeg')} resizeMode='cover' style={styles.backdrop} />
        </View>
        <View style={styles.overlay}>
          <Image source={require('../assets/stride.png')} style={styles.logoPic} />
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigate('Camera')}
            >
              <Text style={styles.buttonText}>Record a video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigate('VideoList')}
            >
              <Text style={styles.buttonText}>View videos</Text>
            </TouchableOpacity>
          <TextInput
            style={styles.inputbox}
            placeholder='Type some text to overlay the video...'
            placeholderTextColor='#d9d9d9'
            onChangeText={(text) => this.setState({text})} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backdrop: {
    flex: 1,
    flexDirection: 'column'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(25, 25, 25, 0.8)',
    margin: 10,
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    padding: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  logoPic: {
    width: 250,
    height: 125,
    marginTop: 50,
    marginBottom: 50,
  },
  inputbox: {
    textAlign: 'center',
    margin: 20,
    marginTop: 50,
    width: 300,
    color: '#f2f2f2',
    fontSize: 16,
  },
});