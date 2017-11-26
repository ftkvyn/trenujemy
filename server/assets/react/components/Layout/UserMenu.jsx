import React from 'react';
import ProfileData from './ProfileData';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';

class UserMenu extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                singleview: this.routeActive(['singleview']),
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
                <ProfileData defaultProfilePic='img/user/13.jpg'></ProfileData>
                { /* Iterates over all sidebar items */ }
                <li className="nav-heading ">
                    <span>Panel Klienta</span>
                </li>

                <li className={ this.routeActive('singleview') ? 'active' : '' }>
                    <Link to="singleview" title="Single View">
                    <em className="icon-grid"></em>
                    <span data-localize="sidebar.nav.SINGLEVIEW">Single View 2</span>
                    </Link>
                </li>

                <li className={ this.routeActive(['submenu']) ? 'active' : '' }>
                    <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'submenu') }>
                        <div className="pull-right label label-info">1</div>
                        <em className="icon-speedometer"></em>
                        <span data-localize="sidebar.nav.MENU">Menu 2</span>
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

export default withRouter(UserMenu);

