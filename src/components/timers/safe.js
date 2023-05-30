import './SafeCrackingGames.css';
import React, { useState, useEffect } from "react";

const correctPin = [1, 2, 8, 5];

const SafeCrackingGame = () => {
    const [pin, setPin] = useState([]);
    const [message, setMessage] = useState("");
    const [enterPressed, setEnterPressed] = useState(false);
    const [isCorrectPin, setIsCorrectPin] = useState(false); // add this state variable

    const handleButtonClick = (num) => {
        setPin((prev) => [...prev, num]);
        setEnterPressed(false);
    };

    const handleEnter = () => {
        if (JSON.stringify(pin) === JSON.stringify(correctPin)) {
            setMessage("Safe Unlocked!");
            setIsCorrectPin(true); // set this to true if correct pin is entered
        } else {
            setMessage("Incorrect Pin!");
            setIsCorrectPin(false); // set this to false if incorrect pin is entered
        }
        setEnterPressed(true);
        setPin([]);
    };

    const handleClear = () => {
        setPin([]);
        setMessage("");
        setEnterPressed(false);
        setIsCorrectPin(false); // reset this when clear button is clicked
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key >= "0" && event.key <= "9") {
                handleButtonClick(parseInt(event.key));
            }
            if (event.key === "Enter") {
                handleEnter();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [pin]);

    return (
        <div className="safe-cracking-game">
            <div
                className="display"
                style={{ backgroundColor: isCorrectPin ? "green" : "red" }} // change background color based on isCorrectPin
            >
                {!enterPressed && <p>{pin.join(" ")}</p>}
                {enterPressed && <p>{message}</p>}
            </div>
            <div className="button-panel">
                {[
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9],
                    ['*', 0, '#']
                ].map((row, rowIndex) => (
                    <div key={rowIndex} className="button-row">
                        {row.map((num, index) => (
                            <button key={index} onClick={() => num !== '*' && num !== '#' ? handleButtonClick(num) : null}>
                                {num}
                            </button>
                        ))}
                    </div>
                ))}
                <button onClick={handleEnter}>Enter</button>
                <button onClick={handleClear}>Clear</button>
            </div>
        </div>
    );
};

export default SafeCrackingGame;
