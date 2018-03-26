import React from 'react';
import ProfileData from './ProfileData';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import ClientsLinks from './ClientsLinks'

class TrainerMenu extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                profile: this.routeActive(['profile', 'transactions']),
                trainings: this.routeActive(['trainings/price', 'trainings/places', 'trainings/hours']),
                plans: this.routeActive(['plans/price']),
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

                <li className={ this.routeActive(['profile', 'transactions']) ? 'active' : '' }>
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
                            <li className={ this.routeActive('transactions') ? 'active' : '' }>
                                <Link to="/transactions" title="Rozliczenia">
                                    <span>Rozliczenia</span>
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>
                <ClientsLinks></ClientsLinks>
                <li className={ this.routeActive(['trainings/price', 'trainings/places', 'trainings/hours']) ? 'active' : '' }>
                    <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'trainings') }>
                        <em className="icon-location-pin"></em>
                        <span>Treningi</span>
                    </div>
                    <Collapse in={ this.state.collapse.trainings } timeout={ 100 }>
                        <ul id="trainings" className="nav sidebar-subnav">
                            <li className="sidebar-subnav-header">Treningi</li>
                            <li className={ this.routeActive('trainings/price') ? 'active' : '' } >
                                <Link to={"/trainings/price"} title='Cennik'>
                                    <span>Cennik</span>
                                </Link>
                            </li> 
                            <li className={ this.routeActive('trainings/places') ? 'active' : '' } >
                                <Link to={"/trainings/places"} title='Miejsca'>
                                    <span>Miejsca</span>
                                </Link>
                            </li> 
                            <li className={ this.routeActive('trainings/hours') ? 'active' : '' } >
                                <Link to={"/trainings/hours"} title='Godziny'>
                                    <span>Godziny</span>
                                </Link>
                            </li>                    
                        </ul>
                    </Collapse>
                </li>

                <li className={ this.routeActive(['plans/price']) ? 'active' : '' }>
                    <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'plans') }>
                        <em className="fa fa-cutlery"></em>
                        <span>Plany</span>
                    </div>
                    <Collapse in={ this.state.collapse.plans } timeout={ 100 }>
                        <ul id="plans" className="nav sidebar-subnav">
                            <li className="sidebar-subnav-header">Plany</li>
                            <li className={ this.routeActive('plans/price') ? 'active' : '' } >
                                <Link to={"/plans/price"} title='Cennik'>
                                    <span>Cennik</span>
                                </Link>
                            </li>                 
                        </ul>
                    </Collapse>
                </li>

                <li className={ this.routeActive('answers') ? 'active' : '' }>
                    <Link to="/answers" title="Szablony odpowiedzi">
                    <em className="fa fa-comments-o"></em>
                    <span>Szablony odpowiedzi</span>
                    </Link>
                </li>

                <li className={ this.routeActive('adviceTemplates') ? 'active' : '' }>
                    <Link to="/adviceTemplates" title="Szablony zaleceń">
                    <em className="fa fa-list-alt"></em>
                    <span>Szablony zaleceń</span>
                    </Link>
                </li>
            </ul>);
    }

}

export default withRouter(TrainerMenu);

