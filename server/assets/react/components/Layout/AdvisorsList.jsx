import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { loadAdvisors } from '../Common/adviceService';

class AdvisorsList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                advice: this.routeActive(['advice']),
            },
            trainers: []
        };
        let me = this;
        loadAdvisors()
        .then(function(trainers) {              
            me.setState({trainers: trainers});
        });
    };

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
            return <li className={ this.routeActive('/advice/' + trainer.id) ? 'active' : '' } key={trainer.id} >
                <Link to={"/advice/" + trainer.id} title={trainerName}>
                <span>{trainerName}</span>
                </Link>
            </li>});
        return (
            <li className={ this.routeActive(['advice']) ? 'active' : '' }>
            <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'advice') }>
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

