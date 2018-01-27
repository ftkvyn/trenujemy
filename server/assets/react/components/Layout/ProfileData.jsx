import React from 'react';
import pubsub from 'pubsub-js';
import { Collapse } from 'react-bootstrap';
import {loadUser, saveUser} from '../Common/userDataService';

class ProfileData extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            user: {},
            userBlockCollapse: true,
        };
        let me = this;
        loadUser()
          .then(function(userData) {              
              me.setState({user: userData.user});
          })
    };

    componentWillUnmount() {
        // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
        pubsub.unsubscribe(this.pubsub_token);
    }

    render() {        
        return (
            <li className="has-user-block">
                <Collapse id="user-block" in={ this.state.userBlockCollapse }>
                    <div>
                        <div className="item user-block">
                            { /* User picture */ }
                            <div className="user-block-picture">
                                <div className="user-block-status">
                                    <img src={this.state.user.profilePic || this.props.defaultProfilePic} 
                                    alt="Avatar" width="60" height="60" className="img-thumbnail img-circle" />
                                    <div className="circle circle-success circle-lg"></div>
                                </div>
                            </div>
                            { /* Name and Job */ }
                            <div className="user-block-info">
                                <span className="user-block-name">
                                    { this.state.user.name }
                                </span>
                                <span className="user-block-name">
                                    { this.state.user.login }
                                </span>
                                <a href='/auth/logout'>Wyloguj</a>
                            </div>
                        </div>
                    </div>
                </Collapse>
            </li>
        );
    }

}

export default ProfileData;

