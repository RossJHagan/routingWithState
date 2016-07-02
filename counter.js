import xs from 'xstream';
import { div, button, a } from '@cycle/dom';

/**
 * intent defines two action streams which it maps to either a 1 to increase, or -1 to decrease the counter
 *
 * We could increase the values being mapped to and the counter would increase by that amount.
 *
 * See: the changeReducer$ function in reducers() in main.js - where it adds the emitted value to the existing count
 *
 * @param sources
 * @returns {{change$: *}}
 */
function intent(sources) {

  const inc$ = sources.DOM.select(`.inc`).events(`click`).mapTo(1);
  const dec$ = sources.DOM.select(`.dec`).events(`click`).mapTo(-1);

  // The change stream here is the same that is used in the reducers() function in main.js
  return {
    counterChange$: xs.merge(inc$, dec$)
  }

}

/**
 * Counter takes our sources, and establishes the intent from those sources
 *
 * It also uses the props$ stream and parentState$ stream to render the counter template.
 *
 * @param sources
 * @param props$
 * @param parentState$
 * @returns {{DOM: (*|Stream|Iterable<any, any>|T), change$: *}}
 * @constructor
 */
function Counter(sources, { props$, parentState$ }) {

  // Establish the actions this component is capable of
  // We'll be returning the counterChanged$ stream
  const actions = intent(sources);

  // We 'double map' here to get access to the props value and the state value for use inside the template
  // So we have props (which is basically the `title` defined in main.js as a stream of an object
  return {

    DOM: props$.map(props => parentState$.map(state => div(`.child`, [
      div([`${props.title}`]),
      div([`Current count: ${state.count}`]),
      button(`.inc`, [`+`]),
      button(`.dec`, [`-`]),
      div([a({props: {href: `/`}}, [`Back to root`])])
    ]))).flatten(),

    counterChange$: actions.counterChange$

  };
  
}

export default Counter;
