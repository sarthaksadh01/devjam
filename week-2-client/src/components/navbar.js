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
function NavbarUi(props) {
    return (

        <Navbar collapseOnSelect expand="lg" className="shadow shadow-lg navbar navbar-expand-md custom-nav text-white fixed-top">
            <a class=" text-white navbar-brand" href="/"><b>Cryptx</b></a>
            <ul class="nav navbar-nav ml-auto">
                <Dropdown className="float-right">
                    <Dropdown.Toggle variant="" id="dropdown-basic">
                        <Avatar src={props.imageUrl} color={Avatar.getRandomColor('sitebase', ['green'])} name={props.email} size={30} round="35px" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { reactLocalStorage.clear(); window.location.reload() }} href="">Logout</Dropdown.Item>

                    </Dropdown.Menu>
                </Dropdown>
            </ul>


            {/* </Navbar.Collapse> */}



        </Navbar>

    );
}
export default NavbarUi;