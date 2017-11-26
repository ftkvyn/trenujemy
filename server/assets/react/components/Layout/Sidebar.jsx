import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import SidebarRun from './Sidebar.run';
import ProfileData from './ProfileData';

class Sidebar extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                singleview: this.routeActive(['singleview']),
                submenu: this.routeActive(['submenu'])
            }
        };
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
        let panelName = 'Panel';
        return (
            <aside className='aside'>
                { /* START Sidebar (left) */ }
                <div className="aside-inner">
                    <nav data-sidebar-anyclick-close="" className="sidebar">
                        { /* START sidebar nav */ }
                        <ul className="nav">
                            <ProfileData></ProfileData>
                            { /* Iterates over all sidebar items */ }
                            <li className="nav-heading ">
                                <span data-localize="sidebar.heading.HEADER">{ panelName }</span>
                            </li>

                            <li className={ this.routeActive('singleview') ? 'active' : '' }>
                                <Link to="singleview" title="Single View">
                                <em className="icon-grid"></em>
                                <span data-localize="sidebar.nav.SINGLEVIEW">Single View</span>
                                </Link>
                            </li>

                            <li className={ this.routeActive(['submenu']) ? 'active' : '' }>
                                <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'submenu') }>
                                    <div className="pull-right label label-info">1</div>
                                    <em className="icon-speedometer"></em>
                                    <span data-localize="sidebar.nav.MENU">Menu</span>
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

                        </ul>
                        { /* END sidebar nav */ }
                    </nav>
                </div>
                { /* END Sidebar (left) */ }
            </aside>
            );
    }

}

export default withRouter(Sidebar);

