import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadHours, saveHour } from '../Common/trainHoursService';

const days = [1,2,3,4,5,6,7];
const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
const dayNames = ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'];

class TrainingsHours extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        const initHours = days.map((day) => {return {
          dayOfWeek: day,
          fromTime: 0,
          toTime: 0
        }});
        let initialState = {
            hours:initHours
        };
        this.state = initialState;        
    }

    componentDidMount(){
        let me = this;
        loadHours()
            .then((data) => me.setState({hours: data}));
    }


    handleChange(day, event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let dayItem = this.state.hours.find((item) => item.dayOfWeek == day);
        let num = this.state.hours.indexOf(dayItem);
        dayItem[fieldName] = fieldVal;
        saveHour(dayItem)
          .then(function(data) {
            // body...
          });
        let newItems = [          
          ...this.state.hours.slice(0, num),
          dayItem,
          ...this.state.hours.slice(num+1)
        ];
        this.setState({hours: newItems});
    }

    render() {          
        return (
            <ContentWrapper>
                <h3>Godziny treningów</h3>                
                      {days.map((day) => <Row key={day}>
                        <Col lg={6} md={6} sm={6} xs={12}>
                        <div className="panel widget">
                         <div className="panel-body text-center">
                            <h3 className="mt0">{dayNames[day - 1]}</h3>
                         </div>
                      </div>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12}>
                        <div className="panel widget">
                         <div className="panel-body text-center">
                         <FormGroup className='form-inline'>
                            <FormControl componentClass="select" name="fromTime" 
                            value={this.state.hours.find((item) => item.dayOfWeek == day).fromTime || ''}
                            onChange={this.handleChange.bind(this, day)}
                            style={{'width':'120px'}}
                            className="form-control">
                                {hours.map((hour) => <option value={hour} key={hour}>{hour + ':00'}</option>)}
                            </FormControl>
                            ==>
                            <FormControl componentClass="select" name="toTime" 
                            value={this.state.hours.find((item) => item.dayOfWeek == day).toTime || ''}
                            onChange={this.handleChange.bind(this, day)}
                            style={{'width':'120px'}}
                            className="form-control">
                                {hours.map((hour) => <option value={hour} key={hour}>{hour + ':00'}</option>)}
                            </FormControl>
                          </FormGroup>
                         </div>
                      </div>
                    </Col>
                  </Row>)}                
            </ContentWrapper>
        );
    }

}

export default TrainingsHours;

