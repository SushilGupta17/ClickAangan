import React from 'react';

import {

View,
Text,
StyleSheet

} from 'react-native';

//import YoutubePlayer from 'react-native-youtube-iframe';

const VideoSection=({project})=>{

if(!project.videoId){

return null;

}

return(

<View style={styles.card}>

<Text style={styles.heading}>

Video Tour

</Text>

<YoutubePlayer

height={220}

videoId={project.videoId}

/>

</View>

)

}

export default VideoSection;

const styles=StyleSheet.create({

card:{
backgroundColor:'#fff',
margin:15,
padding:18,
borderRadius:15
},

heading:{
fontWeight:'700',
fontSize:20,
marginBottom:15
}

});