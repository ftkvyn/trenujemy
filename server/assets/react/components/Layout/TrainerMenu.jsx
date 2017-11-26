import React from 'react';
import ProfileData from './ProfileData';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';

class TrainerMenu extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                singleview:this.routeActive(['singleview']),
                profile: this.routeActive(['profile']),
                submenu: this.routeActive(['submenu'])
            }
        };
    };

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        if (paths.indexOf(this.props.location.pathname.replace('/','')) > -1)
            return true;
        return false;
    }

    toggleItemCollapse(stateName) {
        var newCollapseState = {};
        for (let c in this.state.collapse) {
            if (this.state.collapse[c] === true && c !== stateName)
                this.state.collapse[c] = false;
        }
        this.setState({
            collapse: {
                [stateName]: !this.state.collapse[stateName]
            }
        });
    }

    render() {      
        return (
            <ul className="nav">
                <ProfileData defaultProfilePic='img/user/02.jpg'></ProfileData>
                { /* Iterates over all sidebar items */ }
                <li className="nav-heading ">
                    <span>Panel Trenera</span>
                </li>

                <li className={ this.routeActive('singleview') ? 'active' : '' }>
                    <Link to="singleview" title="Single view">
                    <em className="icon-grid"></em>
                    <span data-localize="sidebar.nav.SINGLEVIEW">Single View</span>
                    </Link>
                </li>

                <li className={ this.routeActive(['profile']) ? 'active' : '' }>
                    <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'profile') }>
                        <em className="icon-user"></em>
                        <span>Konto</span>
                    </div>
                    <Collapse in={ this.state.collapse.profile } timeout={ 100 }>
                        <ul id="profile" className="nav sidebar-subnav">
                            <li className="sidebar-subnav-header">Moje dane</li>
                            <li className={ this.routeActive('profile') ? 'active' : '' }>
                                <Link to="profile" title="Moje dane">
                                <span>Moje dane</span>
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                <li className={ this.routeActive(['submenu']) ? 'active' : '' }>
                    <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'submenu') }>
                        <div className="pull-right label label-info">1</div>
                        <em className="icon-speedometer"></em>
                        <span data-localize="sidebar.nav.MENU">Menu</span>
                    </div>
                    <Collapse in={ this.state.collapse.submenu } timeout={ 100 }>
                        <ul id="submenu" className="nav sidebar-subnav">
                            <li className="sidebar-subnav-header">Submenu</li>
                            <li className={ this.routeActive('submenu') ? 'active' : '' }>
                                <Link to="submenu" title="Submenu">
                                <span data-localize="sidebar.nav.SUBMENU">Submenu</span>
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>

            </ul>);
    }

}

export default withRouter(TrainerMenu);

