import xs from 'xstream';
import { div, a } from '@cycle/dom';


/**
 * Home makes no use of sources as there's no action on this page.
 *
 * It does use the parentState from the inputs object to show the count by mapping the stream
 * and read the state tree
 *
 * @param sources
 * @returns {{DOM: *, counterChange$: *}}
 * @constructor
 */
function Home(sources, { parentState$ }) {

  return {
    
    DOM: parentState$.map(state => {
      
      return div(`.root`, [
        div([`Root`]),
        div([`Current count: ${state.count}`]),
        div([a({props: {href: `/page1`}}, [`Go to page 1`])]),
        div([a({props: {href: `/page2`}}, [`Go to page 2`])])
      ])
      
    }),
    
    counterChange$: xs.never()
    
  };
  
}

export default Home;
