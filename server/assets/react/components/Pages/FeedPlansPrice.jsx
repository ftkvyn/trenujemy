import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { saveTarget, loadTargets, loadPlans, savePlan } from '../Common/feedPlanService';

let saveHandlers = {};
let hideAlertSuccess = null;
let hideAlertError = null;

function savePlanFn(plan){
    savePlan(plan)
    .then(function(){
        $('.saveError').hide();
        $('.saveSuccess').show();
        clearTimeout(hideAlertSuccess);
        hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
    })
    .catch(function(){
        $('.saveSuccess').hide();
        $('.saveError').show();
        clearTimeout(hideAlertError);
        hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
    });
}

function saveTargetFn(data){
    saveTarget(data)
    .then(function(){
        $('.saveError').hide();
        $('.saveSuccess').show();
        clearTimeout(hideAlertSuccess);
        hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
    })
    .catch(function(){
        $('.saveSuccess').hide();
        $('.saveError').show();
        clearTimeout(hideAlertError);
        hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
    });
}

class FeedPlansPrice extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        let initialState = {
            plans:[],
            targets:[]
        };
        this.state = initialState;        
    }

    componentDidMount(){
        let me = this;
        loadTargets()
            .then((data) => me.setState({targets: data}));
        loadPlans()
            .then((data) => me.setState({plans: data}));
    }

    handleTargetChange(targetId, event) {
        let targets = this.state.targets.map((item) => item);
        let targetItem = targets.find((item) => (item.id == targetId));
        
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        if(fieldName != 'name'){
          fieldVal = event.target.checked;
        }
        targetItem[fieldName] = fieldVal;
        
        let num = targets.indexOf(targetItem);        
        let newItems = [          
          ...targets.slice(0, num),
          targetItem,
          ...targets.slice(num+1)
        ];
        this.setState({targets: newItems});

        const handlerKey = 'target_' + targetId;
        if(saveHandlers[handlerKey]){
            saveHandlers[handlerKey].clear();
        }
        saveHandlers[handlerKey] = debounce(() => saveTargetFn(targetItem), 500);        
        saveHandlers[handlerKey]();
    }

    handlePlanChange(planId, event) {
        let plans = this.state.plans.map((item) => item);
        let planItem = plans.find((item) => (item.id == planId));
        
        let fieldName = event.target.name;
        let fieldVal = event.target.value;

        planItem[fieldName] = fieldVal;
        
        let num = plans.indexOf(planItem);        
        let newItems = [          
          ...plans.slice(0, num),
          planItem,
          ...plans.slice(num+1)
        ];
        this.setState({plans: newItems});

        const handlerKey = 'plan_' + planId;
        if(saveHandlers[handlerKey]){
            saveHandlers[handlerKey].clear();
        }
        saveHandlers[handlerKey] = debounce(() => savePlanFn(planItem), 500);        
        saveHandlers[handlerKey]();
    }

    changePlanVisibility(month, event){
         let checked = event.target.checked;

         let plans = this.state.plans.map((item) => item);

         let planItem1 = plans.find((item) => (item.months == month) && (item.isWithConsulting == true));
         let planItem2 = plans.find((item) => (item.months == month) && (item.isWithConsulting == false));

         planItem1.isVisible = checked;
         planItem2.isVisible = checked;

         let num = plans.indexOf(planItem1);        
         let newItems = [          
          ...plans.slice(0, num),
          planItem1,
          ...plans.slice(num+1)
         ];

         num = plans.indexOf(planItem2);        
         newItems = [          
          ...plans.slice(0, num),
          planItem2,
          ...plans.slice(num+1)
         ];
         this.setState({plans: newItems});

         let handlerKey = 'plan_' + planItem1.id;
          if(saveHandlers[handlerKey]){
              saveHandlers[handlerKey].clear();
          }
          saveHandlers[handlerKey] = debounce(() => savePlanFn(planItem1), 500);        
          saveHandlers[handlerKey]();

          handlerKey = 'plan_' + planItem2.id;
          if(saveHandlers[handlerKey]){
              saveHandlers[handlerKey].clear();
          }
          saveHandlers[handlerKey] = debounce(() => savePlanFn(planItem2), 500);        
          saveHandlers[handlerKey]();
    }

    render() {      
        const months = [1,2,3,6]; 
        const monthWords = ['miesiąc', 'miesiący', 'miesiący', 'miesięcy']; 
        let plansMapped = [];
        if(this.state.plans.length){
          plansMapped = months.map((month, num) => {
              const monthPlans = {
                month : month,
                word: monthWords[num]
              } ;
              monthPlans.noConsult = this.state.plans.find((item) => (item.months == month) && !item.isWithConsulting);
              monthPlans.withConsult = this.state.plans.find((item) => (item.months == month) && item.isWithConsulting);
              return monthPlans;
          });
        }
        return (
            <ContentWrapper>
                <h3>Cennik planów żywieniowych</h3>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                        <Panel>
                          <form className="form-horizontal">     
                              <legend>Cele:</legend>
                              {this.state.targets.map((target) => <FormGroup key={target.id}>
                                  <Col lg={ 1 } md={2} sm={2} xs={2}>
                                    <div className="checkbox c-checkbox pull-right">
                                        <label>
                                            <input type="checkbox" name="isVisible" 
                                            checked={target.isVisible} 
                                            onChange={this.handleTargetChange.bind(this, target.id)} />
                                            <em className="fa fa-check"></em>
                                        </label>
                                    </div>
                                </Col>
                                <Col lg={ 9 } md={10} sm={10} xs={10}>
                                    <FormControl type="text" placeholder="Cel" 
                                      className="form-control"
                                      name='name'
                                      value={target.name || ''}
                                      onChange={this.handleTargetChange.bind(this, target.id)}/>
                                </Col>
                              </FormGroup> )}
                          </form>
                      </Panel>
                    </Col>


                  {plansMapped.map((item) => <Col lg={6} md={12} sm={12} xs={12} key={item.month}>
                        <Panel>
                          <form className="form-horizontal">     
                              <legend>{item.month} {item.word}:</legend>
                              <FormGroup>
                                <label className="col-lg-4 col-md-4 control-label">Plan jest widoczny na stronie:</label>
                                <Col lg={ 8 } md={8}>
                                    <div className="checkbox c-checkbox">
                                        <label>
                                            <input type="checkbox" name="isVisible" 
                                            checked={item.noConsult.isVisible && item.withConsult.isVisible} 
                                            onChange={this.changePlanVisibility.bind(this, item.month)} />
                                            <em className="fa fa-check"></em>
                                        </label>
                                    </div>
                                </Col>
                              </FormGroup>
                              <legend>Dieta + plan treningowy</legend>
                              <FormGroup className='form-inline'>
                                <label className="col-lg-4 col-md-4 control-label">Cena skreślona</label>
                                <Col lg={ 8 } md={ 8 }>
                                     <FormControl type="number" placeholder="Cena skreślona" 
                                        className="form-control"
                                        name='priceOld'
                                        value={item.noConsult.priceOld || ''}
                                        onChange={this.handlePlanChange.bind(this, item.noConsult.id)}/> 
                                        <span> PLN</span>
                                </Col>
                              </FormGroup>
                              <FormGroup className='form-inline'>
                                <label className="col-lg-4 col-md-4 control-label">Cena</label>
                                <Col lg={ 8 } md={ 8 }>
                                     <FormControl type="number" placeholder="Cena" 
                                        className="form-control"
                                        name='price'
                                        value={item.noConsult.price || ''}
                                        onChange={this.handlePlanChange.bind(this, item.noConsult.id)}/> 
                                        <span> PLN</span>
                                </Col>
                              </FormGroup>

                              <legend>Dieta + plan treningowy + bieżąca codzienna konsultacja</legend>
                              <FormGroup className='form-inline'>
                                <label className="col-lg-4 col-md-4 control-label">Cena skreślona</label>
                                <Col lg={ 8 } md={ 8 }>
                                     <FormControl type="number" placeholder="Cena skreślona" 
                                        className="form-control"
                                        name='priceOld'
                                        value={item.withConsult.priceOld || ''}
                                        onChange={this.handlePlanChange.bind(this, item.withConsult.id)}/> 
                                        <span> PLN</span>
                                </Col>
                              </FormGroup>
                              <FormGroup className='form-inline'>
                                <label className="col-lg-4 col-md-4 control-label">Cena</label>
                                <Col lg={ 8 } md={ 8 }>
                                     <FormControl type="number" placeholder="Cena" 
                                        className="form-control"
                                        name='price'
                                        value={item.withConsult.price || ''}
                                        onChange={this.handlePlanChange.bind(this, item.withConsult.id)}/> 
                                        <span> PLN</span>
                                </Col>
                              </FormGroup>
                          </form>
                      </Panel>
                    </Col>
                 )}
                </Row>
                <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                    Dane zapisane poprawnie.
                </div>  
                <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                    Nie udało się zapisać dane.
                </div>
            </ContentWrapper>
        );
    }

}

export default FeedPlansPrice;


