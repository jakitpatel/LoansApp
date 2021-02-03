import React from 'react';
import * as Icon from "react-feather";
import { useSelector } from 'react-redux';

function DownloadProtocol(props) {
    const { isInternalUser } = useSelector(state => {
        return {
            ...state.userReducer
        }
    });
    return (
    <li className={` nav-item `}>
        <a href = {props.protocol} target = "_blank" className={`nav-link`} rel="noopener noreferrer">
            <Icon.File />
            <span style={{ marginLeft: 10 }}>
            {props.name}
            </span>
        </a>
    </li>
    );
}

export default DownloadProtocol;