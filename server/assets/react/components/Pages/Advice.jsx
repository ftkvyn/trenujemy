import React from 'react';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadUserAdvice, loadDefaultAdvice, saveAdvice } from '../Common/adviceService';
import { updateNotifications, saveNotifications, loadNotifications } from '../Common/notificationsService';
import { loadAdviceTemplates } from '../Common/adviceTemplateService';

import TextEditor from '../Components/TextEditor'

let hideAlertSuccess = null;
let hideAlertError = null;
let unmounting = false;

function saveDataFn(newData){
    saveAdvice(newData)
    .then(function(){
        if(unmounting) return;
        $('.saveError').hide();
        $('.saveSuccess').show();
        clearTimeout(hideAlertSuccess);
        hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
    })
    .catch(function(){
        if(unmounting) return;
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

function clearTrainerAdviceNotification(){
    if(!this.state.userId){
        if(this.state.notifications.id && this.state.notifications.advices.length){
          let advices = this.state.notifications.advices;

          if(advices.some( adv => adv == this.state.trainerId )){
            let newAdvices = advices.filter( adv => adv != this.state.trainerId);
            let model = {id: this.state.notifications.id, advices: newAdvices};
            saveNotifications(model);
            updateNotifications({advices: newAdvices});
            let notifications = this.state.notifications;
            notifications.advices = newAdvices;
            this.setState({notifications: notifications});
          }              
        }        
    }
}

let saveHandler = null;

class Advice extends React.Component {
    constructor(props, context) {
        super(props, context);
        unmounting = false;
        let initialState = {
            data:{},
            trainerId: this.props.trainerId,
            defaultAdvice:{},
            templates:[],
            notifications:{
                advices: []
            }
        };
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
        }
        this.state = initialState;        
    };

    componentWillReceiveProps(nextProps) {
        var nextUserId = undefined;
        var nextTrainerId = undefined;
        if(nextProps.match && nextProps.match.params){
            nextUserId = nextProps.match.params.id;
        }
        if(nextProps.trainerId){
            nextTrainerId = nextProps.trainerId;
        }
        if( (this.state.userId === nextUserId) && (nextTrainerId === this.state.trainerId) ){
            return;
        }
        let me = this;
        this.setState({userId: nextUserId, trainerId: nextTrainerId});
        loadUserAdvice(nextUserId || nextTrainerId)
            .then((data) => setData(data, me));
        loadAdviceTemplates()
                .then((data) => this.setState({templates: data})); 
        clearTrainerAdviceNotification.call(this);
    }

    componentWillUnmount(){
        unmounting = true;
        clearTrainerAdviceNotification.call(this);
    }

    componentDidMount(){
        let me = this;
        loadUserAdvice(this.state.userId || this.state.trainerId)
            .then((data) => setData(data, me));
        if(this.state.userId){
            //in that case we are in trainer mode;
            loadDefaultAdvice()
                .then((data) => {
                    me.setState({defaultAdvice: data});
                });
            loadAdviceTemplates()
                .then((data) => this.setState({templates: data})); 
        }else{
          loadNotifications()
          .then(data => {     
              let model = Object.assign({}, this.state.notifications);  
              if(data.advices){
                model.advices = data.advices;
              }      
              model.id = data.id; 
              this.setState({notifications: model});
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

    useAdviseTemplate(event){
      let fieldVal = event.target.value;
      let template = this.state.templates.find((i) => i.id == fieldVal);
      if(template){
        let newData = this.state.data;
        newData.plan = template.text;
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveDataFn(newData), 200);        
        saveHandler();
      }
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
        let adviseTemplates = "";        
        if(this.state.userId){
            //Trainer
            if(!this.state.defaultAdvice.hasOwnProperty('fiber')){
                return <Panel></Panel>
            }
            if(this.state.templates.length){
                adviseTemplates = <FormControl componentClass="select" name="answer" 
                    value={'none'}
                    onChange={this.useAdviseTemplate.bind(this)}
                    className="form-control">
                        <option value='none'>Wybierz szablon zalecenia</option>
                        {this.state.templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}
                    </FormControl>
            }
            planControl = <TextEditor label="Plan dietetyczny i treningowy" text={this.state.data.plan} 
                        onExit={this.handlePlanChange.bind(this)} onBlur={this.handlePlanChange.bind(this)}></TextEditor>
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

                        {adviseTemplates}
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

