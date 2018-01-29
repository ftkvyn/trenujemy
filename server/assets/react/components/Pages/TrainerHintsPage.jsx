import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';

class TrainerHintsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            
        };
        this.state = initialState;        
    };

    componentDidMount(){
        // loadUser()
        //     .then((data) => {
        //         if(data.user.role == 'trainer'){
        //             this.props.history.push('/profile');
        //             return;
        //         }
        //         this.setState({user: data.user});
        //     });
        // loadPurchases()
        //     .then((data) => this.setState({goods: data, goodsLoaded: true}));
    }

    handleChange(event) {
        // let fieldName = event.target.name;
        // let newData = this.state.data;
        // if(fieldName.indexOf('bool:') > -1){
        //     fieldName = fieldName.replace('bool:','');
        //     newData[fieldName] = event.target.checked;
        // }else if(fieldName.indexOf('default:') > -1){
        //     fieldName = fieldName.replace('default:','');
        //     newData[fieldName] = this.state.defaultAdvice[fieldName];
        // }else{
        //     let fieldVal = event.target.value;
        //     if(fieldName == 'sameInTrainingDays'){
        //         fieldVal = '' + fieldVal == 'true';
        //     }
        //     newData[fieldName] = fieldVal
        // }
        // this.setState({data: newData});

        // if(saveHandler){
        //     saveHandler.clear();
        // }
        // saveHandler = debounce(() => saveDataFn(newData), 1000);        
        // saveHandler();
    }

    render() {  
        
        return (
        	<ContentWrapper>
                <h3>Szablony zaleceń</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                   		<Well bsSize="large" style={{'textAlign':'center'}}>
                          	<h1><em className="fa fa-lightbulb-o"></em></h1>
                          	<p>Edycja szablonów gotowych zaleceń do klienta. Zalecamy każdorazowe edytowanie odpowiedzi przed jej wysłaniem i traktowanie szablonów jako ułatwienie codziennej pracy a nie jako gotowe odpowiedzi.</p>
                      	</Well>
		              	<Panel>
                        
		                </Panel>
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default TrainerHintsPage;

