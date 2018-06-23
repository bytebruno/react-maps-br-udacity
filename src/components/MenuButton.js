import React, { Component } from "react";

export class MenuButton extends Component {

  render() {
    // Mostra o ícone correto do botão de menu de acordo com o listVisible
    const classes = this.props.listVisible
      ? "menu-button active"
      : "menu-button";
    return (
      <button className={classes} onClick={this.props.toggle}>
        <span className="bar" />
      </button>
    );
  }
}

export default MenuButton;
