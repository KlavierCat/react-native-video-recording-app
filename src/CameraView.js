import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';
import Camera from 'react-native-camera';
import { RNS3 } from '../aws3/RNS3';
import RNThumbnail from 'react-native-thumbnail';
import RNAssetThumbnail from 'react-native-asset-thumbnail';
import ImageResizer from 'react-native-image-resizer';

const { dateToString } = require('../aws3/DateUtils');

export default class CameraView extends Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      isRecording: false
    };
  }

  static navigationOptions = {
    title: 'Video Recording',
  };

  upload = (data) => {
    const now = new Date();
    const fileExtension = (Platform.OS === 'ios') ? 'mov' : 'mp4';
    const fileName = dateToString(now, 'yyyymmdd') + 'T' + now.toLocaleTimeString().split(':').join('');
    const fileType = (Platform.OS === 'ios') ? 'video/quicktime' : 'video/mp4';
    const file = {
      uri: data.path,
      name: fileName + '.' + fileExtension,
      type: fileType,
    };

    const options = {
      keyPrefix: 'panpan/',
      awsUrl: 's3-eu-west-1.amazonaws.com',
      bucket: 'stridecameraproject',
      region: 'eu-west-1',
      accessKey: 'AKIAJ3JLVSYHKDYRDC4A',
      secretKey: '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',
      successActionStatus: 201
    };

    RNS3.putWithFetch(file, options).then(response => {
      if (response.status !== 201)
        throw new Error('Failed to upload video to S3');
        console.log(response.body);
    }).catch(err => console.error(err));

    if (Platform.OS === 'ios') {      
      RNAssetThumbnail.generateThumbnail(data.path, data.width/20, data.height/20).then((result) => {
        console.log('ios thumbnail: ', result);
        this.putThumbnail(result, fileName, options);
      }).catch((err) => console.error('failed to generate thumbnail for iOS, with error: ', err));
    }

    if (Platform.OS === 'android') {
      RNThumbnail.get(data.path).then((result) => {
        console.log('thumbnail path for android', result.path);
        ImageResizer.createResizedImage(result.path, 250, 250, 'JPEG', 100).then((resizedImageUri) => {
          this.putThumbnail(resizedImageUri, fileName, options);
        }).catch((err) => console.error('failed to resize and upload thumbnail on Android, with error: ', err));
      })
    }
  };

  putThumbnail = (thumbnailPath, fileName, options) => {
    const thumbnail = {
      uri: thumbnailPath,
      name: fileName + '.jpg',
      type: 'image/jpeg'
    };

    RNS3.put(thumbnail, options).then(response => {
      if (response.status !== 201)
        throw new Error('Failed to upload thumbnail to S3');
        console.log(response.body);
    }).catch(err => console.error(err));
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then((data) => console.log(data))
        .catch(err => console.error(err));
    }
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({mode: Camera.constants.CaptureMode.video, totalSeconds: 30, audio: true})
          .then((data) => {console.log(data); this.upload(data)})
          .catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isRecording: false
      });
    }
  }

  render () {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          captureMode={Camera.constants.CaptureMode.video}
          aspect={Camera.constants.Aspect.fill}>
        </Camera>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          {
              !this.state.isRecording
              &&
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.startRecording}
              >
                <Image
                    source={require('../assets/ic_videocam_36pt.png')}
                />
              </TouchableOpacity>
              ||
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.stopRecording}
              >
                <Image
                    source={require('../assets/ic_stop_36pt.png')}
                />
              </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
});