import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadCodes, generateCode } from '../Common/promoCodesService';
import { loadTrainerInfo, loadTrainPlans, loadFeedPlans } from '../Common/trainerInfoService';


class PromoCodes extends React.Component {
	constructor(props, context) {
        super(props, context);
        let initialState = {
            codes:[],
            codesLoaded: false,
            newCodes:[],
            feedPlans:[],
            trainPlans:[],
            trainerInfo:{},
            trainerInfoLoaded: false,
            selectedTrainPlan:null,
            selectedFeedPlan:null,
        };
        this.state = initialState;        
    };

    componentDidMount(){
        loadCodes()
            .then(data => this.setState({codes: data, codesLoaded: true}));
        loadTrainerInfo()
        	.then(info => {
        		this.setState({trainerInfo: info, trainerInfoLoaded: true});
        		if(info.isTrainer && info.isTrainingsPromoCodesEnabled) {
        			loadTrainPlans()
        			.then(plans => this.setState({trainPlans: plans}));
        		}
        		if(info.isFeedCounsultant && info.isFeedPlansPromoCodesEnabled) {
        			loadTrainPlans()
        			.then(plans => this.setState({feedPlans: plans}));
        		}
        	});
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.data;
        newData[fieldName] = fieldVal
        this.setState({data: newData});
    }

    render() {  
    	let content = '';
    	let feedCodesContent = '';
    	let trainCodesContent = '';
        if(!this.state.trainerInfoLoaded){
            content = <div></div>
        } else {
        	if(this.state.trainerInfo.isFeedPlansPromoCodesEnabled){
        		trainCodesContent = <Panel>
        			<p>Kod na darmowy trening</p>
        			<p>Po wpisaniu prawidłowego kodu klient otrzyma gratis usługę, którą tutaj zdefiniujesz</p>
                    <Row>
                        <label className="col-lg-2 col-md-4 control-label text-right">Liczba treningów:</label>
                        <Col lg={ 10 } md={8}>
                         <FormControl componentClass="select" name="selectedTrainPlan" 
                            value={this.state.selectedTrainPlan}
                            onChange={this.handleChange.bind(this)}
                            className="form-control">
                            	{this.trainPlans.map(plan => <option value={plan}>{plan.trainsCount} treningów</option>)}
                            </FormControl>
                        </Col>
                    </Row>
                </Panel>;
        	}
        	if(this.state.trainerInfo.isTrainingsPromoCodesEnabled){
        		feedCodesContent = <Panel>
        			<p>Kod na darmową konsultację dietetyczną</p>
        			<p>Po wpisaniu prawidłowego kodu klient otrzyma gratis usługę, którą tutaj zdefiniujesz</p>
                    <Row>
                        <label className="col-lg-2 col-md-4 control-label text-right">Czas trwania usługi:</label>
                        <Col lg={ 10 } md={8}>
                         <FormControl componentClass="select" name="selectedFeedPlan" 
                            value={this.state.selectedFeedPlan}
                            onChange={this.handleChange.bind(this)}
                            className="form-control">
                            	{this.feedPlans.map(plan => <option value={plan}>{plan.weeks} tygodni</option>)}
                            </FormControl>
                        </Col>
                    </Row>
                </Panel>;
        	}
        }

        if(!feedCodesContent && !trainCodesContent){
        	content = <Well bsSize="large" style={{'textAlign':'center'}}>
				<p>Możesz włączyć kody rabatowe w panelu edycji strony trenera.</p>
          	</Well>
        }
        return (
        	<ContentWrapper>
                <h3>Kody rabatowe</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                   		<Well bsSize="large" style={{'textAlign':'center'}}>
                          	<h1><em className="fa fa-lightbulb-o"></em></h1>
                          	<p>Dzięki kodom rabatowym możesz łatwo docierać do klientów z ofertą promocyjną.</p>
							<p>Określ parametry, wygeneruj unikalny kod i umieść go w gotowym szablonie ulotki którą możesz od razu wydrukować lub zapisać w PDF.</p>
                      	</Well>
		              	{content}
		              	{feedCodesContent}
		              	{trainCodesContent}
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }
}