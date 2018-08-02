import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export class App extends Component {
  state = {
    latitude: null,
    lonitude: null,
    error: null,
    request: false,
    landmarks: {}
  };

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 5
      }
    );
  }

  componentDidUpdate(_, prevState) {
    if (prevState.request !== this.state.request) {
      fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${
          this.state.latitude
        }|${this.state.longitude}`
      )
        .then(landmarks => {
          console.log(landmarks);
          this.setState({ landmarks });
        })
        .catch(console.log);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    if (this.state.request === true) {
      return this.state.landmarks.query.geosearch.map(landmark => {
        <p>{landmark.title}</p>;
      });
    }
    return (
      <View
        style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        <Text>{'\n'}</Text>
        <Button
          icon={<Icon name="arrow-right" size={15} color="white" />}
          title="Search nearby Landmarks"
          onPress={() => {
            this.setState({ request: true });
          }}
        />
      </View>
    );
  }
}

export default App;
