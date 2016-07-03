import xs from 'xstream'
import Cycle from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeRouterDriver} from 'cyclic-router';
import {createHistory} from 'history';
import Immutable from 'immutable'

import Counter from './counter';
import Home from './home';

/**
 * reducers receives a set of actions and a set of inputs and return a stream of functions to be applied
 * to the state tree to effect changes
 *
 * @param actions
 * @param inputs
 * @returns {*}
 */
function reducers(actions, inputs) {

  // The changeReducer takes the intent stream from the Counter and applies the relative value to the count
  // so the possible values for `val` here are: 1 or -1
  const counterChangeReducer$ = inputs.counterChange$.map(val => state => {
    
    // state.update() is an Immutable.js feature
    return state.update(`count`, count => count + val);
    
  });

  // A sample extra reducer using the same change stream - uncomment the alternative return below to see it happen
  const counterMultiplierReducer$ = inputs.counterChange$.map(val => state => {

    return state.update(`count`, count => count + (val * 10));

  });

  // We can keep adding more reducer functions as comma separated values and they'll all be applied in the model()
  return xs.merge(counterChangeReducer$);
  // return xs.merge(counterChangeReducer$, counterMultiplierReducer$);

}

/**
 * model takes a series of actions and inputs, producing stream of reducer functions (reducer$) then applying
 * those reducers to the state tree (an Immutable.js Map)
 *
 * @param actions
 * @param inputs
 * @returns {MemoryStream<T>|Stream|MemoryStream}
 */
function model(actions, inputs) {

  const reducer$ = reducers(actions, inputs);

  // Having a stream of reducer functions, we fold over that stream, applying the reducer function to the accumulated
  // value.  The default accumulated value being an Immutable.js Map.
  return reducer$
    .fold((acc, reducer) => reducer(acc), Immutable.Map({
      count: 0
    }))
    .map(x => x.toObject())
    .debug()
    .remember();

}

/**
 * main function, establishes our initial state tree to be passed down to the routes
 *
 * @param sources
 * @returns {{DOM: (Stream|T), Router: *}}
 */
function main(sources) {

  // Establish the initial change stream that will be announcing input from our counter buttons
  const counterChange$ = xs.create();

  // Establish the initial state - we're not taking any action on the state so we're sending an empty object
  // for the actions, but still giving the initial inputs so that when the reducers() function is called, it
  // has the inputs.counterChange$ to call in the reducers
  const state$ = model({}, { counterChange$ });
  
  // This is the input for our Home page component, sending down just the parentState$ stream for showing the counter
  const homeInputs = {
    parentState$: state$
  };

  // These are our inputs into the Counter components - delivering any other data streams we want our components
  // to have access to.
  //
  // In this case, the parentState$ holds our common state tree stream which can be mapped over in each component's template
  // to get access to state values
  const counterPageOneInputs = {
    props$: xs.of({title: `Page 1`}),
    parentState$: state$
  };

  const counterPageTwoInputs = {
    props$: xs.of({title: `Page 2`}),
    parentState$: state$
  };

  // Define our routes
  // We pass down the sources containing our various drivers so the components can access the DOM (and Router if needed)
  const routes = {
    '/': () => Home(sources, homeInputs),
    '/page1': () => Counter(sources, counterPageOneInputs),
    '/page2': () => Counter(sources, counterPageTwoInputs)
  };

  // The cyclic-router uses [switch-path](https://github.com/staltz/switch-path) behind the scenes, so when we use
  // [Router.define](http://cyclejs-community.github.io/cyclic-router/docs/#define) we get back an object
  // with the switch-path `path` and `value` where the value is what we assigned above in the routes constant.
  //
  // Because our values to the routes are functions, we call them as functions here to get the component out
  const component$ = sources.Router.define(routes)
      .debug(`from router...`)
      .map(route => route.value)
      .map(value => {
        return value()
      })
      .remember();

  // imitate is all about proxying a stream in circular dependencies
  // You're going to want to read a little more than I can sum up here, so go read the docs:
  // https://github.com/staltz/xstream#-imitatetarget
  // There's a good section right in there about parent -> child component relationships
  counterChange$.imitate(component$.map(x => x.counterChange$).flatten());

	return {
    
		DOM: component$.map(x => x.DOM).flatten(),
    
    Router: xs.never()
    
	};

}

const drivers = {
  
	DOM: makeDOMDriver('#app'),
  
	Router: makeRouterDriver(createHistory(), {capture: true}),
  
};

Cycle.run(main, drivers);
