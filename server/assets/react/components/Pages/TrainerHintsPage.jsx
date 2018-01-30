import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadHints, saveHint, removeHint, addHint, loadSendHints, saveSendHints } from '../Common/hintsService';


let hideAlertSuccess = null;
let hideAlertError = null;

let saveHandler = null;


function saveDataFn(itemId, text){
    saveHint(itemId, text)
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

class TrainerHintsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            newItemName: '',
            selectedItemId: null,
            templateText: '',
            sendHints: false,
            items: []
        };
        this.state = initialState;        
    };

    componentDidMount(){
        $('[data-scrollable]').slimScroll({
            height: ($('[data-scrollable]').data('height') || 200)
        });
        loadHints()
            .then((data) => {
                if(data.length){
                    this.setState({items: data, selectedItemId:data[0].id, templateText:data[0].text});
                }else{
                    this.setState({items: data});
                }
            });
        loadSendHints()
            .then((data) => this.setState({sendHints: data.value}))
    }

    selectItem(id){
        let item = this.state.items.find((i) => i.id == id);
        this.setState({selectedItemId:id, templateText: item.text});
    }

    removeItem(id, event){
        event.stopPropagation();
        removeHint(id)
             .then((data) => {
                    let itemNum = this.state.items.findIndex((item) => item.id == data.id);
                    let items = [
                        ...this.state.items.slice(0, itemNum),
                        ...this.state.items.slice(itemNum + 1)];
                    let selectedId = this.state.selectedItemId;
                    let templateText = this.state.templateText;
                    if(this.state.selectedItemId == id){
                        if(items.length){
                            selectedId = items[0].id;
                            templateText = items[0].text;
                        }else{
                            selectedId = null;
                            templateText = '';
                        }
                    }
                    this.setState({items: items, selectedItemId: selectedId, templateText: templateText});
                });
    }

    onFormSubmit(event){
        this.addNewItem();
        event.preventDefault();
        return false;
    }

    addNewItem(){
        if(!this.state.newItemName){
            return;
        }
        const name = this.state.newItemName;
        this.setState({newItemName: ''});
        addHint(name)
             .then((item) => {
                    let items = [item, ...this.state.items];
                    this.setState({items: items, selectedItemId: item.id, templateText: ''});
                });
    }

    handleNewItemChange(event) {
        this.setState({newItemName: event.target.value});
    }

    handleSendHintsChange(event){
        let fieldVal = event.target.checked;
        this.setState({sendHints: fieldVal});
        saveSendHints(fieldVal);
    }

    handleTemplateChange(event) {
        let fieldVal = event.target.value;
        this.setState({templateText: fieldVal});
        let item = this.state.items.find((i) => i.id == this.state.selectedItemId);
        if(item){
            item.text = fieldVal;
        }

        if(fieldVal){
            if(saveHandler){
                saveHandler.clear();
            }
            saveHandler = debounce(() => saveDataFn(this.state.selectedItemId, fieldVal), 1000);        
            saveHandler();
        }
    }

    render() {  
        let textareaReadonly = {}
        if(!this.state.selectedItemId){
          textareaReadonly = {readOnly: true};
        }
        
        return (
            <ContentWrapper>
                <h3>Wskazówki trenera</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                        <Well bsSize="large" style={{'textAlign':'center'}}>
                            <h1><em className="fa fa-lightbulb-o"></em></h1>
                            <p>Edycja wskazówek wysyłanych do klientów. Zalecamy aby traktować to jako bazę wiedzy trenera. Wskazówki w postaci ciekawostek mozna wysyłać z różną częstotliwościa do klienta w celu podniesienia satysfakcji z użytkowania narzędzia.</p>
                        </Well>
                        <Panel>
                            <Row>
                                <form className="form-horizontal" onSubmit={this.onFormSubmit.bind(this)}>
                                    <FormGroup>
                                        <Col lg={ 1 } md={2} sm={2} xs={2}>
                                            <div className="checkbox c-checkbox pull-right">
                                                <label>
                                                    <input type="checkbox" name="sendHints" id='sendHints'
                                                    checked={this.state.sendHints} 
                                                    onChange={this.handleSendHintsChange.bind(this)} />
                                                    <em className="fa fa-check"></em>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg={ 9 } md={10} sm={10} xs={10}>
                                            <label className="control-label pointer" htmlFor='sendHints'>Chcę wysyłać wskazówki do moich klientów</label>
                                        </Col>
                                    </FormGroup>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <div className='template-textarea'>
                                            <textarea maxLength='800'
                                            {...textareaReadonly}
                                            value={this.state.templateText}
                                            onChange={this.handleTemplateChange.bind(this)}
                                            placeholder='Treść wskazówki'
                                            className="form-control"></textarea>
                                            <label className="col-lg-12 control-label text-right">Maks. 800 znaków</label>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                                            Dane zapisane poprawnie.                
                                        </div>  
                                        <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                                            Nie udało się zapisać dane.
                                        </div>   
                                    </Col>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <div data-height="400" data-scrollable="" className="list-group">
                                            {this.state.items.map( (item) => <div 
                                                className={this.state.selectedItemId == item.id ? 'selected list-group-item pointer' : 'list-group-item pointer'}
                                                key={item.id}
                                                onClick={this.selectItem.bind(this, item.id)}>
                                                <div className="media-box">
                                                    <div className="media-box-body clearfix">
                                                        <span className="mb-sm pointer">
                                                            {item.name}
                                                        </span>
                                                        <div className="pull-right">
                                                            <em className="fa fa-trash pointer" onClick={this.removeItem.bind(this, item.id)} />
                                                        </div>
                                                    </div>                                                
                                                </div>
                                            </div>)}                                            
                                        </div>

                                        <FormControl type="text" placeholder="Nazwa nowej wskazówki" 
                                            maxLength='80'
                                            className="form-control"
                                            name='name'
                                            value={this.state.newItemName}
                                            onChange={this.handleNewItemChange.bind(this)}/>
                                        <label className="col-lg-12 control-label text-right no-padding">Maks. 80 znaków</label>
                                        <div>
                                            <div type="button" onClick={this.addNewItem.bind(this)} className="btn btn-primary pull-right">Dodaj nową</div>
                                        </div>
                                    </Col>                                    
                                </form>
                            </Row>
                        </Panel>
                    </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default TrainerHintsPage;

