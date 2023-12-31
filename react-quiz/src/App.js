import Header from "./Header";
import Main from "./Main";
import {useEffect, useReducer} from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartsScreen from "./StartsScreen";
import Question from "./Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./FinishScreen";


const initialState = {
    questions: [],

    // 'loading','error', 'active','finished','ready'
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
};

function reducer(state,action){

    switch (action.type) {
        case "dataReceived": return { ...state,
            questions: action.payload,
            status: "ready"
        };
        case "dataFailed": return { ...state,
        status: "error"};
        case "start": return {...state,
        status: "active"};

        case "newAnswer":
            const question = state.questions.at(state.index);
            return {...state,
            answer: action.payload,
            points: action.payload === question.correctOption ? state.points +question.points : state.points,
        };
        case "nextQuestion": return {...state,
        index: state.index+1, answer: null
        };
        case "finish": return {...state,
             status: "finished"
        }

        default:
            throw new Error("Action Unknown")
    }

}

export default function App () {

    const [{questions, status, index,answer, points},dispatch] = useReducer(reducer,initialState);

    const numberOfQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev,cur) => prev + cur.points,0);

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
          {status === 'ready' && <StartsScreen numberOfQuestions={numberOfQuestions} dispatch={dispatch}/>}
          {status === 'active' && (
              <>

                  <Progress
                      numQuestions={numberOfQuestions}
                      index={index}
                      points={points}
                      maxPossiblePoints={maxPossiblePoints}
                      answer={answer}
                  />
                  <Question
                      question={questions[index]}
                      dispatch={dispatch}
                      answer={answer}
                  />
                  <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numberOfQuestions}/>
              </>
              )}

          { status === 'finished' &&
              <FinishScreen
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              />}
      </div>
      )

}