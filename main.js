// Displays main timer in mm:ss format
const displayTimer = (a) => {
  let minutes = Math.floor(a / 60);
  let seconds = a % 60;
  if(minutes < 10) {
    minutes = `0${minutes}`;
  }
  if(seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
// Play audio function
const playAudioF = (a) => {
  let audioIndex = document.getElementById(a);
  //console.log("playAudio()");
  return audioIndex.play();
}
// Pause audio function
const pauseAudioF = (a) => {
  let audioIndex = document.getElementById(a);
  // Pause the audio
  audioIndex.pause();
  //console.log("pauseAudio()");
  // Restart the audio
  return audioIndex.currentTime = 0;
}
//React component
class MainReactComponent extends React.Component {
  constructor(props) {
    super(props);
    //Load initial states
    this.state = {
      // Set Break time in mins
      breakCountMins: 5,
      // Set Session time in mins
      sessionCountMins: 25,
      // Set timer to 25 mins but in seconds
      timer: 25 * 60,
      // Set timer type/label, "Session" or "Break"
      timerLabel: "Session",
      // Set timer status, true = Start; false = Stopped
      timerStart: false
    };
    this.breakIncrement = this.breakIncrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
  }
  // Reset everything
  handleReset(){
    this.setState({
      // Set Break time in mins
      breakCountMins: 5,
      // Set Session time in mins
      sessionCountMins: 25,
      // Set timer to 25 mins but in seconds
      timer: 25 * 60,
      // Set timer type/label, "Session" or "Break"
      timerLabel: "Session",
      // Set timer status, true = Start; false = Stopped
      timerStart: false
    });
    // Stop countdown
    clearInterval(this.timerSetInterval);
    // Pause <audio id="beep"/>
    pauseAudioF("beep");
    //console.log("reset()");
    //console.log("Start/Stop status: "+this.state.timerStart);
  }
  // Need callback function to perform an action immediately after setting state
  handleStartStop(){
    // If timerStart: false, 
    if(this.state.timerStart === false) {
      // setState method
      this.setState( 
        // ...then set timerStart to true
        {timerStart: true} ,
        // countdown callback function
        this.countdownF()
      );
      //console.log("startTimer()");
      //console.log("Start/Stop status: "+this.state.timerStart);
    } else {
      this.setState({
        timerStart: false
      });
      // Stop countdown
      clearInterval(this.timerSetInterval);
      //console.log("stopTimer()");
      //console.log("Start/Stop status: "+this.state.timerStart);
    }
  }
  // countdown callback function, decrement timer every 1,000 milliseconds
  countdownF = () => {
    this.timerSetInterval = setInterval(
      () => {
        // countdown: timer - 1 sec every 1 sec
        this.setState({
          timer: this.state.timer - 1
        });
        // callback
        this.checkTimerF();
      }
      , 1000);
  };
  // Function to switch between Session or Break timer
  checkTimerF = () => {
    // When timer reaches 00:00
    if(this.state.timer < 0) {
      this.setState({
        // timerLabel should = "Break", but it'll still be "Session" during this render
        timerLabel: (this.state.timerLabel === "Session") ? "Break" : "Session",
        // timerLabel should = "Break", but it'll still be "Session" during this render
        timer: (this.state.timerLabel === "Session") ? this.state.breakCountMins * 60 : this.state.sessionCountMins * 60
      });
      // Play <audio id="beep"/>
      playAudioF("beep");
      // callback
      this.timeOutPauseAudio();
    }
  };
  // Only play audio for 4,000 milliseconds
  timeOutPauseAudio = () => {
    this.timeoutPauseAudio = setTimeout(
        () => {
          pauseAudioF("beep");
        }
      , 4000);
  };
  // Increments timer if it's "Session" time
  sessionIncrement(){
    // timer should NOT exceed 60 mins & the timer is stopped
    if(this.state.sessionCountMins < 60 && this.state.timerStart === false) {
      // Then change sessionCount by 1 min
      this.setState({
        sessionCountMins: this.state.sessionCountMins + 1
      });
      // If status should be "Session"
      if(this.state.timerLabel === "Session"){
        // Then set timer to sessionCount in mins
        this.setState({
          // + 1 because this.state.sessionCount hasn't changed yet in this render 
          timer: this.state.sessionCountMins*60 + 1*60
        });
      }
    }
    //console.log("sessionIncrement()")
    //console.log("timerLabel status: "+this.state.timerLabel);
  }
  // Decrements timer if it's "Session" time
  sessionDecrement(){
    // timer should NOT go below 0 mins & the timer is stopped
    if(this.state.sessionCountMins > 1 && this.state.timerStart === false) {
      // Then change sessionCount by 1 min
      this.setState({
        sessionCountMins: this.state.sessionCountMins - 1
      });
      // If status should be "Session"
      if(this.state.timerLabel === "Session"){
        // Then set timer to sessionCount in mins
        this.setState({
          // - 1 because this.state.sessionCount hasn't changed yet in this render 
          timer: this.state.sessionCountMins*60 - 1*60
        });
      }
    }
    //console.log("sessionDecrement()")
    //console.log("timerLabel status: "+this.state.timerLabel);
  }
  // Increments timer if it's "Break" time
  breakIncrement(){
    // timer should NOT exceed 60 mins & the timer is stopped
    if(this.state.breakCountMins < 60 && this.state.timerStart === false) {
      // Then change breakCount by 1 min
      this.setState({
        breakCountMins: this.state.breakCountMins + 1
      });
      // If status should be "Break"
      if(this.state.timerLabel === "Break"){
        // Then set timer to breakCount in mins
        this.setState({
          // + 1 because this.state.breakCount hasn't changed yet in this render 
          timer: this.state.breakCountMins*60 + 1*60
        });
      }
    }
    //console.log("breakIncrement()")
    //console.log("timerLabel status: "+this.state.timerLabel);
  }
  // Decrements timer if it's "Break" time
  breakDecrement(){
    // timer should NOT go below 0 mins & the timer is stopped
    if(this.state.breakCountMins > 1 && this.state.timerStart === false) {
      // Then change breakCount by 1 min
      this.setState({
        breakCountMins: this.state.breakCountMins - 1
      });
      // If status should be "Break"
      if(this.state.timerLabel === "Break"){
        // Then set timer to breakCount in mins
        this.setState({
          // - 1 because this.state.breakCount hasn't changed yet in this render 
          timer: this.state.breakCountMins*60 - 1*60
        });
      }
    }
    //console.log("breakDecrement()")
    //console.log("timerLabel status: "+this.state.timerLabel);
  }
  // Render
  render() {
    return (
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6 text-center">
          <div className="customClassMain">
            <div className="margin2pct padding5pct width300px">
              <h2 id="timer-label" className="">
                {this.state.timerLabel}
              </h2>
              <h1 id="time-left" className="headerFontSize monospaceFont">
                {displayTimer(this.state.timer)}
              </h1>
              {/* If timerStart = true meaning it's running, then display blue button for "Stop", otherwise display green button for "Start" */}
              <button id="start_stop" className={`btn btn-lg ${this.state.timerStart===true ? "btn-primary" : "btn-success"} btn-width textFontSize`}  onClick={this.handleStartStop}>{(this.state.timerStart === false) ? `Start` : `Stop`}</button>
              <button id="reset" className="btn btn-lg btn-danger btn-width textFontSize" onClick={this.handleReset}>Reset</button>
            </div>
            <div className="margin2pct width300px">
              <div id="session-label" className="textFontSize margin2pct">
                Session Length
              </div>
              <button id="session-decrement" className="btn btn-lg btn-default textFontSize" onClick={this.sessionDecrement}>-</button>
              <span id="session-length" className="textFontSize margin10px">
                {this.state.sessionCountMins}
              </span>
              <button id="session-increment" className="btn btn-lg btn-default textFontSize" onClick={this.sessionIncrement}>+</button>
            </div>
            <div className="margin2pct width300px">
              <div id="break-label" className="textFontSize margin2pct">
                Break Length
              </div>
              <button id="break-decrement" className="btn btn-lg btn-default textFontSize" onClick={this.breakDecrement}>-</button>
              <span id="break-length" className="textFontSize margin10px">
                {this.state.breakCountMins}
              </span>
              <button id="break-increment" className="btn btn-lg btn-default textFontSize" onClick={this.breakIncrement}>+</button>
            </div>
            <br/>
            <p className="">Pomodoro 25 + 5 Clock by Jun</p>
            <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    );
  }
};
ReactDOM.render(<MainReactComponent/>, document.getElementById("react-div"))