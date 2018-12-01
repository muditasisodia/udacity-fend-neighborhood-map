import React, {Component} from 'react';
import './../App.css';

class List extends Component {

  clickListName = venueName => {
    //Triggering click event on the marker that matches the clicked location
    this.props.markers.forEach(marker => {
      if (marker.title === venueName) {
        window.google.maps.event.trigger(marker, "click");
      }
    });
  };

  render(){
    return(
      <ul>
      {this.props.places.length>0 &&
        this.props.places.map(place => {
          return(
            <li key={place.venue.id} onClick={()=>this.clickListName(place.venue.name)}>
          {place.venue.name}
        </li>);
      })
      }
    </ul>)
  }
}

export default List;
