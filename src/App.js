import React, { Component } from 'react';
import './clean.css'
import axios from 'axios'

// in seconds
const gameTime = 15

const defaultState = {
  start: '',
  target: '',
  title: '',
  html: '',
  history: [],
  time: {},
  seconds: gameTime,
}



class App extends Component {
  constructor() {
    super()
    this.state = defaultState
    this.timer = 0
    this.startTimer = this.startTimer.bind(this)
    this.countDown = this.countDown.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.titleize = this.titleize.bind(this)
    this.startGameClick = this.startGameClick.bind(this)
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  // componentDidUpdate() {
  //   if (this.state.seconds === 0) {
  //     let timeLeftVar = this.secondsToTime(this.state.seconds);
  //     this.setState({...defaultState,
  //       time: timeLeftVar})
  //   }
  // }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }

  async startGameClick() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
    else if (this.timer > 0 && this.state.seconds === gameTime) {
      this.timer = setInterval(this.countDown, 1000);
    }
    const randWiki1 = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/random/title`)
    const randWiki2 = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/random/title`)
    const start = randWiki1.data.items[0].title
    const target = randWiki2.data.items[0].title
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${start}`)
    const startHtml = response.data
    this.setState({
      start,
      target,
      html: startHtml,
      history: [start.split("_").join(" ")]
    })
  }

  async handleClick(evt) {
    evt.preventDefault()
    this.setState({ isLoading: true })
    if (evt.target.tagName !== 'A') return

    const title = this.titleize(evt.target.title)
    await this.setState({ title, history: [...this.state.history, evt.target.title] })
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${this.state.title}`)
    this.setState({ html: res.data })
    console.log('clicked title: ', title, 'target title: ', this.state.target)
    if (title === this.state.target) { alert('DAAAAAMN!') }
  }

  titleize(title) {
    return title.split(' ').join('_')
  }

  render() {
    const history = this.state.history
    if (this.state.seconds === 0) {
      alert("Time's up!")
      return (
        <div id="game-container" style={{ padding: 25 }}>
        <header className="game-header">
          <h1 className="game-title">WikiLinks Game</h1>
        </header>
        <div>
          <h3>You ran out of time :(</h3>
          <p>The target: {this.state.target.split('_').join(' ')}</p>
          <p>Your history: {this.state.history.join(' => ')}</p>
          <button onClick={()=> {
            let timeLeftVar = this.secondsToTime(gameTime);
            this.setState({...defaultState,
              time: timeLeftVar
            })
            }}>Play Again</ button>
          </div>
          </div>
      )
    }

    let clicks = this.state.history.length - 1
    if (clicks === -1) {
      clicks = 0
    }

    console.log("this.timer", this.timer)
    console.log("this.state.seconds", this.state.seconds)
    console.log("this.state.countDown", this.state.countDown)

    return (
      <div id="game-container" style={{ padding: 25 }}>
        <header className="game-header">
          <h1 className="game-title">WikiLinks Game</h1>
        </header>
        <div>
          <button onClick={this.startGameClick}>Start Game</ button>
          <div className='game-wikipedia-info-container' style={{display: 'flex', borderStyle: 'solid', paddingLeft: 25}}>
            <div className='game-wikipedia-render' style={{flex: '3', height: '80vh', overflowY: 'scroll'}}>
              {
                (this.state.html === '') ? null : <div className='wiki-article' onClick={this.handleClick} dangerouslySetInnerHTML={{ __html: this.state.html }} />
              }
            </div>
            <div className='game-info-container-wrapper' style={{flex: '1', display: 'flex', flexDirection: 'column', backgroundColor: 'lightgrey'}}>
              <div className='game-info-container' style={{flex: '1', padding: 20}}>
              <div className='game-info-container-fixed' style={{flex: '1'}}>
              <h3 style={{textAlign: 'center',}}>Game Info</h3>
              <h3 style={{textAlign: 'center',}}>Time Remaining: {this.state.time.m}:{this.state.time.s}</h3>
                <p>Start: {this.state.start.split("_").join(" ")}</p>
                <p>Target: {this.state.target.split("_").join(" ")}</p>
                <p>History: {history.join(", ")}</p>
                <p>Clicks: {clicks}</p>
                <p>Users:</p>
                  {/*map through users here*/}
                  <ul>User1 (2)</ul>
                  <ul>User2 (3)</ul>
              </div>
            </div>
            </div>
      </div>
      </div>
      </div>
    );
  }
}

export default App;
