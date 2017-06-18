import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import GridView from 'react-native-grid-view';

const DOMParser = require('xmldom').DOMParser;
const VideoPlayer = require('react-native-native-video-player');

class Thumbnail extends Component {
  playVideo(videoName){
    var url = 'https://s3-eu-west-1.amazonaws.com/stridecameraproject/panpan/' + videoName;
    console.log('playing video: ', url);
    VideoPlayer.showVideoPlayer(url);
  }

  render() {
    return (
      <View style={styles.thumbnailContainer} >
        <TouchableOpacity
          onPress={() => this.playVideo(this.props.video.name)}
        >
          <Image style={styles.thumbnail}
            source={{uri: this.props.video.thumbnail}}
          />
          <View>
            <Text style={styles.videoName} numberOfLines={3}>{this.props.video.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class VideoListView extends Component {
  static navigationOptions = {
    title: 'Your Videos',
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loaded: false,
    };
  }

  fetchData() {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml'
      }
    };

    return fetch('https://s3-eu-west-1.amazonaws.com/stridecameraproject', params);
  }

  componentDidMount() {
    this.fetchData().then(response => response.text())
    .then((strRes) => {
      console.log('jsonRes', strRes);

      var xmlRes = new DOMParser().parseFromString(strRes, 'text/xml');
      var filteredResObj = [];
      var allThumbnailsKey = [];
      var allVideosKey = [];
      var keys = xmlRes.getElementsByTagName('Key');
      
      for (var v = 0; v < keys.length; v++) {
        var keyText = keys[v].textContent;
        if (keyText.substring(keyText.length - 4 , keyText.length) === '.jpg') {
          allThumbnailsKey.push(keyText)
        } else {
          allVideosKey.push(keyText);
        }
      }

      for (i=0; i<allThumbnailsKey.length; i++) {
        for (j=0; j<allVideosKey.length; j++) {
          if (allVideosKey[j].substring(7, 22) === allThumbnailsKey[i].substring(7,22)) {
            var baseName = allVideosKey[j].substring(7, 22);
            filteredResObj.unshift({
              thumbnail: 'https://s3-eu-west-1.amazonaws.com/stridecameraproject/panpan/' + baseName + '.jpg',
              name: allVideosKey[j].substring(7, allVideosKey[j].length),
              key: j.toString(),
            });
          }
        }
      }

      console.log('filteredResObj', filteredResObj)
      this.setState({
        dataSource: filteredResObj,
        loaded: true,
      });
    })
    .catch((err) => {
      console.warn('listVideos fails with error: ', err);
    });
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <GridView
        items={this.state.dataSource}
        itemsPerRow={3}
        renderItem={this.renderItem}
        style={styles.videoListView}
      />
      )
  }

  renderLoadingView() {
    return (
      <View>
        <Text style={styles.instructions}>
          Fetching videos information...
        </Text>
      </View>
    );
  }

  renderItem(item) {
    return <Thumbnail video={item} key={'TN' + item.key}/>
  }
}

const styles = StyleSheet.create({
  thumbnailContainer: {
    height: 150,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    margin: 20,
  },
  thumbnail: {
    width: 83,
    height: 126,
  },
  videoListView: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#4d4d4d',
  },
  videoName: {
    color: 'white',
    fontSize: 10,
    marginBottom: 8,
    width: 90,
    textAlign: 'center',
  },
});
