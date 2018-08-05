import React, { Component } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import superagent from 'superagent';

import { List } from './components/List';

export class App extends Component {
  state = {
    latitude: null,
    longitude: null,
    error: null,
    request: false,
    landmarks: {},
    pageId: '',
    titles: [],
    info: ''
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
        distanceFilter: 10
      }
    );
  }

  componentDidUpdate(_, prevState) {
    if (prevState.request !== this.state.request) {
      superagent
        .get(
          `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${
            this.state.latitude
          }|${this.state.longitude}&format=json`
        )

        .end((error, response) => {
          if (error) {
            console.error(error);
          } else {
            this.setState({ landmarks: JSON.parse(response.text) });
            const landmarks = { ...this.state.landmarks.query };
            const titles = landmarks.geosearch;
            this.setState({ titles });
          }
        });
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    console.log(this.state.pageId);
    if (this.state.request) {
      return (
        <View
          style={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {this.state.titles.map(function(t) {
            console.log(t.title, '<<<<<<<<<<<<<<<<<<');
            return (
              <View
                style={{
                  flexGrow: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                key={t.pageid}
              >
                <Button
                  icon={<Icon name="arrow-right" size={15} color="white" />}
                  title={t.title}
                  onPress={() => {
                    superagent
                      .get(
                        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${
                          t.pageid
                        }`
                      )

                      .end((error, response) => {
                        if (error) {
                          console.error(error);
                        } else {
                          console.log(
                            '*****************************************************',
                            response.text
                          );
                        }
                      });
                  }}
                />
                <Text>distance:{t.dist}m</Text>
              </View>
            );
          })}
        </View>
      );
    } else
      return (
        <View
          style={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
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

  handleButton = (id, event) => {
    superagent
      .get(
        `

`
      )

      .end((error, response) => {
        if (error) {
          console.error(error);
        } else {
          console.log(response);
        }
      });
  };
}

export default App;
