import React from 'react';
import pubsub from 'pubsub-js';
import HeaderRun from './Header.run'
import { NavDropdown, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Router, Route, Link, History } from 'react-router-dom';

// Necessary to create listGroup inside navigation items
class CustomListGroup extends React.Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.children}
      </ul>
    );
  }
}

class Header extends React.Component {
    componentDidMount() {

        HeaderRun();

    }

    toggleUserblock(e) {
        e.preventDefault();
        pubsub.publish('toggleUserblock');
    }

    render() {       
        const ddAlertTitle = (
            <span>
                <em className="icon-bell"></em>
                <span className="label label-danger">11</span>
            </span>
        )
        return (
            <header className="topnavbar-wrapper">
                { /* START Top Navbar */ }
                <nav role="navigation" className="navbar topnavbar">
                    { /* START navbar header */ }
                    <div className="navbar-header">
                        <a href="/" className="navbar-brand">
                            <div className="brand-logo">
                                { /*<img src="img/logo.png" alt="App Logo" className="img-responsive" />*/ }
                                <p className='logo-txt'>Przemysław Bulski</p>
                            </div>
                            <div className="brand-logo-collapsed">
                                { /*<img src="img/logo-single.png" alt="App Logo" className="img-responsive" />*/ }
                                <p className='logo-txt'>PB</p>
                            </div>
                        </a>
                    </div>
                    { /* END navbar header */ }
                    { /* START Nav wrapper */ }
                    <div className="nav-wrapper">
                        { /* START Left navbar */ }
                        <ul className="nav navbar-nav">
                            <li>
                                { /* Button used to collapse the left sidebar. Only visible on tablet and desktops */ }
                                <a href="#" data-trigger-resize="" data-toggle-state="aside-collapsed" className="hidden-xs">
                                    <em className="fa fa-navicon"></em>
                                </a>
                                { /* Button to show/hide the sidebar on mobile. Visible on mobile only. */ }
                                <a href="#" data-toggle-state="aside-toggled" data-no-persist="true" className="visible-xs sidebar-toggle">
                                    <em className="fa fa-navicon"></em>
                                </a>
                            </li>
                        </ul>
                        { /* END Left navbar */ }
                    </div>
                    { /* END Nav wrapper */ }
                </nav>
                { /* END Top Navbar */ }
            </header>
            );
    }

}

export default Header;
