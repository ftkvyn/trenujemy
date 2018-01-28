import React from 'react';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
import BaseHorizontal from './components/Layout/BaseHorizontal';

import ProfilePage from './components/Pages/ProfilePage'
import Goods from './components/Pages/Goods'
import SurveyPage from  './components/Pages/SurveyPage'
import AdvicePage from  './components/Pages/AdvicePage'
import ClientPage from './components/Pages/ClientPage'
import DiaryPage from './components/Pages/DiaryPage'

import TrainingsPrice from './components/Pages/TrainingsPrice'
import TrainingsPlaces from './components/Pages/TrainingsPlaces'
import TrainingsHours from './components/Pages/TrainingsHours'

import FeedPlansPrice from './components/Pages/FeedPlansPrice'

// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages = [
    /* See full project for reference */
];

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInUp'
    //      'rag-fadeInDown'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'
    //      'rag-fadeInUpBig'
    //      'rag-fadeInDownBig'
    //      'rag-fadeInRightBig'
    //      'rag-fadeInLeftBig'
    //      'rag-zoomBackDown'
    const animationName = 'rag-fadeIn'

    if(listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Switch location={location}>
                    {/* See full project for reference */}
                </Switch>
            </BasePage>
        )
    }
    else {
        return (
            // Layout component wrapper
            // Use <BaseHorizontal> to change layout
            <Base>
              <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName}>
                    <div>
                        <Switch location={location}>
                            <Route path="/profile" component={ProfilePage}/>
                            <Route path="/goods" component={Goods}/>
                            <Route path="/survey" component={SurveyPage}/>
                            <Route path="/advice" component={AdvicePage}/>
                            <Route path="/diary/:day?" component={DiaryPage}/>
                            <Route path="/clients/:id" component={ClientPage}/>
                            <Route path="/trainings/price" component={TrainingsPrice}/>
                            <Route path="/trainings/places" component={TrainingsPlaces}/>
                            <Route path="/trainings/hours" component={TrainingsHours}/>
                            <Route path="/plans/price" component={FeedPlansPrice}/>
                            <Redirect to="/profile"/>
                        </Switch>
                    </div>
                </CSSTransition>
              </TransitionGroup>
            </Base>
        )
    }
}

export default withRouter(Routes);
