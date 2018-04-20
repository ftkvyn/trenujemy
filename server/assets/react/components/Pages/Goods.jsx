import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { loadUser, loadPurchases } from '../Common/userDataService';
import GoodsInfo from '../Components/GoodsInfo'
import { loadNotifications, saveNotifications  } from '../Common/notificationsService';
import WelcomeScreen from '../Components/WelcomeScreen';

class Goods extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            user:{},
            goods:{},
            goodsLoaded: false,
            notifications: {},
            dontRemind: false
        };
        this.state = initialState;        
    };

    componentDidMount(){
        loadUser()
            .then((data) => {
                if(data.user.role == 'trainer'){
                    this.props.history.push('/profile');
                    return;
                }
                this.setState({user: data.user});
            });
        loadPurchases()
            .then((data) => this.setState({goods: data, goodsLoaded: true}));
        loadNotifications()
            .then((data) => this.setState({notifications: data}));
    }

    componentWillUnmount(){
        if(this.state.notifications.id){
            saveNotifications({id: this.state.notifications.id, newPurchase: false});
        }
    }

    handleNotificationsCheckbox(event){
        let newValue = !this.state.dontRemind;
        this.setState({dontRemind: newValue});
        let model = Object.assign({}, this.state.notifications);
        if(typeof model.trainingInfo == 'boolean'){
            model.trainingInfo = !newValue;
        }else{
            delete model.trainingInfo;
        }
        if(typeof model.feedInfo == 'boolean'){
            model.feedInfo = !newValue;
        }else{
            delete model.feedInfo;
        }
        if(typeof model.consultInfo == 'boolean'){
            model.consultInfo = !newValue;
        }else{
            delete model.consultInfo;
        }

        saveNotifications(model);
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

    render() {  
        let purchasedFeedPlanItem = '';
        let trains = [];
        if(!this.state.goodsLoaded){
            return <div></div>
        }
        let infoPanel = '';
        let helloPopup = '';
        if(this.state.notifications.id){
            let infoPanelContent = null;
            let notify = this.state.notifications;
            if(notify.helloMessage){
                helloPopup = helloPopup = <WelcomeScreen role={this.state.user.role}></WelcomeScreen>
                // infoPanelContent = <div className='hello-message'>
                //     <p>Witaj w swoim panelu!</p>
                //     <br/>
                //     <p>Aby w pełni korzystać z jego możliwości wykup jedną z usług dostępnych <a href='/'>na stronie</a>.</p>
                // </div>
            }
            let startText = <p>Witaj w swoim panelu!</p>
            if(notify.newPurchase){
                startText = <p>Dziękuję za dokonanie zakupu!</p>
            }
            if(notify.trainingInfo && notify.feedInfo){
                infoPanelContent = <div className='hello-message'>
                    {startText}
                    <br/>
                    <p>W tym miejscu będziemy wspólnie wymieniać się informacjami w ramach naszej współpracy. Otrzymasz ode mnie pełny plan żywieniowo-treningowy. Codziennie podzielisz się ze mną szczegółami swojego dnia a ja udzielę Ci wyczerpującej konsultacji - wspólnie osiągniemy cel!</p>
                    <br/>
                    <p>Po każdym treningu ze mną będziesz mógł/mogła podzielić się ze mną swoimi spostrzeżeniemi a ja udzielę Ci wyczerpującej odpowiedzi. </p>
                    <br/>
                    <p>Aby kontynuować uzupełnij teraz odpowiednie formularze ("Moje dane" oraz "Ankieta"). Dzięki temu lepiej dopasuję Twój plan do Twoich indywidualnych potrzeb.</p>
                </div>
            }else{
                if(notify.trainingInfo){
                    infoPanelContent = <div className='hello-message'>
                        {startText}
                        <br/>
                        <p>W tym miejscu będziemy wspólnie wymieniać się informacjami w ramach naszej współpracy. Po każdym treningu będziesz mógł/mogła podzielić się ze mną swoimi spostrzeżeniemi a ja udzielę Ci wyczerpującej odpowiedzi. </p>
                        <br/>
                        <p>Aby kontynuować uzupełnij teraz odpowiednie formularze ("Moje dane" oraz "Ankieta"). Dzięki temu będę w stanie lepiej dopasować trening do Twoich potrzeb.</p>
                    </div>
                }
                if(notify.feedInfo){
                    if(notify.consultInfo){
                        infoPanelContent = <div className='hello-message'>
                            {startText}
                            <br/>
                            <p>W tym miejscu będziemy wspólnie wymieniać się informacjami w ramach naszej współpracy. Otrzymasz od mnie pełny plan żywieniowo-treningowy. Codziennie podzielisz się ze mną szczegółami swojego dnia a ja udzielę Ci wyczerpującej konsultacji - wspólnie osiągniemy cel!</p>
                            <br/>
                            <p>Aby kontynuować uzupełnij teraz odpowiednie formularze ("Moje dane" oraz "Ankieta"). Dzięki temu lepiej dopasuję Twój plan do Twoich indywidualnych potrzeb.</p>
                        </div>
                    }else{
                        infoPanelContent = <div className='hello-message'>
                            {startText}
                            <br/>
                            <p>W tym miejscu będziemy wspólnie wymieniać się informacjami w ramach naszej współpracy. Otrzymasz od mnie pełny plan żywieniowo-treningowy. Trzymając się go z pewnością osiągniesz zamierzony cel!</p>
                            <br/>
                            <p>Aby kontynuować uzupełnij teraz odpowiednie formularze ("Moje dane" oraz "Ankieta"). Dzięki temu lepiej dopasuję Twój plan do Twoich indywidualnych potrzeb.</p>
                        </div>
                    }
                }
            }

            if(infoPanelContent){
                infoPanel = <Well bsSize="large" style={{'textAlign':'center'}}>
                    {infoPanelContent}
                    <div className='text-right'>
                        <label htmlFor='dontRemind' className='pointer' style={{margin: '9px 10px 0 0'}}>Nie przypominaj mi o tym następnym razem</label>
                        <div className="checkbox c-checkbox pull-right">
                            <label>
                                <input type="checkbox" name="dontRemind" id='dontRemind'
                                checked={this.state.dontRemind} 
                                onChange={this.handleNotificationsCheckbox.bind(this)} />
                                <em className="fa fa-check"></em>
                            </label>
                        </div>
                    </div>
                </Well>
            }
        }
        return (
        	<ContentWrapper>
                <h3>Panel klienta</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                   		<Well bsSize="large" style={{'textAlign':'center'}}>
                          	<h1><em className="fa fa-line-chart"></em></h1>
                          	<p>Witaj w panelu klienta. Poniżej znajdziesz podstawowe informacje dotyczące Twojego konta.</p>
                      	</Well>
		              	<Panel>
		                    <Row>
	                            <label className="col-lg-2 col-md-4 control-label text-right">Adres email:</label>
	                            <Col lg={ 10 } md={8}>
	                                {this.state.user.login}
	                            </Col>
		                    </Row>
                            <GoodsInfo goods={this.state.goods}></GoodsInfo>
		                </Panel>

                        {infoPanel}
                        {helloPopup}
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default withRouter(Goods);

