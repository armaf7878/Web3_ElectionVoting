const authRoute = require('./authRoute');
const organizationRoute = require('./organizationRoute');
const electionRoute = require('./electionRoute');
const candidateRoute = require('./candidateRoute');
// const votersRoute = require('./votersRoute');
// const voteRoute = require('./voteRoute');

function route(app){
    app.use('/api/auth', authRoute);
    app.use('/api/organizations', organizationRoute);
    app.use('/api/elections', electionRoute);
    // app.use('/api/candidates', candidateRoute);
    // app.use('/api/voters', votersRoute);
    // app.use('/api/vote', voteRoute);
};
module.exports = route;