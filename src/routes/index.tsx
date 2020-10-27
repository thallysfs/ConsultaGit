import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
    <Switch>
        <Route path="/" exact component={Dashboard} />
        {/* O ':' indica que a partir da barra virá um parâmetro, o '+' é para indicar que toda a linha é um repositório só e não uma nova rota */}
        <Route path="/repository/:repository+" component={Repository} />
    </Switch>
)

export default Routes;
