import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadUserAdvice, loadDefaultAdvice, saveAdvice } from '../Common/adviceService';

import TextEditor from '../Components/TextEditor'

let hideAlertSuccess = null;
let hideAlertError = null;

function saveDataFn(newData){
    saveAdvice(newData)
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

function setData(userData, me){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    me.setState({data: userData});
}

let saveHandler = null;

class Advice extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{},
            defaultAdvice:{}
        };
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
        }
        this.state = initialState;        
    };

    componentWillReceiveProps(nextProps) {
        var nextId = undefined;
        if(nextProps.match && nextProps.match.params){
            nextId = nextProps.match.params.id;
        }
        if(this.state.userId === nextId){
            return;
        }
        let me = this;
        this.setState({userId: nextId});
        loadUserAdvice(nextId)
            .then((data) => setData(data, me));
    }

    componentDidMount(){
        let me = this;
        loadUserAdvice(this.state.userId)
            .then((data) => setData(data, me));
        if(this.state.userId){
            //in that case we are in trainer mode;
            loadDefaultAdvice()
                .then((data) => {
                    me.setState({defaultAdvice: data});
                });
        }
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

    handlePlanChange(code){
        let newData = this.state.data;
        newData.plan = code;
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveDataFn(newData), 1000);        
        saveHandler();

    }

    render() {  
        if(!this.state.data.id){
            return <Panel></Panel>
        }
        let readonlyProps = {};
        let hideForUserStyle = {};
        let planControl = {};
        let sameInTrainingStyle = {};
        let notSameInTrainingStyle = {};
        if(this.state.userId){
            //Trainer
            if(!this.state.defaultAdvice.hasOwnProperty('fiber')){
                return <Panel></Panel>
            }
            planControl = <TextEditor label="Plan dietetyczny i treningowy" text={this.state.data.plan} 
                        onChange={this.handlePlanChange.bind(this)}></TextEditor>
        } else{
            //User
            readonlyProps = {readOnly: true};
            hideForUserStyle = {display:'none'};
            if(this.state.data.sameInTrainingDays){
                notSameInTrainingStyle = {display:'none'};
            }else{
                sameInTrainingStyle = {display:'none'};
            }   
            planControl = <fieldset>
                <div className="form-group">
                    <label className="col-lg-3 col-md-4 control-label">Plan dietetyczny i treningowy</label>
                    <Col lg={ 9 } md={ 8 }>
                      <div dangerouslySetInnerHTML={{ __html: this.state.data.plan }} />
                    </Col>
                </div>
            </fieldset>
        } 
        return (
              <Panel>
                    <form className="form-horizontal">     
                       <FormGroup className='form-inline'>
                            <label className="col-lg-3 col-md-4 control-label">Białko:</label>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder="0" 
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='protein'
                                    value={this.state.data.protein || 0}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> g</span>
                            </Col>
                        </FormGroup>
                        <FormGroup className='form-inline'>
                            <label className="col-lg-3 col-md-4 control-label">Węglowowany:</label>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder="0" 
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='carbo'
                                    value={this.state.data.carbo || 0}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> g</span>
                            </Col>
                        </FormGroup>
                        <FormGroup className='form-inline'>
                            <label className="col-lg-3 col-md-4 control-label">Tłuszcze:</label>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder="0" 
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='fat'
                                    value={this.state.data.fat || 0}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> g</span>
                            </Col>
                        </FormGroup>
                        <FormGroup className='form-inline'>
                            <label className="col-lg-3 col-md-4 control-label">Kalorie:</label>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder="0" 
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='calories'
                                    value={this.state.data.calories || 0}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> kCal</span>
                            </Col>
                        </FormGroup>

                        <FormGroup className='form-inline' style={this.state.userId || this.state.data.show_fiber ? {} : {display:'none'}}>
                            <div className="col-lg-3 col-md-4 text-right">
                                <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                    <input type="checkbox" name="bool:show_fiber" 
                                    {...readonlyProps}                                    
                                    className='needsclick'
                                    checked={this.state.data.show_fiber} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em>
                                </label>
                                <label className="control-label">Błonnik:</label>
                            </div>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder={this.state.defaultAdvice.fiber} 
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='fiber'
                                    value={this.state.data.fiber || ''}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> &nbsp;g</span>
                                    <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                        <input type="checkbox" name="default:fiber" 
                                        {...readonlyProps}
                                        className='needsclick'
                                        checked={this.state.data.fiber == this.state.defaultAdvice.fiber} 
                                        onChange={this.handleChange.bind(this)} />
                                        <em className="fa fa-check"></em>Standardowe zalecenie
                                    </label>
                            </Col>                            
                        </FormGroup>
                        <FormGroup className='form-inline' style={this.state.userId || this.state.data.show_sodium ? {} : {display:'none'}}>
                            <div className="col-lg-3 col-md-4 text-right">
                                <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                    <input type="checkbox" name="bool:show_sodium" 
                                    {...readonlyProps}
                                    className='needsclick'
                                    checked={this.state.data.show_sodium} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em>
                                </label>
                                <label className="control-label">Sód:</label>
                            </div>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder={this.state.defaultAdvice.sodium}
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='sodium'
                                    value={this.state.data.sodium || ''}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> mg</span>
                                    <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                        <input type="checkbox" name="default:sodium" 
                                        {...readonlyProps}
                                        className='needsclick'
                                        checked={this.state.data.sodium == this.state.defaultAdvice.sodium} 
                                        onChange={this.handleChange.bind(this)} />
                                        <em className="fa fa-check"></em>Standardowe zalecenie
                                    </label>
                            </Col>                            
                        </FormGroup>
                        <FormGroup className='form-inline' style={this.state.userId || this.state.data.show_potassium ? {} : {display:'none'}}>
                            <div className="col-lg-3 col-md-4 text-right">
                                <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                    <input type="checkbox" name="bool:show_potassium" 
                                    {...readonlyProps}
                                    className='needsclick'
                                    checked={this.state.data.show_potassium} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em>
                                </label>
                                <label className="control-label">Potas:</label>
                            </div>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder={this.state.defaultAdvice.potassium}
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='potassium'
                                    value={this.state.data.potassium || ''}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> mg</span>
                                    <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                        <input type="checkbox" name="default:potassium" 
                                        {...readonlyProps}
                                        className='needsclick'
                                        checked={this.state.data.potassium == this.state.defaultAdvice.potassium} 
                                        onChange={this.handleChange.bind(this)} />
                                        <em className="fa fa-check"></em>Standardowe zalecenie
                                    </label>
                            </Col>                            
                        </FormGroup>
                        <FormGroup className='form-inline' style={this.state.userId || this.state.data.show_calcium ? {} : {display:'none'}}>
                            <div className="col-lg-3 col-md-4 text-right">
                                <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                    <input type="checkbox" name="bool:show_calcium" 
                                    {...readonlyProps}
                                    className='needsclick'
                                    checked={this.state.data.show_calcium} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em>
                                </label>
                                <label className="control-label">Wapń:</label>
                            </div>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder={this.state.defaultAdvice.calcium}
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='calcium'
                                    value={this.state.data.calcium || ''}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> mg</span>
                                    <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                        <input type="checkbox" name="default:calcium" 
                                        {...readonlyProps}
                                        className='needsclick'
                                        checked={this.state.data.calcium == this.state.defaultAdvice.calcium} 
                                        onChange={this.handleChange.bind(this)} />
                                        <em className="fa fa-check"></em>Standardowe zalecenie
                                    </label>
                            </Col>                            
                        </FormGroup>
                        <FormGroup className='form-inline' style={this.state.userId || this.state.data.show_iron ? {} : {display:'none'}}>
                            <div className="col-lg-3 col-md-4 text-right">
                                <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                    <input type="checkbox" name="bool:show_iron" 
                                    {...readonlyProps}
                                    className='needsclick'
                                    checked={this.state.data.show_iron} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em>
                                </label>
                                <label className="control-label">Żelazo:</label>
                            </div>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder={this.state.defaultAdvice.iron}
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='iron'
                                    value={this.state.data.iron || ''}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> mg</span>
                                    <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                        <input type="checkbox" name="default:iron" 
                                        {...readonlyProps}
                                        className='needsclick'
                                        checked={this.state.data.iron == this.state.defaultAdvice.iron} 
                                        onChange={this.handleChange.bind(this)} />
                                        <em className="fa fa-check"></em>Standardowe zalecenie
                                    </label>
                            </Col>                            
                        </FormGroup>
                        <FormGroup className='form-inline' style={this.state.userId || this.state.data.show_vitaminC ? {} : {display:'none'}}>
                            <div className="col-lg-3 col-md-4 text-right">
                                <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                    <input type="checkbox" name="bool:show_vitaminC" 
                                    {...readonlyProps}
                                    className='needsclick'
                                    checked={this.state.data.show_vitaminC} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em>
                                </label>
                                <label className="control-label">Witamina C:</label>
                            </div>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder={this.state.defaultAdvice.vitaminC}
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='vitaminC'
                                    value={this.state.data.vitaminC || ''}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> mg</span>
                                    <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                        <input type="checkbox" name="default:vitaminC" 
                                        {...readonlyProps}
                                        className='needsclick'
                                        checked={this.state.data.vitaminC == this.state.defaultAdvice.vitaminC} 
                                        onChange={this.handleChange.bind(this)} />
                                        <em className="fa fa-check"></em>Standardowe zalecenie
                                    </label>
                            </Col>                            
                        </FormGroup>
                        <FormGroup className='form-inline' style={this.state.userId || this.state.data.show_vitminA ? {} : {display:'none'}}>
                            <div className="col-lg-3 col-md-4 text-right">
                                <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                    <input type="checkbox" name="bool:show_vitminA" 
                                    {...readonlyProps}
                                    className='needsclick'
                                    checked={this.state.data.show_vitminA} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em>
                                </label>
                                <label className="control-label">Witamina A:</label>
                            </div>
                            <Col lg={ 9 } md={ 8 }>
                                 <FormControl type="number" placeholder={this.state.defaultAdvice.vitminA}
                                    className="form-control mr short-input" {...readonlyProps}
                                    name='vitminA'
                                    value={this.state.data.vitminA || ''}
                                    onChange={this.handleChange.bind(this)}/> 
                                    <span> µg</span>
                                    <label className="checkbox-inline c-checkbox" style={hideForUserStyle}>
                                        <input type="checkbox" name="default:vitminA" 
                                        {...readonlyProps}
                                        className='needsclick'
                                        checked={this.state.data.vitminA == this.state.defaultAdvice.vitminA} 
                                        onChange={this.handleChange.bind(this)} />
                                        <em className="fa fa-check"></em>Standardowe zalecenie
                                    </label>
                            </Col>                            
                        </FormGroup>

                        <FormGroup style={sameInTrainingStyle}>                              
                              <Col lg={ 3 } md={ 4 } className='text-right'>
                                  <div className="radio c-radio" style={hideForUserStyle}>
                                      <label>
                                          <input type="radio" name="sameInTrainingDays" 
                                          checked={this.state.data.sameInTrainingDays} 
                                          value={true}
                                          onChange={this.handleChange.bind(this)} />
                                          <em className="fa fa-circle"></em>
                                      </label>
                                  </div>
                              </Col>
                              <label className="col-lg-9 col-md-8">Zastosuj te zalecenia również w dni treningowe</label>
                        </FormGroup>
                        <FormGroup style={notSameInTrainingStyle}>                              
                              <Col lg={ 3 } md={ 4 } className='text-right'>
                                  <div className="radio c-radio" style={hideForUserStyle}>
                                      <label>
                                          <input type="radio" name="sameInTrainingDays" 
                                          checked={!(this.state.data.sameInTrainingDays)} 
                                          value={false}
                                          onChange={this.handleChange.bind(this)} />
                                          <em className="fa fa-circle"></em>
                                      </label>
                                  </div>
                              </Col>
                              <label className="col-lg-9 col-md-8">W dni treningowe podnieś wartości kcal, B, W, T proporcjonalnie do zwiększonego zapotrzebowania kCal</label>
                        </FormGroup>

                        {planControl}                        

                        <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                            Dane zapisane poprawnie.
                        </div>  
                        <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                            Nie udało się zapisać dane.
                        </div>
                    </form>
                </Panel>
        );
    }

}

export default Advice;

