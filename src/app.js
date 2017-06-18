/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeView from './HomeView';
import VideoListView from './VideoListView';
import CameraView from './CameraView';

const CameraProject = StackNavigator({
  Home: { screen: HomeView },
  Camera: { screen: CameraView },
  VideoList: { screen: VideoListView }
});

AppRegistry.registerComponent('CameraProject', () => CameraProject);
