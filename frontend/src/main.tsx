import React from 'react'
import {createRoot} from 'react-dom/client'
import './css/style.css'
import App from './App'
import {PagesEnum} from "./PagesEnum";

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <App page={PagesEnum.LOG_DISPLAY}/>
    </React.StrictMode>
);
