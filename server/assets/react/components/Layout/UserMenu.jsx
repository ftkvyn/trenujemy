import React from 'react';
import ProfileData from './ProfileData';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';

class UserMenu extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                profile: this.routeActive(['profile']),
                survey: this.routeActive(['survey']),
                advice: this.routeActive(['advice']),
                diary: this.routeActiveStart(['diary']),
            }
        };
    };

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        if (paths.indexOf(this.props.location.pathname.replace('/','')) > -1)
            return true;
        return false;
    }

    routeActiveStart(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        let currentPath = this.props.location.pathname;
        for (var i = paths.length - 1; i >= 0; i--) {
            if(currentPath.indexOf(paths[i]) != -1){
                return true;
            }
        }
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

                <li className={ this.routeActive(['profile','survey','advice']) || this.routeActiveStart(['diary']) ? 'active' : '' }>
                    <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'profile') }>
                        <em className="icon-user"></em>
                        <span>Konto</span>
                    </div>
                    <Collapse in={ this.state.collapse.profile } timeout={ 100 }>
                        <ul id="profile" className="nav sidebar-subnav">
                            <li className="sidebar-subnav-header">Konto</li>
                            <li className={ this.routeActive('profile') ? 'active' : '' }>
                                <Link to="/profile" title="Moje dane">
                                <span>Moje dane</span>
                                </Link>
                            </li>
                            <li className={ this.routeActive('survey') ? 'active' : '' }>
                                <Link to="/survey" title="Ankieta">
                                <span>Ankieta</span>
                                </Link>
                            </li>
                            <li className={ this.routeActive('advice') ? 'active' : '' }>
                                <Link to="/advice" title="Zalecenia">
                                <span>Zalecenia</span>
                                </Link>
                            </li>
                            <li className={ this.routeActiveStart('diary') ? 'active' : '' }>
                                <Link to="/diary" title="Dziennik aktywności">
                                <span>Dziennik aktywności</span>
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>

            </ul>);
    }

}

export default withRouter(UserMenu);

