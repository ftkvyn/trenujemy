import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';

function destroyDp(){
    if($('#datetimepicker').data("DateTimePicker")) {
        $('#datetimepicker').data("DateTimePicker").destroy();
        $('#datetimepicker input').val(null);
        $('#datetimepicker').off('dp.change');
        $('#datetimepicker *').off('dp.change');
    }
}

function setDatepicker(){
    destroyDp();
    $('#datetimepicker').datetimepicker({
        icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-crosshairs',
            clear: 'fa fa-trash'
      },
      format:'DD.MM.YYYY',
      keepOpen: false,
      defaultDate: new Date()
    });
    $("#datetimepicker").on("dp.change",  (e) => {
        let newDate = e.date.toDate().toISOString().substring(0,10);
        if(newDate){
          this.props.history.push(this.state.diaryRoot + '/' + newDate);
        }
    });        
}

class Diary extends React.Component {

    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{
                bodySize:{},
                customDate:''
            }
        };
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            initialState.userId = this.props.match.params.id;
            initialState.diaryRoot = `/clients/${initialState.userId}/diary`;            
        }else{
            initialState.diaryRoot = this.props.diaryRoot;
        }
        if(this.isCustomDate(this.props.match.params.day)){
          initialState.customDate = this.props.match.params.day;
        }
        this.state = initialState; 
        if(!this.props.match.params.day){
          this.props.history.push(initialState.diaryRoot + '/today/');
        }               
    }

    componentDidMount(){
        setTimeout(setDatepicker.call(this));        
    }

    componentWillUnmount(){
        destroyDp();
    }

    componentWillReceiveProps(nextProps) {
      if(this.isCustomDate(nextProps.match.params.day)){
        this.setState({customDate: nextProps.match.params.day});
      }else{
        this.setState({customDate: ''});
      }
      if(this.props.match.params.day != nextProps.match.params.day){
        $('#datetimepicker').data("DateTimePicker").hide();
      }
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        let currentPath = this.props.location.pathname;
        for (var i = paths.length - 1; i >= 0; i--) {
            if(currentPath == paths[i]){
                return true;
            }
        }
        return false;
    }

    isCustomDate(day) {
        if(day != 'today' && day != 'yesterday' && day != 'tomrrow' && day != 'beforeyesterday'){
          return true;
        }
        return false;
    }
    
    render() {  
        if(!this.props.match.params.day){

        }
        return (
          <div>
            <h3>
              <Link to={this.state.diaryRoot + "/beforeyesterday/"}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/beforeyesterday/") ? 'btn-primary' : 'btn-default') }>
                  Przedwczoraj
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/yesterday/"}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/yesterday/") ? 'btn-primary' : 'btn-default') }>
                  Wczoraj
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/today/"}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/today/") ? 'btn-primary' : 'btn-default') }>
                  Dzisiaj
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/tomrrow/"}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/tomrrow/") ? 'btn-primary' : 'btn-default') }>
                  Jutro
                </button>  
              </Link> 
              <a>
                <button type="button" 
        className={"mb-sm mr-sm btn select-date-btn btn-outline " + (this.isCustomDate(this.props.match.params.day) ? 'btn-primary' : 'btn-default') }>
                  <span>{this.state.customDate}</span>
                  <div id="datetimepicker" className="input-group date">
                      <input type="text" name='selectedDate' className='date-input'/>
                      <span className="input-group-addon">
                        <span className="fa fa-calendar"></span>
                      </span>                      
                  </div>
                </button>  
              </a>
            </h3>


            <Panel>
                <form className="form-horizontal">     
                  <p>{this.props.location.pathname}</p>
                  <b>{this.props.match.params.day || 'no day'}</b>
                  <Route path={this.state.diaryRoot  + "/:day/"} render={props => (
                                <div>
                                  <b>{props.match.params.day}</b><br/>
                                  <i>{props.location.pathname}</i>
                                </div>
                              )}/>
                </form>
            </Panel>
        </div>
        );
    }

}

export default withRouter(Diary);

