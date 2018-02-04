import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { loadUser, loadPurchases } from '../Common/userDataService';
import GoodsInfo from '../Components/GoodsInfo'

class Goods extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            user:{},
            goods:{},
            goodsLoaded: false
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
        let additionalGoods = '';
        let trains = [];
        if(!this.state.goodsLoaded){
            return <div></div>
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
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default withRouter(Goods);

