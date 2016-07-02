# routingWithState

For the sake of learning, this is a slightly more broken up version of
[ntilwalli/routingWithState](https://github.com/ntilwalli/routingWithState).

I have added many comments, with often extreme redundancy but hopefully some clarity about what is going on for the
beginner.

Demonstrates CycleJS routing while sharing state from parent component with children 
components.  Sharing state during routing can also be done using the browser's history 
with pushState which is shown [here](https://github.com/ntilwalli/routingWithPushState).

### Run locally (assumes Babel 6):

1. `npm install -g live-server watchify`
2. `npm install`
3. `npm run build`
4. `npm run serve`
5. Open browser at http://localhost:8080
