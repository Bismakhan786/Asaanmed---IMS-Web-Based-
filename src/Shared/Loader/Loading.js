import React from "react";
import { Dots } from "react-activity";
import "react-activity/dist/Dots.css";
import './Loading.css'

const Loading = () => {
    return(
        <div className="Loading">
            <Dots color="rgba(0, 0, 0, 0.63)"/>
        </div>
    )
}

export default Loading