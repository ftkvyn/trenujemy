import React from 'react';
import ProfileData from './ProfileData';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { loadUser } from '../Common/userDataService';
import { loadNewHintsCount, addNotificationsListener, removeNotificationsListener } from '../Common/notificationsService';
import Notification from '../Components/Notification'

class UserMenu extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                profile: this.routeActive(['profile']),
                survey: this.routeActive(['survey']),
                advice: this.routeActive(['advice']),
                diary: this.routeActiveStart(['diary'])                
            },
            userData:{
                feedPlans:[],
                trainPlans:[]
            },
            notifications:{
                hints: 0
            },
            listenerKey: null
        };

        
    };

    componentDidMount(){
        loadUser()
        .then(userData => {              
            this.setState({userData: userData});
        });
        loadNewHintsCount()
        .then(data => {              
            this.setState({notifications: {hints: data.count}});
        });
        let key = addNotificationsListener( newData => {
            let oldData = this.state.notifications;
            let updatedData = Object.assign(oldData, newData);
            this.setState({notifications: updatedData});
        });
        this.setState({listenerKey: key});
    }

    componentWillUnmount(){
        removeNotificationsListener(this.state.listenerKey);
    }

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
        let surveyItem = '';
        let diaryItem = '';
        let adviceItem = '';
        let trainingItem = '';
        if(this.state.userData.feedPlans.length){
            surveyItem = <li className={ this.routeActive('survey') ? 'active' : '' }>
                <Link to="/survey" title="Ankieta">
                    <em className="fa fa-edit"></em>
                    <span>Ankieta</span>
                </Link>
            </li>
        }   
        if(this.state.userData.trainPlans.length){
            trainingItem = <li className={ this.routeActive('trainings') ? 'active' : '' }>
                <Link to="/trainings" title="Treningi">
                    <em className="fa fa-calendar-check-o"></em>
                    <span>Treningi</span>
                </Link>
            </li>
        }   
        if(this.state.userData.feedPlans.length || this.state.userData.trainPlans.length){
            adviceItem = <li className={ this.routeActive('advice') ? 'active' : '' }>
                <Link to="/advice" title="Zalecenia">
                    <em className="fa fa-exclamation-triangle"></em>
                    <span>Zalecenia</span>
                </Link>
            </li>

            if(this.state.userData.feedPlans.length && this.state.userData.feedPlans[0].plan.isWithConsulting){
                diaryItem = <li className={ this.routeActiveStart('diary') ? 'active' : '' }>
                    <Link to="/diary" title="Dziennik aktywności">
                        <em className="fa fa-address-book-o"></em>
                        <span>Dziennik aktywności</span>
                    </Link>
                </li>
            }
        }
        return (
            <ul className="nav">
                <ProfileData defaultProfilePic='img/user/13.jpg'></ProfileData>
                { /* Iterates over all sidebar items */ }
                <li className="nav-heading ">
                    <span>Panel Klienta</span>
                </li>
                <li className={ this.routeActive('goods') ? 'active' : '' }>
                    <Link to="/goods" title="Usługi">
                        <em className="fa fa-id-card-o"></em>
                        <span>Usługi</span>
                    </Link>
                </li>
                <li className={ this.routeActive('profile') ? 'active' : '' }>
                    <Link to="/profile" title="Moje dane">
                        <em className="icon-user"></em>
                        <span>Moje dane</span>
                    </Link>
                </li>
                {surveyItem}                
                {adviceItem}                
                {diaryItem}
                {trainingItem}
                <li className={ this.routeActive('hints') ? 'active' : '' }>
                    <Link to="/hints" title="Ciekawostki od trenera">
                        <Notification count={this.state.notifications.hints}></Notification>
                        <em className="fa fa-lightbulb-o"></em>
                        <span>Ciekawostki</span>
                    </Link>
                </li>
            </ul>);
    }

}

export default withRouter(UserMenu);

