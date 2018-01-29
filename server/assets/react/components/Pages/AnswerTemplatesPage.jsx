import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';

class AnswerTemplatesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            
        };
        this.state = initialState;        
    };

    componentDidMount(){
        $('[data-scrollable]').slimScroll({
            height: ($('[data-scrollable]').data('height') || 200)
        });
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

    removeItem(id){

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
                <h3>Szablony odpowiedzi</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                   		<Well bsSize="large" style={{'textAlign':'center'}}>
                          	<h1><em className="fa fa-comments-o"></em></h1>
                          	<p>Edycja szablonów gotowych odpowiedzi do klienta. Zalecamy każdorazowe edytowanie odpowiedzi przed jej wysłaniem i traktowanie szablonów jako ułatwienie codziennej pracy a nie jako gotowe odpowiedzi.</p>
                      	</Well>
		              	<Panel>
                            <Row>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <div className='template-textarea'>
                                        <textarea maxLength='800'
                                        placeholder='Treść szablonu odpowiedzi'
                                        className="form-control"></textarea>
                                        <label className="col-lg-12 control-label text-right">Maks. 800 znaków</label>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    { /* START list group */ }
                                    <div data-height="200" data-scrollable="" className="list-group">
                                        { /* START list group item */ }
                                        <div className="list-group-item">
                                            <div className="media-box">
                                                <div className="media-box-body clearfix">
                                                    <span className="mb-sm">
                                                        Cras sit amet nibh libero, in gravida nulla. Nulla...
                                                    </span>
                                                    <div className="pull-right">
                                                        <em className="fa fa-trash pointer" onClick={this.removeItem.bind(this, 1)} />
                                                    </div>
                                                </div>                                                
                                            </div>
                                        </div>
                                        { /* END list group item */ }
                                    </div>
                                </Col>
                            </Row>
		                </Panel>
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default AnswerTemplatesPage;

