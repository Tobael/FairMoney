import "./GroupHistory.scss";
import Header from "../../../../components/Header/header.jsx";
import * as React from "react";
import {useEffect} from "react";
import {fetchGroupHistory} from "../../../../shared/backend.js";
import HistoryItem from "../../../../components/HistoryItem/HistoryItem.jsx";


export default function GroupHistory({onBackClick, groupId, login}) {
    const [history, setHistory] = React.useState(null)

    const getHistory = async () => {
        const result = await fetchGroupHistory(groupId)
        if (result.ok) {
            const data = await result.json()
            setHistory(data);
        } else {
            console.error("Error: ", result)
        }
    }

    useEffect(() => {
        getHistory().then((data) => {
            console.log(data)
        })
    }, []);


    useEffect(() => {

        console.log(history)

    }, [history]);


    return (
        <div id="group_history_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text headline_less_space">Hallo {login}, das ist in der Gruppe passiert.</div>
            <div className="history_container">
                {history && history.map((item, idx) => (<HistoryItem key={idx} item={item}/>))}
            </div>
        </div>
    );
}
