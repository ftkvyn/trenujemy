import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import SidebarRun from './Sidebar.run';

class TrainerMenu extends React.Component {
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
        return ();
    }

}

export default withRouter(TrainerMenu);

