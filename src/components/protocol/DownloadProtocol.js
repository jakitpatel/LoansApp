import React from 'react';
import * as Icon from "react-feather";

function DownloadProtocol(props) {
    return (
    <li className="nav-item">
        <a href = {props.protocol} target = "_blank" className="nav-link" rel="noopener noreferrer">
            <Icon.File />
            <span style={{ marginLeft: 10 }}>
            {props.name}
            </span>
        </a>
    </li>
    );
}

export default DownloadProtocol;