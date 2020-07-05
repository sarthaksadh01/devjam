/* 
This file is used as a Navbar component 
used across entire site.
*/

import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { faEllipsisV, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar from 'react-bootstrap/Navbar'
import Avatar from 'react-avatar';
import { Dropdown } from 'react-bootstrap'
import Popup from "reactjs-popup";
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
function NavbarUi(props) {
    function renderTooltip(notifications) {
        var nf = notifications.filter((notification) => {
            return notification.isRead === false
        });
        if (nf.length === 0) {
            return (
                <Tooltip id="button-tooltip">
                    You have No new Notification
                </Tooltip>
            );

        }
        else {
            return (
                <Tooltip id="button-tooltip">
                    {nf[0].title}
                </Tooltip>
            );

        }

    }
    return (

        <Navbar collapseOnSelect expand="lg" className="shadow shadow-lg navbar navbar-expand-md custom-nav text-white fixed-top">
            <a class=" text-white navbar-brand" href="/"><img style={{ height: 35 }} src="https://www.zaiodev.com/static/media/zaiowhite.76601178.png" /></a>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <ul class="nav navbar-nav ml-auto ">
                    <li class="nav-item ">
                        <a class="text-white nav-link" href="/coding-playground">Coding Playground </a>
                    </li>
                    <li class="nav-item ">
                        <a class="text-white nav-link" href="/frontend-playground">UI Playground </a>
                    </li>
                    <li class="nav-item ">
                        <a class="text-white nav-link" href="/coding-tests">Profile </a>
                    </li>
                    <li class="nav-item ">
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip(props.notifications)}
                        >
                            <a class="text-white nav-link" href="/notification"><span className="badge badge-md badge-warning"><i class="fas fa-bell mr-1"></i>{props.notifications.filter((notification) => {
                                return notification.isRead === false
                            }).length}</span> </a>
                        </OverlayTrigger>


                    </li>

                    <Dropdown className="float-right" >
                        <Dropdown.Toggle variant="" id="dropdown-basic">
                            <Avatar src={props.imageUrl} color={Avatar.getRandomColor('sitebase', ['green'])} name={props.email} size={30} round="35px" />
                        </Dropdown.Toggle>



                        <Dropdown.Menu>
                            <Dropdown.Item href="/coding-tests">Profile</Dropdown.Item>
                            <Dropdown.Item onClick={() => { reactLocalStorage.clear(); window.location.reload() }} href="">Logout</Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                </ul>
            </Navbar.Collapse>


            {/* </Navbar.Collapse> */}



        </Navbar>

    );
}


export default NavbarUi;