import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadUserHints } from '../Common/hintsService';
import { updateNewHintsCount } from '../Common/notificationsService';
import moment from 'moment';

class UserHintsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            items: []
        };
        this.state = initialState;        
    };

    componentDidMount(){
        loadUserHints()
            .then((data) => {
                this.setState({items: data});
                let newHintsCount = data.filter(item => !item.isRead ).length;
                updateNewHintsCount(newHintsCount);
            });
    }

    componentWillUnmount(){
        updateNewHintsCount(0);
    }

    render() {  
        return (
            <ContentWrapper>
                <h3>Ciekawostki od trenera</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                        <Well bsSize="large" style={{'textAlign':'center'}}>
                            <h1><em className="fa fa-lightbulb-o"></em></h1>
                            <p>W tym miejscu Twój trener będzie Ci przesyłał wskazówki i ciekawostki dotyczące odżywiania i sportu.</p>
                        </Well>
                        <Panel>
                            {this.state.items.map(item => <Row key={item.id} className={item.isRead ? 'user-hint read' : 'user-hint not-read'}>
                                <Col lg={ 12 } >
                                    <h4 className='text-center'>{moment(item.createdAt).format('DD-MM-YYYY')}</h4>
                                    <Well className='user-hint-container'>
                                        <div className="user-hint-label label label-danger">1</div>
                                        <p>{item.text}</p>
                                    </Well>
                                </Col>
                            </Row>)}                            
                        </Panel>
                    </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default UserHintsPage;

