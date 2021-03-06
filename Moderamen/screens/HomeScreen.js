import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Dialog from "react-native-dialog";
import * as Speech from 'expo-speech';
import { MonoText } from '../components/StyledText';
import { Magnetometer } from 'expo-sensors';

import { NavigationActions,StackNavigation } from 'react-navigation';
import {getroute,setroute} from '../App.js';

var i=0;
const buttonPadding = 70;

//To Do, 
//Get rid of top bar
//Change Tab bar bottom height to be bigger
//Create Functionalaity for buttons
//search will be used to request a route
//Working on magentometter function-Sean
//get text to speech
export default class HomeScreen extends React.Component {
//lazy and have two listeners so I can always get data easily
  state = {
    MagnetometerData: {},
    dialogVisible: false,
    route:[],
    search:"Search",
    start:"Start",
  };

	
static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    tabBarVisible: false,
};
  componentDidMount() {
    this._toggle();
     var thingToSay = 'Press the Top Left Corner for help';
    Speech.speak(thingToSay);


  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };


_help=() =>
{
if(this.state.start=="Start")
{
Speech.speak('Press Top Right corner for Search');
Speech.speak('Press Middle to Start once route selected');
Speech.speak('Press Bottom Right Corner for Route Making');
Speech.speak('Press Bottom Left Corner for Repeat Route');
}
else
{
Speech.speak('Press Top Right corner for Stop');
Speech.speak('Press Middle to Direction');
Speech.speak('Press Bottom left for Stop');
Speech.speak('Press Bottom Right for Create');
}
}
_search=() =>
{
	if(this.state.search=="Search")
	{
console.log('Search');
this.props.navigation.navigate(NavigationActions.navigate({
    routeName: 'HomeStack',
    action: NavigationActions.navigate({ routeName: 'MyModal2'})
}));
}
else
{
	var empty= [];
setroute(empty);
this.setState({route:getroute()});
this.setState({search:"Search"});
this.setState({start:"Start"});


}

}
_create=()=>
{
Speech.speak('To return to navigation press the bottom right corner');
this.props.navigation.navigate(NavigationActions.navigate({
    routeName: 'LinksStack'
}))

}
checker(angle1,angle2)
{
if(angle1>340)//check
{
if(angle1+20-360>angle2)
{
	return true;
}
else
{
	return false;
}
}
else if(angle1<21)
{
if(angle1+360-20>angle2)
{
	return true;
}
else
{
	return false;
}
}
else
{
if(angle1>angle2)
{
	if(angle1-angle2<41)
	{
		return true;
	}
	else
	{
		return false;
	}
}
else
{

	if(angle2-angle1<41)
	{
		return true;
	}
	else
	{
		return false;
	}
}

}

}
_repeat=() =>
{
	var angle=this._angle(this.state.MagnetometerData);
	
	var dummy=getroute();
this.setState({route:getroute()});
if(this.state.start=="Start")
{

	this.setState({search:"Stop"});
this.setState({start:"Step"});
i=0;


}
if(dummy.length==0)
{
Speech.speak('No route selected');
this.setState({search:"Search"});
this.setState({start:"Start"});

}
else
{ 
	if(i<dummy.length)
	{	var obj= dummy[i];
		var angle2 = obj["Data"];
				console.log(angle);
		console.log(angle2);
		if(this.checker(angle,angle2))
		{
			Speech.speak(obj["Type"]);
			if(obj["Description"]!='')
			{
				Speech.speak(obj["Description"]);
			}
			i=i+1;

			Speech.speak("You are ");
			Speech.speak(i.toString());

			Speech.speak("out of ");
			Speech.speak(dummy.length.toString());

			Speech.speak("parts");
		}

		else if(angle>180)//figure out to turn left or right
		{
			if(angle2>angle)
			{
				Speech.speak('Turn Right');
			}
			else if(angle-angle2<180)
			{
				Speech.speak('Turn Left');
			}
			else{
				Speech.speak('Turn Right');
			}
		}
		else
		{
			if(angle2<angle)
			{
				Speech.speak('Turn Left');
			}
			else if(angle-angle2>-180)
			{
				Speech.speak('Turn Right');
			}
			else
			{
				Speech.speak('Turn Left');
			}
			
		}

	}
	else
	{
		Speech.speak('You have reached the Location');
var empty= [];
setroute(empty);
this.setState({route:getroute()});
this.setState({search:"Search"});
this.setState({start:"Start"});
i=0;

	}
}
}
_repeat2=()=>
{
	if(i!=0)
	{
		i--;
		this._repeat();
	}
	else
	{
		this._repeat();
	}
}

  _subscribe = () => {
    this._subscription = Magnetometer.addListener(result => {
      
      this.setState({ MagnetometerData: result });
    });
  };
  _angle = (magnetometer) => {
    if (magnetometer) {
      let {x, y, z} = magnetometer;

      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      }
      else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }

    return Math.round(angle);
  };
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };
  render() {
    return (
      <View style={{flex:1}}>
<TouchableOpacity onPress={() => this._help()} style={{
 
      backgroundColor: '#077ee0',
      alignItems: 'center',
      position: 'absolute',
     justifyContent: 'center',             //for center align
            alignSelf: 'flex-start', //for align to right
            height: '25%',
            width: '45%',
      }}>
    <Text style={{color: 'white', fontSize: 16}}>
      Help
    </Text>



</TouchableOpacity>
<TouchableOpacity onPress={() => this._search()} style={{
 
      backgroundColor: this.state.search == "Search" ? '#077ee0': "#ed4b2b",
      position: 'absolute',
      alignItems: 'center',
     justifyContent: 'center',             //for center align
            alignSelf: 'flex-end', //for align to right
            height: '25%',
            width: '45%',
      }}>
    <Text style={{color: 'white', fontSize: 16}}>
      {this.state.search}
    </Text>

</TouchableOpacity>
<TouchableOpacity onPress={() => this._repeat()} style={{
      top:'30%',
      backgroundColor: '#0ad15d',
      position: 'absolute',
      alignItems: 'center',
     justifyContent: 'center',             //for center align
            alignSelf: 'center', //for align to right
            height: '40%',
            width: '80%',
      }}>
    <Text style={{color: 'white', fontSize: 16}}>
      {this.state.start}
    </Text>

</TouchableOpacity>
<TouchableOpacity onPress={() => this._create()} style={{
 	bottom:0,
      backgroundColor: '#e39517',
      position: 'absolute',
      alignItems: 'center',
     justifyContent: 'center',             //for center align
            alignSelf: 'flex-end', //for align to right
            height: '25%',
            width: '45%',
      }}>
    <Text style={{color: 'white', fontSize: 16}}>
      Create
    </Text>

</TouchableOpacity>
<TouchableOpacity onPress={() => this._repeat2()} style={{
 
      backgroundColor: '#e39517',
      position: 'absolute',
      alignItems: 'center',
     justifyContent: 'center',             //for center align
            alignSelf: 'flex-start', //for align to right
      bottom:0,
      height: '25%',
      width: '45%',
      }}>
    <Text style={{color: 'white', fontSize: 16}}>
      Repeat
    </Text>

</TouchableOpacity>
      </View>
    );
  }
}