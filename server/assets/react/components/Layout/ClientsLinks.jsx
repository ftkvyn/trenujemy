import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { loadClients } from '../Common/clientsService';

class ClientsLinks extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapse: {
                clients: this.routeActive(['clients']),
            },
            clients: []
        };
        let me = this;
        loadClients()
        .then(function(clients) {              
            me.setState({clients: clients});
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
        const linkItems = this.state.clients.map((client) => {
            const clientName = client.name || client.login;
           return <li className={ this.routeActive('/clients/' + client.id) ? 'active' : '' } key={client.id} >
                <Link to={"/clients/" + client.id} title={clientName}>
                <span>{clientName}</span>
                </Link>
            </li>});
        return (
            <li className={ this.routeActive(['clients']) ? 'active' : '' }>
            <div className="nav-item" onClick={ this.toggleItemCollapse.bind(this, 'clients') }>
                <em className="icon-user"></em>
                <span>Klienci</span>
            </div>
            <Collapse in={ this.state.collapse.clients } timeout={ 100 }>
                <ul id="clients" className="nav sidebar-subnav">
                    {linkItems}                    
                </ul>
            </Collapse>
        </li>);
    }

}

export default withRouter(ClientsLinks);

