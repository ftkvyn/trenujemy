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
                profile: this.routeActive(['profile', 'transactions', 'trainerPageEdit']),
                trainings: this.routeActive(['trainings/price', 'trainings/places', 'trainings/hours']),
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
                <ProfileData defaultProfilePic='/images/no_image_user.png'></ProfileData>
                { /* Iterates over all sidebar items */ }
                <li className="nav-heading ">
                    <span>Panel Trenera</span>
                </li>

                <li className={ this.routeActive(['profile', 'transactions', 'trainerPageEdit']) ? 'active' : '' }>
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
                            <li className={ this.routeActive('trainerPageEdit') ? 'active' : '' }>
                                <Link to="/trainerPageEdit" title="Moja strona">
                                    <span>Moja strona</span>
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

