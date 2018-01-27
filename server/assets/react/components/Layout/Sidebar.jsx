import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import SidebarRun from './Sidebar.run';
import TrainerMenu from './TrainerMenu';
import UserMenu from './UserMenu';
import { loadUser } from '../Common/userDataService';

class Sidebar extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            user: {},
            collapse: {
                singleview: this.routeActive(['singleview']),
                submenu: this.routeActive(['submenu'])
            }
        };
        let me = this;
        loadUser()
        .then(function(userData) {              
            me.setState({user: userData.user});
        });
    };

    componentDidMount() {
        // pass navigator to access router api
        SidebarRun(this.navigator.bind(this));
    }

    navigator(route) {
        this.props.router.push(route)
    }

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
        let menu = <ul></ul>
        if(this.state.user.role == 'user'){
            menu = <UserMenu></UserMenu>
        }else if(this.state.user.role == 'trainer'){
            menu = <TrainerMenu></TrainerMenu>
        }
        return (
            <aside className='aside'>
                { /* START Sidebar (left) */ }
                <div className="aside-inner">
                    <nav data-sidebar-anyclick-close="" className="sidebar">
                        { /* START sidebar nav */ }
                        {menu}
                        { /* END sidebar nav */ }
                    </nav>
                </div>
                { /* END Sidebar (left) */ }
            </aside>
            );
    }

}

export default withRouter(Sidebar);

