import Header from "./Header";
import Main from "./Main";
import {useEffect, useReducer} from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartsScreen from "./StartsScreen";


const initialState = {
    questions: [],

    // 'loading','error', 'active','finished','ready'
    status: 'loading'
};

function reducer(state,action){

    switch (action.type) {
        case "dataReceived": return { ...state,
            questions: action.payload,
            status: "ready"
        }
        case "dataFailed": return { ...state,
        status: "error"}
        default:
            throw new Error("Action Unknown")
    }

}

export default function App () {

    const [{questions, status},dispatch] = useReducer(reducer,initialState);

    const num

    useEffect(()=>{
        fetch("http://localhost:8000/questions")
            .then(resp =>resp.json())
            .then((data) =>dispatch({ type: 'dataReceived', payload: data}))
            .catch((err) =>dispatch({ type: "dataFailed"}));


    },[])
  return(
      <div className="app">
       <Header />
          <Main />
          {status === 'loading' && <Loader />}
          {status === 'error' && <Error />}
          {status === 'ready' && <StartsScreen />}
      </div>
      )

}