import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import {loadDay, saveDay, saveTraining} from '../Common/diaryService'

function setDay(dayData){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    const dayDataFlat = dayData;
    delete dayDataFlat.bodySize;
    delete dayDataFlat.trainings;
    this.setState({data: dayDataFlat, trainings: dayData.trainings || []});
}

let saveHandler = null;

let hideAlertSuccess = null;
let hideAlertError = null;

function saveDataFn(newData){
    saveDay(newData)
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


class DiaryDay extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{},
            trainings:[],
        };
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
            initialState.day = this.props.match.params.day;
        }
        this.state = initialState;        
    };

    componentWillReceiveProps(nextProps) {
        let nextDay = undefined;
        if(nextProps.match && nextProps.match.params){
            nextDay = nextProps.match.params.day;
        }
        if(this.state.day === nextDay){
            return;
        }
        this.setState({day: nextDay, data:{}, trainings: []});
        loadDay(nextDay, this.state.userId)
          .then((data) => setDay.call(this, data));
    }

    componentDidMount(){
        loadDay(this.state.day, this.state.userId)
          .then((data) => setDay.call(this, data));
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.data;
        newData[fieldName] = fieldVal
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveDataFn(newData), 1000);        
        saveHandler();
    }

    render() {  
        if(this.state.data.noData){
          return <p>Nie ma danych od użytkownika odnośnie tego dnia.</p>
        }
        if(!this.state.data.id){
          return <div></div>
        }
        let readonlyForUser = {};
        let readonlyForTrainer = {};
        if(this.state.userId){
          readonlyForTrainer = {readOnly: true};
        }else{
          readonlyForUser = {readOnly: true};
        }
        return (
              <form className="form-horizontal">
                <FormGroup>
                    <label className="col-lg-12 text-center">Twoje uwagi dotyczące tego dnia (pytania do trenera, komentarze):</label>
                    <Col lg={ 12 }>
                        <textarea 
                        className="form-control" 
                        name='userNotes' {...readonlyForTrainer}
                        value={this.state.data.userNotes || ''}
                        onChange={this.handleChange.bind(this)}></textarea>
                    </Col>
                </FormGroup>  

                <FormGroup>
                    <label className="col-lg-12 text-center">Uwagi trenera do Twojego dnia:</label>
                    <Col lg={ 12 }>
                        <textarea 
                        className="form-control" 
                        name='trainerNotes' {...readonlyForUser}
                        value={this.state.data.trainerNotes || ''}
                        onChange={this.handleChange.bind(this)}></textarea>
                    </Col>
                </FormGroup>  
                 <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                    Dane zapisane poprawnie.
                </div>  
                <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                    Nie udało się zapisać dane.
                </div>
              </form>
        );
    }

}

export default withRouter(DiaryDay);

