import React from 'react';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';

const GoodsInfo = (props) => {
	let purchasedFeedPlanItem = '';
    let trains = [];
    if(!props.goods.feedPlan && !props.goods.trainPlans){
        purchasedFeedPlanItem = <Row className='list-group-item'>
            <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
            <Col lg={ 10 } md={8}>
                Brak
            </Col>
        </Row>
    }else {
        if(props.goods.feedPlan){
            if(props.goods.feedPlan.plan.isWithConsulting){
                purchasedFeedPlanItem = <div className='list-group-item'>
                <Row>
                    <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
                    <Col lg={ 10 } md={8}>
                        Plan dietetyczny + codzienna konsultacja
                    </Col>
                </Row>
                <Row>
                    <label className="col-lg-2 col-md-4 control-label text-right">Konsultant:</label>
                    <Col lg={ 10 } md={8}>
                        {props.goods.feedPlan.trainer.name}
                    </Col>
                </Row>
                <Row>
                    <label className="col-lg-2 col-md-4 control-label text-right">Termin ważności:</label>
                    <Col lg={ 10 } md={8}>
                        <span>{props.goods.feedPlan.validFromStr}</span> do <span>{props.goods.feedPlan.validToStr}</span>
                    </Col>
                </Row></div>
            }else{
                purchasedFeedPlanItem = <div className='list-group-item'><Row>
                    <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
                    <Col lg={ 10 } md={8}>
                        Plan dietetyczny
                    </Col>
                </Row>
                <Row>
                    <label className="col-lg-2 col-md-4 control-label text-right">Konsultant:</label>
                    <Col lg={ 10 } md={8}>
                        {props.goods.feedPlan.trainer.name}
                    </Col>
                </Row>
                <Row>
                    <label className="col-lg-2 col-md-4 control-label text-right">Termin ważności:</label>
                    <Col lg={ 10 } md={8}>
                        <span>{props.goods.feedPlan.validFromStr}</span> do <span>{props.goods.feedPlan.validToStr}</span>
                    </Col>
                </Row></div>
            }
        }
        if(props.goods.trainPlans && props.goods.trainPlans.length){
            for(let i = 0; i < props.goods.trainPlans.length; i++){
                let train = props.goods.trainPlans[i];
                let existingTrain = trains.find( (item) => item.plan.id == train.plan.id);
                if(existingTrain){
                    existingTrain.trainsLeft += train.trainsLeft;
                }else{
                    trains.push(Object.assign({}, train));
                }
            }
        }
    }
    if(props.onlyTrainings){
    	purchasedFeedPlanItem = '';
    }
    let purchaseButton = '';
    if(!props.noPurchaseButton){
    	purchaseButton = <a type="button" href='/#trainings' className="btn btn-xs btn-primary">Wykup dodatkowe treningi</a>
    }

  	return <div className='list-group mb0'>
        {purchasedFeedPlanItem}
        {trains.map( (item, num) => <div key={num} className='list-group-item'>
        <Row>
            <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
            <Col lg={ 10 } md={8}>
                {item.plan.name}
            </Col>
        </Row>
        <Row>
            <label className="col-lg-2 col-md-4 control-label text-right">Trener:</label>
            <Col lg={ 10 } md={8}>
                {item.trainer.name}
            </Col>
        </Row>
        <Row>
            <label className="col-lg-2 col-md-4 control-label text-right">Telefon trenera:</label>
            <Col lg={ 10 } md={8}>                
                <a href={"tel:" + item.trainer.phone }>
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <span> {item.trainer.phone} </span>
                    <i className="fa fa-phone" aria-hidden="true"></i>
                </a>
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
                Treinigów: <b>{item.trainsLeft}</b>&nbsp;&nbsp;{purchaseButton}
            </Col>
        </Row></div>)}        
    </div>
}

export default GoodsInfo;