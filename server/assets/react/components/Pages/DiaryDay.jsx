import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import {loadDay, saveDay, saveTraining} from '../Common/diaryService'

function setDay(dayData){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    this.setState({data: dayData, trainings: dayData.trainings || []});
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

    render() {  
        return (
              <div>
                <b>{this.props.match.params.day}</b><br/>
                <b>{this.props.match.params.id}</b><br/>
                <i>{this.props.location.pathname}</i><br/>
                <p>Loaded data. DayId={this.state.data.id}, UserId={this.state.data.user}, date={this.state.data.date}</p>
              </div>
        );
    }

}

export default withRouter(DiaryDay);

