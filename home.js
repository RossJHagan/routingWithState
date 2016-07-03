import xs from 'xstream';
import { div, a } from '@cycle/dom';

// We don't need model or intent functions for this page as no actions are to be capture right now
// and we are relying on the main.js state stream, so a model function may never be needed here depending on
// whether we want to pass our state around 'globally'

/**
 * view is a simply function for encapsulating our template for this page as part of the model-view-intent paradigm
 * 
 * @param inputs
 * @returns {*}
 */
function view(inputs) {
  
  // We're mapping out values to get access to the state stream for use in our view
  return inputs.parentState$.map(state => {

    return div(`.root`, [
      div([`Root`]),
      div([`Current count: ${state.count}`]),
      div([a({props: {href: `/page1`}}, [`Go to page 1`])]),
      div([a({props: {href: `/page2`}}, [`Go to page 2`])])
    ]);

  });
  
}


/**
 * Home makes no use of sources as there's no action on this page.
 *
 * It does use the parentState from the inputs object to show the count by mapping the stream
 * and read the state tree
 *
 * @param sources
 * @param inputs
 * @returns {{DOM: *, counterChange$: *}}
 * @constructor
 */
function Home(sources, inputs) {
  
  const view$ = view(inputs);

  return {
    
    DOM: view$,
    
    counterChange$: xs.never()
    
  };
  
}

export default Home;
