import React from 'react';
import ProfileData from './ProfileData';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { loadNewHintsCount, addNotificationsListener, removeNotificationsListener, loadNotifications } from '../Common/notificationsService';
import Notification from '../Components/Notification'
import AdvisorsList from './AdvisorsList'

class UserMenu extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                profile: this.routeActive(['profile']),
                survey: this.routeActive(['survey']),
                diary: this.routeActiveStart(['diary'])                
            },
            notifications:{
                hints: 0,
                survey: false,
                diaryDays: []
            },
            listenerKey: null
        };

        
    };

    componentDidMount(){
        loadNewHintsCount()
        .then(data => {  
            let model = Object.assign({}, this.state.notifications);         
            model.hints = data.count;
            this.setState({notifications: model});
        });
        loadNotifications()
        .then(data => {     
            let model = Object.assign({}, this.state.notifications);         
            if(data.updateSurvey){
                model.survey = 1;
            }
            if(data.diaryDays){
                model.diaryDays = data.diaryDays;
            }
            this.setState({notifications: model});
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
        trainingItem = <li className={ this.routeActive('trainings') ? 'active' : '' }>
            <Link to="/trainings" title="Treningi">
                <em className="fa fa-calendar-check-o"></em>
                <span>Treningi</span>
            </Link>
        </li>
        surveyItem = <li className={ this.routeActive('survey') ? 'active' : '' }>
            <Link to="/survey" title="Ankieta">
                <Notification count={this.state.notifications.survey}></Notification>
                <em className="fa fa-edit"></em>
                <span>Ankieta</span>
            </Link>
        </li>
        adviceItem = <AdvisorsList></AdvisorsList>      
        diaryItem = <li className={ this.routeActiveStart('diary') ? 'active' : '' }>
            <Link to="/diary" title="Dziennik aktywności">
                <Notification count={this.state.notifications.diaryDays.length}></Notification>
                <em className="fa fa-address-book-o"></em>
                <span>Dziennik aktywności</span>
            </Link>
        </li>
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
            </ul>);
    }

}

export default withRouter(UserMenu);

