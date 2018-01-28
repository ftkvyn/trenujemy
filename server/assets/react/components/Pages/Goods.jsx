import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadUser, loadPurchases } from '../Common/userDataService';

class Goods extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            user:{},
            goods:{},
            goodsLoaded: false
        };
        this.state = initialState;        
    };

    componentDidMount(){
        let me = this;
        loadUser()
            .then((data) => this.setState({user: data.user}));
        loadPurchases()
            .then((data) => this.setState({goods: data, goodsLoaded: true}));
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let newData = this.state.data;
        if(fieldName.indexOf('bool:') > -1){
            fieldName = fieldName.replace('bool:','');
            newData[fieldName] = event.target.checked;
        }else if(fieldName.indexOf('default:') > -1){
            fieldName = fieldName.replace('default:','');
            newData[fieldName] = this.state.defaultAdvice[fieldName];
        }else{
            let fieldVal = event.target.value;
            if(fieldName == 'sameInTrainingDays'){
                fieldVal = '' + fieldVal == 'true';
            }
            newData[fieldName] = fieldVal
        }
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveDataFn(newData), 1000);        
        saveHandler();
    }

    render() {  
        let purchasedFeedPlanItem = '';
        let trains = [];
        if(this.state.goodsLoaded){
            console.log(this.state.goods);
            if(!this.state.goods.feedPlan && !this.state.goods.trainPlans){
                purchasedFeedPlanItem = <Row className='list-group-item'>
                    <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
                    <Col lg={ 10 } md={8}>
                        Brak
                    </Col>
                </Row>
            }else {
                if(this.state.goods.feedPlan){
                    if(this.state.goods.feedPlan.plan.isWithConsulting){
                        purchasedFeedPlanItem = <div className='list-group-item'><Row>
                            <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
                            <Col lg={ 10 } md={8}>
                                Plan dietetyczny, plan treningowy + codzienna konsultacja
                            </Col>
                        </Row>
                        <Row>
                            <label className="col-lg-2 col-md-4 control-label text-right">Termin ważności:</label>
                            <Col lg={ 10 } md={8}>
                                <span>{this.state.goods.feedPlan.validFromStr}</span> do <span>{this.state.goods.feedPlan.validToStr}</span>
                            </Col>
                        </Row></div>
                    }else{
                        purchasedFeedPlanItem = <div className='list-group-item'><Row>
                            <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
                            <Col lg={ 10 } md={8}>
                                Plan dietetyczny + plan treningowy
                            </Col>
                        </Row>
                        <Row>
                            <label className="col-lg-2 col-md-4 control-label text-right">Termin ważności:</label>
                            <Col lg={ 10 } md={8}>
                                <span>{this.state.goods.feedPlan.validFromStr}</span> do <span>{this.state.goods.feedPlan.validToStr}</span>
                            </Col>
                        </Row></div>
                    }
                }
                if(this.state.goods.trainPlans && this.state.goods.trainPlans.length){
                    for(let i = 0; i < this.state.goods.trainPlans.length; i++){
                        let train = this.state.goods.trainPlans[i];
                        let existingTrain = trains.find( (item) => item.plan.id == train.plan.id);
                        if(existingTrain){
                            existingTrain.trainsLeft += train.trainsLeft;
                        }else{
                            trains.push(Object.assign({}, train));
                        }
                    }
                }
            }
        }
        return (
        	<ContentWrapper>
                <h3>Panel klienta</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                   		<Well bsSize="large" style={{'textAlign':'center'}}>
                          	<h1><em className="fa fa-line-chart"></em></h1>
                          	<p>Witaj w panelu klienta. Poniżej znajdziesz podstawowe informacje dotyczące Twojego konta.</p>
                      	</Well>
		              	<Panel>
		                    <Row>
	                            <label className="col-lg-2 col-md-4 control-label text-right">Adres email:</label>
	                            <Col lg={ 10 } md={8}>
	                                {this.state.user.login}
	                            </Col>
		                    </Row>
                            <div className='list-group mb0'>
		                        {purchasedFeedPlanItem}
                                {trains.map( (item, num) => <div key={num} className='list-group-item'><Row>
                                    <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
                                    <Col lg={ 10 } md={8}>
                                        {item.plan.name}
                                    </Col>
                                </Row>
                                <Row>
                                    <label className="col-lg-2 col-md-4 control-label text-right">Termin ważności:</label>
                                    <Col lg={ 10 } md={8}>
                                        {item.validToStr}
                                    </Col>
                                </Row>
                                <Row>
                                    <label className="col-lg-2 col-md-4 control-label text-right">Do wykorzystania</label>
                                    <Col lg={ 10 } md={8}>
                                        Treinigów: <b>{item.trainsLeft}</b>&nbsp;&nbsp;<a type="button" href='/#trainings' className="btn btn-xs btn-primary">Wykup dodatkowe treningi</a>
                                    </Col>
                                </Row></div>)}
                            </div>
		                </Panel>
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default Goods;

