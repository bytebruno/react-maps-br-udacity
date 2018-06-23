import React, { Component } from 'react';
import '../App.css';
import List from './List';
import scriptLoader from 'react-async-script-loader';
import {createFilter} from 'react-search-input';
import { mapStyles } from '../mapStyles.js';

var markers = [];
var infoWindows = [];

class Map extends Component {
  constructor(props) {
    super(props);
    this.loadMarkers = this.loadMarkers.bind(this);
    this.state = {
      markers: [],
      infoWindows: [],
      places: [],
      map: {},
      query: '',
      requestWasSuccessful: true,
      listVisible: true
    }
  }

  componentWillReceiveProps({isScriptLoadSucceed}){
    if (isScriptLoadSucceed) {
      // inicializa o mapa e chama a API do foursquare para carregar os marcadores
      var map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new window.google.maps.LatLng(-22.8755116,-43.3579373),
        styles: mapStyles
      });
      this.setState({map});
      this.loadMarkers(map)
    }
    else {
      console.log("falha ao carregar o google maps API");
      this.setState({requestWasSuccessful: false})
    }
  }

  // essa função realiza uma requisição CORS para a API do foursquare para buscar
  // todas as academias registradas no foursquare em um raio de 5km da latitude e longitude setada abaixo
  // e adiciona os marcadores e janelas de informação de cada uma delas no mapa
  loadMarkers(map) {
    var CORSRequest = this.createCORSRequest('GET',"https://api.foursquare.com/v2/venues/search?ll=-22.8882434,-43.363038&query=academia&radius=5000&categoryId=4bf58dd8d48988d175941735&client_id=IG3NKH1GSP0NLSOQ0DZGEWZG0EWOOZXSOJICW2RDP2OMOZ20&client_secret=M11WGB3CMFGLBKZQAVYODKSN1V2U1C0HPI0GIFI3DWPL5FDX&v=20201215&limit=50");
    CORSRequest.onload = () => {
      this.setState({ places: JSON.parse(CORSRequest.responseText).response.venues.filter(createFilter(this.state.query, ['name', 'location.address']))});
      markers.forEach(m => { m.setMap(null) });
      // limpo os marcadores e janelas de informação para que informações antigas não fiquem em objetos novos
      markers = [];
      infoWindows = [];
      this.state.places.map(place => {
        var contentString =
        `<div class="infoWindow">
          <h1>${place.name}</h1>
          <h3>${place.location.address ? place.location.address : place.location.formattedAddress[0]}</h3>
          ${place.url ? "<a href=" + place.url + ">Ir para o site</a>" : ""}
        </div>`

        var infoWindow= new window.google.maps.InfoWindow({
          content: contentString,
          name: place.name
        });
        var marker = new window.google.maps.Marker({
          map: map,
          position: place.location,
          animation: window.google.maps.Animation.DROP,
          name : place.name,
          icon: null
        });
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {marker.setAnimation(null);}, 300)
          }
        });
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
        markers.push(marker);
        infoWindows.push(infoWindow);
        this.setState({markers})
        this.setState({infoWindows})
      })
    };
    CORSRequest.onerror = () => {
      this.setState({requestWasSuccessful: false});
    }
    CORSRequest.send();
  }

  // função de requisição CORS
  createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      xhr = null;
      alert("CORS não é suportado pelo seu navegador, navegue por outro para conseguir usar o app.");
    }
    return xhr;
  }

  // resgata o que o usuário digitou no menu lateral das academias e refaz a requisição
  queryHandler(query) {
    this.setState({query});
    this.loadMarkers(this.state.map);
  }

  // muda o state do listVisible para mostrar e não mostrar a lista de academias
  toggle = () => {
    this.setState({
      listVisible: !this.state.listVisible
    });
  }
  render() {
    const {map, places, requestWasSuccessful} = this.state;

    return (
      requestWasSuccessful ? (
        <div id="container">
          <div id="map-container" role="application" tabIndex="-1">
              <div id="map" role="application"></div>
          </div>
          <List
            places={places}
            settingQuery={(query) => {this.queryHandler(query)}}
            markers={markers}
            infoWindows={infoWindows}
            map={map}
            listVisible={this.state.listVisible}
            toggle={this.toggle}/>
        </div>
      ) : (
        <div>
          <h1>Falha no carregamento da api de mapas. Tente novamente</h1>
        </div>
      )
    )
  }
}

// realizando a requisição assíncrona com o react-async-script-loader
export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=AIzaSyDZs3SOCxr5iNwWg7UDhQnSI6nMPjFYIf8&libraries=places`]
)(Map);
