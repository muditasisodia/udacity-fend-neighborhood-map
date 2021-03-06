import React, { Component } from 'react';
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

      //In case of incorrect API key
      window.gm_authFailure = this.gm_authFailure;
    }

    gm_authFailure = () => {
      alert("Authorization failed :(");
    }

    handleChange(event) {
    this.setState({query: event.target.value});

//converting both strings to be compared to lower case and then comparing
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

    var contentString = `<h4>${place.venue.name}</h4><h5>${place.venue.location.address}</h5>`;

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

        //ensures bounce animation stops after 500 milliseconds
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
  const client_id= "3P10L1CV3E413ZQ4ZM553ZLVLPPFNGPIMUVOIRYI4NUC54I0";
  const client_secret= "ULYHIA3RI3SZ4KPDD5DKKOQ3R411IBZILOVWJPHSIGR1LBXY";
  const query = "outdoors";
  const near = "Mumbai";
  const v = "20180323";

//AJAX call FourSquare to get locations to plot
  fetch(`${endPoint}client_id=${client_id}&client_secret=${client_secret}&quey=${query}&near=${near}&v=${v}`)
    .then(response => response.json())
    .then(data => {
      this.setState({allPlaces: data.response.groups[0].items
        },
      ()=>this.loadMap())
    })
    .catch(error => {
      console.log("ERROR: "+error)
      alert("There was an error from FourSqaure.");
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
      <aside className = "list-container">
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
          role="menu"
        />
      </aside>
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
  script.onerror = function() {
  alert("Google Maps failed to load :(");
};
  index.parentNode.insertBefore(script, index);
}

export default App;
