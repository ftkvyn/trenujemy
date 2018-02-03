import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadAllPlans, savePlan } from '../Common/trainPlanService';

let saveHandler = null;
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

class TrainingsPrice extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        let initialState = {
            plans:[]
        };
        this.state = initialState;        
    }

    componentDidMount(){
        let me = this;
        loadAllPlans()
            .then((data) => me.setState({plans: data}));
    }

    handleChange(planId, event) {
        let plans = this.state.plans.map((item) => item);
        let planItem = plans.find((item) => item.id == planId);
        
        let fieldName = event.target.name;
        if(fieldName.indexOf('bool:') > -1){
            fieldName = fieldName.replace('bool:','');
            if(fieldName == 'isRecomended'){
              let oldRecomended = plans.find((item) => item.isRecomended);              
              if(oldRecomended){
                let recNum = plans.indexOf(oldRecomended);      
                oldRecomended.isRecomended = false;
                savePlan(oldRecomended)
                 .then(function(){
                  });
                plans = [          
                  ...plans.slice(0, recNum),
                  oldRecomended,
                  ...plans.slice(recNum+1)
                ];
              }
            }
            planItem[fieldName] = event.target.checked;
        }else{
          let fieldVal = event.target.value;
          planItem[fieldName] = fieldVal;
        }
        
        let num = plans.indexOf(planItem);        
        let newItems = [          
          ...plans.slice(0, num),
          planItem,
          ...plans.slice(num+1)
        ];
        this.setState({plans: newItems});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => savePlanFn(planItem), 500);        
        saveHandler();
    }

    render() {  
        return (
            <ContentWrapper>
                <h3>Cennik treningów</h3>
                <Row>
                  {this.state.plans.map((plan) => <Col key={plan.id} lg={3} md={4} sm={6} xs={12}>
                        <div className="panel widget">
                         <div className="panel-body text-center">
                            <FormGroup>
                                <Col lg={ 12 }>
                                    <FormControl type="text" placeholder="Nazwa" 
                                    className="form-control" 
                                    name='name'
                                    value={plan.name || ''}
                                    onChange={this.handleChange.bind(this, plan.id)}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col lg={ 12 }>
                                    <FormControl type="number" placeholder="Cena skreślona" 
                                    className="form-control"
                                    name='priceOld'
                                    value={plan.priceOld || ''}
                                    onChange={this.handleChange.bind(this, plan.id)}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col lg={ 12 }>
                                    <FormControl type="number" placeholder="Cena" 
                                    className="form-control"
                                    name='price'
                                    value={plan.price || ''}
                                    onChange={this.handleChange.bind(this, plan.id)}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col lg={ 12 }>
                                    <textarea 
                                    className="form-control" 
                                    name='description'
                                    value={plan.description || ''}
                                    onChange={this.handleChange.bind(this, plan.id)}></textarea>
                                </Col>
                            </FormGroup>

                            <FormGroup className='clearfix'>
                                <Col lg={ 12 }>
                                    <FormControl type="number" placeholder="Liczba treningów" 
                                    className="form-control"
                                    name='trainsCount'
                                    value={plan.trainsCount || 0}
                                    onChange={this.handleChange.bind(this, plan.id)}/>
                                </Col>
                            </FormGroup>
                            <hr/>
                            <FormGroup className='clearfix'>
                              <label className="col-lg-6 col-md-6 col-sm-6 col-xs-6 control-label">Widoczne na stronie</label>
                              <Col lg={ 6 } md={ 6 } sm={6} xs={6}>
                                  <div className="checkbox c-checkbox">
                                      <label>
                                          <input type="checkbox" name="bool:isActive" 
                                          checked={plan.isActive} 
                                          onChange={this.handleChange.bind(this, plan.id)} />
                                          <em className="fa fa-check"></em>
                                      </label>
                                  </div>
                              </Col>
                            </FormGroup>
                            <hr/>
                            <FormGroup  className='clearfix'>
                              <label className="col-lg-6 col-md-6 col-sm-6 col-xs-6 control-label">Opcja rekomendowana:</label>
                              <Col lg={ 6 } md={ 6 } sm={6} xs={6}>
                                  <div className="radio c-radio">
                                      <label>
                                          <input type="radio" name="bool:isRecomended" 
                                          checked={plan.isRecomended} 
                                          onChange={this.handleChange.bind(this, plan.id)} />
                                          <em className="fa fa-circle"></em>
                                      </label>
                                  </div>
                              </Col>
                          </FormGroup>
                         </div>
                      </div>
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

export default TrainingsPrice;

