import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Dialog from "react-native-dialog";
import * as Speech from 'expo-speech';
import { MonoText } from '../components/StyledText';
import { Magnetometer } from 'expo-sensors';
import {gettable,edittable,getroute,setroute,getrequest,setrequest} from '../App.js';


//To Do, 
//Get rid of top bar
//Change Tab bar bottom height to be bigger
//Create Functionalaity for buttons
//search will be used to request a route
//Working on magentometter function-Sean
//get text to speech
export default class ModalScreen2 extends React.Component {
//lazy and have two listeners so I can always get data easily
  state = {
    MagnetometerData: {},
    first: false,
    route:false,
    text:'',
 
  };

static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    tabBarVisible: false,
};
  componentDidMount() {
console.log(this.state);

     
    Speech.speak('Press the middle of the screen then say your route name followed by comma followed by location followed by  saying tap enter ');
    Speech.speak('If you do not want to search just press the Bottom right corner');
  }

  componentWillUnmount() {
    
  }



_help=()=>
{
  
    Speech.speak('Press the middle corner then say your route name followed by comma followed by location followed by  saying tap enter ');
    Speech.speak('If you do not want to search just press the Bottom right corner');
}
_leave=() =>
{
  Speech.speak("If you have a route press the center button");
this.props.navigation.goBack();
}
_end= ()=>
{
Speech.speak('You have entered');
Speech.speak(this.state.text);

var table= gettable();
var obj={};
var obj2={};
var i=0;
var i2=0;
var checker=0;
var splitter= this.state.text.split(',');

  var location= splitter[1];
  var route=splitter[0];
while(i!=table.length)
{
  obj=table[i];
  if(obj["location"]==location)
  {
    i2=0;
    while(i2!=obj["routes"].length)
    {
       obj2=obj["routes"][i2];
       
       if(obj2["routename"]==route)
       {
        checker=1;
        setroute(obj2["route"]);
       }
       i2++;
    }
  }
  i++;
}
if(checker==1)
{

Speech.speak("This route has been found, it is now your current selected route, you can search for another or hit the bottom right corner");
}
else
{

Speech.speak("This route has not been found, it has been added to the request database if not already there,you can search for another or hit the bottom right corner");

var request=getrequest()
while(i<request.length)
{

if(this.state.text==request[i])
{
checker=1;
}
i++;
}
if(checker==1)
{
  ;
}
else
{
  request.push(this.state.text);
  setrequest(request);
}
}

}
  render() {
    return (
      <View style={{flex:1}}>
      <TextInput
    style={{borderColor: 'gray', borderWidth: 1, alignSelf: 'center', //for align to right
      top:'30%',
      height: '40%',
      width: '100%',
      }}
    placeholder={"Enter destination"}
    onChangeText={(text) => this.setState({text})}
    value={this.state.text}
    onSubmitEditing={(argument) => this._end()}
  />
 <TouchableOpacity onPress={() => this._help()} style={{
 
      backgroundColor: '#0cb9ed',
      position: 'absolute',
     justifyContent: 'center',             //for center align
            alignSelf: 'flex-start', //for align to right
      
            height: '25%',
            width: '45%',
            alignItems: 'center'}}>
    <Text style={{color: 'white', fontSize: 16}}>
      Help
    </Text>



</TouchableOpacity>
 
  
<TouchableOpacity onPress={() => this._leave()} style={{
  bottom:0,
      backgroundColor: '#e39517',
      position: 'absolute',
     justifyContent: 'center',             //for center align
            alignSelf: 'flex-end', //for align to right

            height: '25%',
            width: '45%',
            alignItems: 'center'}}>
    <Text style={{color: 'white', fontSize: 16}}>
      Home
    </Text>
    </TouchableOpacity>
      </View>
    );
  }
}