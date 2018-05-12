import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well, Pagination, Table } from 'react-bootstrap';
import { loadTransactions } from '../Common/transactionsService';
import moment from 'moment';

function paginate (array, page_size, page_number) {
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

const monthes = [
'Styczeń',
'Luty',
'Marzec',
'Kwiecień',
'Maj',
'Czerwiec',
'Lipiec',
'Sierpień',
'Wrzesień',
'Październik',
'Listopad',
'Grudzień',
];

class TransactionsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            items: [],
            page: 1,
            totalPages: 0,
            pageSize: 10,
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth() + 1
        };
        let startYear = 2018;
        let years = [startYear];
        for(var i = startYear; i < initialState.year; i++){
            years.push(i);
        }
        initialState.years = years;
        this.state = initialState;        
    };

    handlePageSelect(num) {
        this.setState({
            page: num
        });
    }

    handleChange(event){
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let oldState = this.state;
        oldState[fieldName] = fieldVal;
        this.setState(oldState, this.loadData.bind(this));
    }

    loadData(){
        loadTransactions(this.state.year, this.state.month)
            .then((data) => {
                const totalPages = Math.ceil(data.length / this.state.pageSize);
                this.setState({items: data, totalPages: totalPages});
            });
    }

    componentDidMount(){
        this.loadData();
    }

    render() {  
        const displayItems = paginate(this.state.items, this.state.pageSize, this.state.page - 1);
        const monthName = this.state.month == 'all' ? '' : monthes[this.state.month - 1] + ' ';
        const totalSum = this.state.items.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0) || 0;
        const provision = totalSum / 10;
        const income = totalSum - provision;
        return (
            <ContentWrapper>
                <h3>Rozliczenia</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                        <Well bsSize="large" style={{'textAlign':'center'}}>
                            <h1><em className="fa fa-chart-line"></em></h1>
                            <p>Lista transakcyj</p>
                        </Well>
                        <Panel>
                            <p>Pokaż transakcję</p>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <FormGroup>
                                        <label className="col-lg-3 col-md-4 control-label">Rok</label>
                                        <Col lg={ 9 } md={ 8 }>
                                            <FormControl componentClass="select" name="year" 
                                            value={this.state.year}
                                            onChange={this.handleChange.bind(this)}
                                            className="form-control">
                                                {this.state.years.map(year => <option value={year} key={year}>{year}</option>)}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                </Col>                                
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <FormGroup>
                                        <label className="col-lg-3 col-md-4 control-label">Miesiąc</label>
                                        <Col lg={ 9 } md={ 8 }>
                                            <FormControl componentClass="select" name="month" 
                                            value={this.state.month}
                                            onChange={this.handleChange.bind(this)}
                                            className="form-control">
                                                <option value='all'>wszystkie
                                                </option>
                                                {monthes.map( (month, num) => <option value={num + 1} key={num}>{month}</option>)}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Well>
                                <p>{monthName}{this.state.year}</p>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Suma wpłat od klientów:</td>
                                            <td>{ (totalSum/100).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>Prowizja serwisu + prowizja Płatności24: &nbsp;&nbsp;</td>
                                            <td>{ (provision/100).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h3>Twój dochód:</h3>
                                            </td>
                                            <td>
                                                <h3>{ (income/100).toFixed(2)}</h3>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Well>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Kwota</th>
                                        <th>Tytuł wpłaty</th>
                                        <th>Wpłacający</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayItems.map(item => <tr key={item.id}>
                                        <td>{ moment(item.createdAt).format('DD-MM-YYYY') }</td>
                                        <td>{ (item.amount / 100).toFixed(2) }</td>
                                        <td>{ item.title }</td>
                                        <td>{ item.user.name || item.user.login }</td>
                                    </tr>)}  
                                </tbody>
                            </Table>
                            <Pagination bsSize="medium" items={ this.state.totalPages } 
                            activePage={ this.state.page } onSelect={ this.handlePageSelect.bind(this) } />                            
                        </Panel>
                    </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default TransactionsPage;

