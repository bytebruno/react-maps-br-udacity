import React, { Component } from 'react';
import { MenuButton } from './MenuButton';
import sortBy from 'sort-by';

class List extends Component {
  constructor(props) {
    super(props);
    this.openMarker = this.openMarker.bind(this);
    this.state = {
      query: ''
    };
  }

  // abrir o marker e infowindow corretos de acordo com o evento
  openMarker(e) {
      this.props.markers.map(marker => {
        if (e.target.value === marker.name) {
          this.props.infoWindows.map(infoWindow => {
            if (marker.name === infoWindow.name) {
              infoWindow.open(this.props.map, marker);
              if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
              } else {
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(() => {marker.setAnimation(null);}, 300)
              }
            }
          })
        }
      })
  }
  render() {
    const {places, settingQuery} = this.props;

    // ordenar por nome da academia
    places.sort(sortBy('name'));
    return (
      // mostro ou não o menu lateral de acordo com a prop listVisible
      <div className={!this.props.listVisible ? 'list-view hidden' : 'list-view shown'}>
      {/* botao do menu lateral a prop listVisible é alterada através do click neste objeto*/}
      <MenuButton listVisible={this.props.listVisible} toggle={this.props.toggle}/>
        <h1>Academias</h1>
        <input
          type="text"
          placeholder="Pesquise a academia"
          value={ this.state.query }
          // altera o valor da busca e chama o método para realizar a nova chama a API do foursquare 
          onChange={(event) => {
            this.setState({ query: event.target.value });
            settingQuery(event.target.value)}
          }
          role="search"
          aria-labelledby="Pesquise a academia"/>
        <ul id="list">
          {/* lista as academias retornados da API do foursquare */}
          {places ? (
            places.map(place => {
              return (
                <li key={place.id}>
                  <button
                    className='button'
                    type="button"
                    onClick={this.openMarker}
                    value={place.name}>{place.name}</button>
                </li>
              )
            })
          ): (
            <li>Carregando</li>
          )}
        </ul>
      </div>
    )
  }
}

export default List;
