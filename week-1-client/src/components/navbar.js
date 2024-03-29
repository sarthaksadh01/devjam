/* 

This file is used as a Navbar component 
used across entire site.

*/

import React from 'react';
import "../assets/css/navbar.css"
import { reactLocalStorage } from 'reactjs-localstorage';
import Navbar  from 'react-bootstrap/Navbar'
function NavbarUi() {
    return (

        <Navbar collapseOnSelect expand="lg"  className="navbar   navbar-dark navbar-custom fixed-top">
            <a class=" text-white navbar-brand" href="/"><img style={{ height: 35 }} src="https://www.zaiodev.com/static/media/zaiowhite.76601178.png" /></a>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
         
                <ul class="navbar-nav  ml-auto nav-menu">
                    <li class="nav-item ">
                        <a class="nav-link" href="/">Home </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/createprofile">Create Profile</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/profiles">All Profiles</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/content">Content</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/marking">Marks</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/tests">Tests</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/question-bank/">Question Bank</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/coding-tests/">Coding Tests</a>
                    </li>
                    {/* <li class="nav-item">
                        <a class="nav-link" href="/courses">Courses</a>
                    </li> */}
                    <li class="nav-item">
                        <a class="nav-link" href="https://hiii-15fdf.web.app">Student Portal</a>
                    </li>
                    
                    

                    <li class="nav-item">

                        <li class="log-btn"><a href="#" onClick={() => {
                            reactLocalStorage.clear();
                            window.location.reload()
                        }} >Logout</a></li>


                    </li>


                </ul>

            </Navbar.Collapse>
        </Navbar>

    );
}
export default NavbarUi;