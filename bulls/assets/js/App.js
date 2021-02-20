import React, {useEffect, useState} from 'react';
import 'milligram';

import '../css/App.css';
import {ch_join, ch_push, ch_reset} from './socket'

// based on lecture code
function SetTitle({text}) {
    useEffect(() => {
        let orig = document.title;
        document.title = text;

        // Cleanup function
        return () => {
            document.title = orig;
        };
    });

    return <div/>;
}


// the structure of this function was pulled from the lecture code - will mark exact functions within
function Controls({guess, reset, disabled}) {
    // WARNING: State in a nested component requires
    // careful thought.
    // If this component is ever unmounted (not shown
    // in a render), the state will be lost.
    // The default choice should be to put all state
    // in your root component.
    const [text, setText] = useState("");

    // based on lecture code
    function updateText(ev) {
        setText(ev.target.value);
    }

    // based initially on lecture code
    function keyPress(ev) {
        // submit guess when the user hits enter
        if (ev.key == "Enter") {
            guess(text);
            setText('')
            // prevent non-digit guesses
        } else if (!((ev.key == "0") ||
            (ev.key == "1") ||
            (ev.key == "2") ||
            (ev.key == "3") ||
            (ev.key == "4") ||
            (ev.key == "5") ||
            (ev.key == "6") ||
            (ev.key == "7") ||
            (ev.key == "8") ||
            (ev.key == "9")
        )) {
            ev.preventDefault();
        }
    }

    function clearReset() {
        setText('');
        reset();
    }

    function clearEnter() {
        guess(text);
        setText('');
    }

    // based on lecture code
    return (
        <div className="row">
            <div className="column">
                <p>
                    <input type="text"
                           maxLength={4}
                           value={text}
                           disabled={disabled}
                           onChange={updateText}
                           onKeyPress={keyPress}/>
                </p>
            </div>
            <div className="column">
                <p>
                    <button disabled={disabled} onClick={clearEnter}>Guess</button>
                </p>
            </div>
            <div className="column">
                <p>
                    <button onClick={clearReset}>
                        Reset Game
                    </button>
                </p>
            </div>
        </div>
    );
}

function PrevGuesses({guesses, results}) {

    // for each available guess out of 8, if the guess has already happened,
    // add the number and guess, otherwise add only the number
    // each used guess also has a corresponding result, so add results as needed
    let guessBodies = [];
    let resultBodies = [];
    for (let i = 0; i < 8; i++) {
        if (i < guesses.length) {
            guessBodies[i] = (i + 1) + ":\t" + guesses[i];
            resultBodies[i] = results[i].bulls + " Bulls, " + results[i].cows + " Cows"
        } else {
            guessBodies[i] = (i + 1) + ": ";
            resultBodies[i] = " ";
        }
    }

    // pair guesses and results so the html can be generated in one mapping
    // we are guaranteed the guessBodies and resultBodies arrays are of the same length
    let bodyPairs = [];
    for (let i = 0; i < guessBodies.length; i++) {
        bodyPairs[i] = [guessBodies[i], resultBodies[i]]
    }


    return (
        <div className="row">
            <div className="column">
                {bodyPairs.map(item => (
                    <div key={item} className="row">
                        <div className="column">
                            <p>{item[0]}</p>
                        </div>
                        <div className="column">
                            <p>{item[1]}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="column">
            </div>
        </div>
    )
}

// the structure of this function was pulled from the lecture code - will mark exact functions within
function App() {
    // portions of state based off lecture code

    const [state, setState] = useState({
        guesses: [],
        results: [],
        disabled: false,
        warnings: "Welcome. Please enter 4 digits to begin",
    });

    useEffect(() => {
       ch_join(setState);
    });

    function guess(text) {
    // Inner function isn't a render function
       ch_push({guess: text});
    }
    
    function reset() {
       ch_reset();
    }
    
    // based off lecture code
    let body = (
        <div>
            <SetTitle text={"4Digits Game"}/>
            <div className="row">
                <div className="column">
                    <h1>4Digits!</h1>
                    <Controls reset={reset} guess={guess} disabled={state.disabled}/>
                </div>
                <div className="column">
                    <p>{"\n"}</p>
                    <p className="userMessages">{state.warnings}</p>
                </div>
            </div>
            <PrevGuesses guesses={state.guesses} results={state.results}/>
        </div>
    );
    return (
        <div className="container">
            {body}
        </div>
    );
}

export default App;
