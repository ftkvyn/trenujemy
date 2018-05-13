import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { loadAdvisors } from '../Common/adviceService';
import Notification from '../Components/Notification'

function setNotifications(trainers, advices){
    let adviceNotifications = [];
    for(let i = 0; i < trainers.length; i++){
        if(advices.indexOf(trainers[i].id) > -1){
            adviceNotifications.push(trainers[i].id);
        }
    }
    this.setState({trainers, adviceNotifications});
}

class AdvisorsList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                advice: this.routeActive(['advice']),
            },
            trainers: [],
            adviceNotifications: []
        };
        loadAdvisors()
        .then(trainers => setNotifications.call(this, trainers, this.props.notifications));
    }

    componentWillReceiveProps(nextProps) {
        setNotifications.call(this, this.state.trainers, nextProps.notifications);
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        let currentPath = this.props.location.pathname;
        for (var i = paths.length - 1; i >= 0; i--) {
            if(currentPath.indexOf(paths[i]) > -1){
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
        const linkItems = this.state.trainers.map((trainer) => {
            const trainerName = trainer.name;
            let newItems = 0;
            if(this.state.adviceNotifications.indexOf(trainer.id) > -1){
                newItems = 1;
            }
            return <li className={ this.routeActive('/advice/' + trainer.id) ? 'active' : '' } key={trainer.id} >
                <Link to={"/advice/" + trainer.id} title={trainerName}>
                    <Notification count={newItems}></Notification>
                    <span>{trainerName}</span>
                </Link>
            </li>});
        return (
            <li className={ this.routeActive(['advice']) ? 'active' : '' }>
            <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'advice') }>
                <Notification count={this.state.adviceNotifications.length}></Notification>
                <em className="fa fa-exclamation-triangle"></em>
                <span>Zalecenia</span>
            </div>
            <Collapse in={ this.state.collapse.advice } timeout={ 100 }>
                <ul id="trainers" className="nav sidebar-subnav">
                    <li className="sidebar-subnav-header">Zalecenia</li>
                    {linkItems}                    
                </ul>
            </Collapse>
        </li>);
    }

}

export default withRouter(AdvisorsList);

