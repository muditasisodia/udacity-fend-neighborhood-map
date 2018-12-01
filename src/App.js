import React, { Component } from 'react';
import axios from 'axios';
import List from './components/List';
import FSLogo from './assets/powered-by-foursquare-blue.svg';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      allPlaces: [],
      query: "",
      allMarkers: [],
      showMenu: false,
      showList: false
    };
    this.handleChange = this.handleChange.bind(this);
  }
    componentDidMount() {
      this.getPlaces();
      window.gm_authFailure = this.gm_authFailure;
    }

    gm_authFailure = () => {
      alert("Authorization failed :(");
    }

    handleChange(event) {
    this.setState({query: event.target.value});

    this.state.allMarkers.forEach(marker => {
      if (marker.title.toLowerCase().includes(event.target.value.toLowerCase())){
        marker.setVisible(true);
      }
      else{
        marker.setVisible(false);
      }
    })
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCwhQIo6LxxX7B42EC2RZ8nlzqebokk87I&callback=initMap");
    window.initMap = this.initMap;
  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.0760, lng: 72.8777},
    zoom: 11
  });

  var infowindow = new window.google.maps.InfoWindow();

  this.createMarkers(this.state.allPlaces, map, infowindow);

}

createMarkers(places, map, infowindow){

  this.state.allPlaces.forEach(place => {

    var contentString = "<h4>"+place.venue.name+"</h4><h5>"+place.venue.location.address+"</h5>";

    var marker = new window.google.maps.Marker({
      position: {lat: place.venue.location.lat, lng: place.venue.location.lng},
      map: map,
      animation: window.google.maps.Animation.DROP,
      title: place.venue.name
    });

    this.setState(prevState => ({allMarkers: prevState.allMarkers.concat([marker])}));

    marker.addListener('click', function() {

      infowindow.setContent(contentString)
      infowindow.open(map, marker);
    });

    marker.addListener('click', toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }

        setTimeout(function(){
          if(marker.getAnimation() !== null) {
              marker.setAnimation(null);
          }
        }, 500)
      }
  })
}

getPlaces = () => {
  const endPoint = "https://api.foursquare.com/v2/venues/explore?";
  const params = {
        client_id: "3P10L1CV3E413ZQ4ZM553ZLVLPPFNGPIMUVOIRYI4NUC54I0",
        client_secret: "ULYHIA3RI3SZ4KPDD5DKKOQ3R411IBZILOVWJPHSIGR1LBXY",
        query: "outdoors",
        near: "Mumbai",
        v: "20180323"
      }

  axios.get(endPoint + new URLSearchParams(params))
    .then(response => {
      this.setState({allPlaces: response.data.response.groups[0].items
        },
      ()=>this.loadMap())
    })
    .catch(error => {
      console.log("ERROR: "+error)
      alert("There was an error from FromSqaure.");
    })
}

menuClicked(){
  this.setState(prevState => ({showList: !prevState.showList}))
}

  render() {
    return (
      <React.Fragment>
      <div className="nav">
        <i className="fa fa-bars" aria-hidden="true" onClick={()=>this.menuClicked()} role="button" tabIndex={0}></i>
        <img src={FSLogo} alt="Powered by FourSquare"/>
      </div>
      <main>
      {this.state.showList &&
      <div className = "list-container">
        <input
          type="text"
          tabIndex={0}
          value={this.state.query}
          onChange={this.handleChange}
          className="search-field"
          placeholder="Search eg. Pali Market"
          role="search"
        />
          <List
          places={this.state.query===""?this.state.allPlaces: this.state.allPlaces.filter(place => place.venue.name.toLowerCase().includes(this.state.query.toLowerCase()))}
          markers = {this.state.allMarkers}
        />
      </div>
    }
      <div className="map-container" style={{width: this.state.showList? '75%': '100%'}}>
      <div id="map" role="application"></div>
      </div>
      </main>
      </React.Fragment>
    );
  }
}

function loadScript(url){
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
