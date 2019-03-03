import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadCodes, generateCode, rememberCodes } from '../Common/promoCodesService';
import { loadTrainerInfo, loadTrainPlans, loadFeedPlans } from '../Common/trainerInfoService';


class PromoCodes extends React.Component {
	constructor(props, context) {
        super(props, context);
        let initialState = {
            codes:[],
            codesLoaded: false,
            newTrainCodes:[],
            newFeedCodes:[],
            feedPlans:[],
            trainPlans:[],
            trainerInfo:{},
            trainerInfoLoaded: false,
            selectedTrainPlan:'',
   	        selectedFeedPlan:'',
            generatingCodes: false,
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
        			.then(plans => this.setState({trainPlans: plans, selectedTrainPlan: plans.length? plans[0].id:''}));
        		}
        		if(info.isFeedCounsultant && info.isFeedPlansPromoCodesEnabled) {
        			loadFeedPlans()
        			.then(plans => this.setState({feedPlans: plans, selectedFeedPlan: plans.length? plans[0].id:''}));
        		}
        	});
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = {};
        newData[fieldName] = fieldVal
        this.setState(newData);
    }

    generateCode(model, initial){
    	if(!initial && model.trainPlan && this.state.newTrainCodes.length > 5) {
    		this.setState({generatingCodes: false});
    		return;
    	}
    	if(!initial && model.feedPlan && this.state.newFeedCodes.length > 5) {
    		this.setState({generatingCodes: false});
    		return;
    	}
    	generateCode(model)
    	.then((newCode) => {
    		if(newCode.trainPlan){
    			const newCodes = [...this.state.newTrainCodes, newCode];
    			this.setState({newTrainCodes: newCodes});
    		}else if (newCode.feedPlan){
    			const newCodes = [...this.state.newFeedCodes, newCode];
    			this.setState({newFeedCodes: newCodes});
    		}
    		this.generateCode(model);
    	})
    	.catch((err) => {
    		console.error(err);
    		this.setState({generatingCodes: false});
    	})
    }

    addTrainingCodes(){
    	if(this.state.generatingCodes){
    		return;
    	}
    	if(!this.state.selectedTrainPlan){
    		return;
    	}
    	this.setState({generatingCodes: true, newTrainCodes: []});
    	this.generateCode({trainPlan: this.state.selectedTrainPlan}, true);
    }

    addFeedCodes(){
    	if(this.state.generatingCodes){
    		return;
    	}
    	if(!this.state.selectedFeedPlan){
    		return;
    	}
    	this.setState({generatingCodes: true, newFeedCodes: []});
    	this.generateCode({feedPlan: this.state.selectedFeedPlan}, true);
    }

    printFeedCodes(){
    	if(this.state.generatingCodes){
    		return;
    	}
    	const codeIds = this.state.newFeedCodes.map(code => code.id);
    	rememberCodes(codeIds)
    	.then(() => {
            const iframe = document.getElementById('printFrame');
            iframe.src = '/printCodes';
  		})
        .catch((err) => console.error(err));
    }

    printTrainCodes(){
    	if(this.state.generatingCodes){
    		return;
    	}
    	const codeIds = this.state.newTrainCodes.map(code => code.id);
    	rememberCodes(codeIds)
    	.then(() => {
	    	const iframe = document.getElementById('printFrame');
            iframe.src = '/printCodes';
  		})
        .catch((err) => console.error(err));;
    }

    render() {  
    	let content = '';
    	let feedCodesContent = '';
    	let trainCodesContent = '';
    	let printTrainCodes = '';
    	let printFeedCodes = '';
    	let disabledAttrs = {};
    	if(this.state.generatingCodes){
    		disabledAttrs = {disabled: "disabled"};
    	}
    	if(this.state.newTrainCodes.length > 5){
    		printTrainCodes = <Row>
            	<Col lg={12}>
            		<div  {...disabledAttrs} onClick={this.printTrainCodes.bind(this)} className='btn btn-outline btn-primary'>Wydrukuj kody</div>
            	</Col>
            </Row>
    	}
    	if(this.state.newFeedCodes.length > 5){
    		printFeedCodes = <Row>
            	<Col lg={12}>
            		<div  {...disabledAttrs} onClick={this.printFeedCodes.bind(this)} className='btn btn-outline btn-primary'>Wydrukuj kody</div>
            	</Col>
            </Row>
    	}
        if(!this.state.trainerInfoLoaded){
            content = <div></div>
        } else {
        	if(this.state.trainerInfo.isTrainingsPromoCodesEnabled && this.state.trainerInfo.isTrainer){
        		trainCodesContent = <Panel>
        			<p>Kod na darmowy trening</p>
        			<p>Po wpisaniu prawidłowego kodu klient otrzyma gratis usługę, którą tutaj zdefiniujesz</p>
                    <Row>
                        <label className="col-lg-4 col-md-6 control-label text-left">Liczba treningów:</label>
                    </Row>
                    <Row>
                        <Col lg={ 4 } md={ 6 }>
                         <FormControl componentClass="select" name="selectedTrainPlan" 
                            value={this.state.selectedTrainPlan}
                            onChange={this.handleChange.bind(this)}
                            className="form-control">
                            	{this.state.trainPlans.map(plan => <option key={plan.id} value={plan.id}>{plan.trainsCount}</option>)}
                            </FormControl>
                        </Col>
                    </Row>
                    <Row>
                    	<Col lg={12}>
                    		<div {...disabledAttrs} onClick={this.addTrainingCodes.bind(this)} className='btn btn-outline btn-primary'>Generuj kody</div>
                    	</Col>
                    </Row>
                    <Row>
                    	{this.state.newTrainCodes.map(newCode => 
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 promo-code-box" key={newCode.id}>
                        	<label className='promo-code-value'>{newCode.value}</label>
                        </div>
                        )}
                    </Row>
                    {printTrainCodes}
                </Panel>;
        	}
        	if(this.state.trainerInfo.isFeedPlansPromoCodesEnabled && this.state.trainerInfo.isFeedCounsultant){
        		feedCodesContent = <Panel>
        			<p>Kod na darmową konsultację dietetyczną</p>
        			<p>Po wpisaniu prawidłowego kodu klient otrzyma gratis usługę, którą tutaj zdefiniujesz</p>
                    <Row>
                        <label className="col-lg-4 col-md-6 control-label text-left">Czas trwania usługi:</label>
                     </Row>
                     <Row>
                        <Col lg={ 4 } md={ 6 }>
                         <FormControl componentClass="select" name="selectedFeedPlan" 
                            value={this.state.selectedFeedPlan}
                            onChange={this.handleChange.bind(this)}
                            className="form-control">
                            	{this.state.feedPlans.map(plan => <option key={plan.id} value={plan.id}>{plan.weeks} {plan.word}</option>)}
                            </FormControl>
                        </Col>
                    </Row>
                    <Row>
                    	<Col lg={12}>
                    		<div  {...disabledAttrs} onClick={this.addFeedCodes.bind(this)} className='btn btn-outline btn-primary'>Generuj kody</div>
                    	</Col>
                    </Row>
                    <Row>
                    	{this.state.newFeedCodes.map(newCode => 
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 promo-code-box" key={newCode.id}>
                        	<label className='promo-code-value'>{newCode.value}</label>
                        </div>
                        )}
                    </Row>
                    {printFeedCodes}
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
                        <iframe id='printFrame' style={{width: "0", height: "0", border:"none", display: "hidden"}}></iframe>
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }
}

export default PromoCodes;