import React from 'react';
import { Row, Col, FormGroup } from 'react-bootstrap';


const SurveyItem = (props) => {	
  if(!props.userData || !props.settings || !props.settings.length){
    return null;
  }
  let items = [];
  if(props.userData.feedPlans && props.userData.feedPlans.length){
    let setting = props.settings.find((item) => item.settingType == 'feed');
    items = [...items, ...setting.includedFields];
  }
  if(props.userData.trainPlans && props.userData.trainPlans.length){
    let setting = props.settings.find((item) => item.settingType == 'training');
    items = [...items, ...setting.includedFields];
  }

  let isShowItem = items.some( (item) => item == props.name);
  if(props.name == 'bodySize'){
    isShowItem = items.some( (item) => item.startsWith('bodySize'));
  }
  if(isShowItem){
    if(Array.isArray(props.children)){
      return <div>
        {props.children}
      </div>
    }else{
      return props.children;
    }
  }else{    
    return null;
  }
}

export default SurveyItem;