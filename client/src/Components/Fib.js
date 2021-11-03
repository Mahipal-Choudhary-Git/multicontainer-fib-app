import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Fib() {
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState("");

    useEffect(() => {
        fetchIndexes().then((data) => {
            if (Array.isArray(data)) {
                setSeenIndexes(data);
            }
        });

        fetchValues().then((data) => setValues(data));
        console.log("changed");
    }, [index]);

    const onSubmitHandler = useCallback(
        async (e) => {
            e.preventDefault();
            await axios.post("/api/values", {
                index,
            });
            setIndex("");
        },
        [index]
    );

    const renderValues = () => {
        const entries = [];
        for (const key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            );
        }
        return entries;
    };

    return (
        <div>
            <h1> Fib Calculator</h1>
            <div>
                <form onSubmit={(e) => onSubmitHandler(e)}>
                    <label>Enter your index:</label>
                    <input
                        value={index}
                        onChange={(e) => setIndex(e.target.value)}
                    />
                    <button>Submit</button>
                </form>
                <h3>Indexes I have seen: </h3>
                {seenIndexes.map(({ numbers }) => numbers).join(", ")}
                <h3>Calculated values: </h3>
                {renderValues()}
            </div>
            <Link to="/other">Other Page</Link>
        </div>
    );
}

async function fetchValues() {
    const values = await axios.get("/api/values/current");
    return values.data;
}

async function fetchIndexes() {
    const indexes = await axios.get("/api/values");
    return indexes.data;
}

export default Fib;
