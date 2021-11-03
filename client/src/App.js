import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Fib from "./Components/Fib";
import Other from "./Components/Other";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/other">
                    <Other />
                </Route>
                <Route exact path="/">
                    <Fib />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
