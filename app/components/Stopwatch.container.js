
//https://ghost.codersera.com/blog/first-react-native-app-stopwatch/ source

import  React, { Component } from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

class StopwatchContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hr: 0,
            min: 0,
            sec: 0,
            msec: 0
        };
    }

    handleToggle = () => {
        this.setState(
            {
                start: !this.state.start
            },
            () => this.handleStart()
        );
    };


    handleStart = () => {
        if (this.state.start) {
            this.interval = setInterval(() => {
                this.setState((prevState) => {
                    // Update seconds
                    if (prevState.sec !== 59) {
                        return { sec: prevState.sec + 1 };
                    } 
                    // If seconds reach 60, reset seconds and increment minutes
                    else if (prevState.min !== 59) {
                        return { sec: 0, min: prevState.min + 1 };
                    }
                    // If minutes reach 60, reset minutes and increment hours
                    else {
                        return { sec: 0, min: 0, hr: prevState.hr + 1 };
                    }
                });
            }, 1000); 
        } else {
            clearInterval(this.interval);
        }
    };

    handleReset = () => {
        this.setState({
            min: 0,
            sec: 0,
            msec: 0,

            start: false
        });

        clearInterval(this.interval);

        this.lapArr = [];
    };

    // Move the padToTwo function outside of render method
    padToTwo = (number) => (number <= 9 ? `0${number}` : number);

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.parent}>
                <Text style={styles.child}>
                        {this.padToTwo(this.state.hr) + ' : '}
                    </Text>
                    <Text style={styles.child}>
                        {this.padToTwo(this.state.min) + ' : '}
                    </Text>
                    <Text style={styles.child}>
                        {this.padToTwo(this.state.sec)}
                    </Text>
                    {/* <Text style={styles.child}>
                        {this.padToTwo(this.state.msec)}
                    </Text> */}
                </View>

                {/* For Buttons */}
                <View style={styles.buttonParent}>

                    <TouchableOpacity style = {styles.button} onPress = {this.handleToggle} > 
                        < Text style = {styles.buttonText} > 
                        {!this.state.start ? 'Start' : 'Pause'} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>End</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}


export default StopwatchContainer;


const styles = StyleSheet.create({
	parent: {
		display: "flex",
		flexDirection: "row",
		borderWidth: 1,
		borderRadius: 80,
		borderColor: "#694966",
		backgroundColor: '#694966',
		paddingLeft: "8%",
		paddingRight: "8%",
		paddingTop: ".5%",
		paddingBottom: ".5%",
	},

	child: {
		fontSize: 40,
		color: "#C89933",
	},

	buttonParent: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: "12%",
	},

	button: {
		backgroundColor: "#694966",
		paddingTop: "5%",
		paddingBottom: "5%",
		paddingLeft: "5%",
		paddingRight: "5%",
		display: "flex",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#694966",
		height: 60,
	},

	buttonText: {
		color: "#C89933",
		fontSize: 20,
		alignSelf: "center"
	}
});