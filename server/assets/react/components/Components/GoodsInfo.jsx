import React from 'react';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';

const GoodsInfo = (props) => {
	let purchasedFeedPlanItem = '';
    let additionalGoods = '';
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
                purchasedFeedPlanItem = <div className='list-group-item'><Row>
                    <label className="col-lg-2 col-md-4 control-label text-right">Wykupiona usługa:</label>
                    <Col lg={ 10 } md={8}>
                        Plan dietetyczny, plan treningowy + codzienna konsultacja
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
                        Plan dietetyczny + plan treningowy
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
            additionalGoods = <div>
                <hr/>
                <h3 className='text-center'>Proponowane pozostałe usługi w panelu:</h3>
                <Row className='text-center'>
                    <Col lg={ 6 } md={6} sm={6} xs={12}>
                        <h4>Plany dietetyczne i treningowe</h4>
                        <a type="button" href='/#feedPlans' className="btn btn-primary">Zamów</a>
                    </Col>
                    <Col lg={ 6 } md={6} sm={6} xs={12}>
                        <h4>Codzienna konsultacja</h4>
                        <a type="button" href='/#feedPlans' className="btn btn-primary">Zamów</a>
                    </Col>
                </Row>
            </div>
        }
    }
    if(props.onlyTrainings){
    	purchasedFeedPlanItem = '';
    	additionalGoods = '';
    }
    let purchaseButton = '';
    if(!props.noPurchaseButton){
    	purchaseButton = <a type="button" href='/#trainings' className="btn btn-xs btn-primary">Wykup dodatkowe treningi</a>
    }

  	return <div className='list-group mb0'>
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
                Treinigów: <b>{item.trainsLeft}</b>&nbsp;&nbsp;{purchaseButton}
            </Col>
        </Row></div>)}
        {additionalGoods}
    </div>
}

export default GoodsInfo;