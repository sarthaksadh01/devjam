/*
This file contains all Topics uploaded by admin.

It fetches all topics from the database and 
renders it as a page. 

*/

import React from 'react';
import { faVideoSlash, faEdit, faSearch, faVideo, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getContent } from '../data/data'
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            searchRes: [],
            colors: [
                '7f87b2',
                '83b2d0',
                '95dab6',
                'dc8580'
            ]
        }
        this.search = this.search.bind(this);
    }

    submit(e) {
        e.preventDefault();
    }
    search(event) {
        var query = event.target.value;
        var searchRes = this.state.data.filter((topic) => {
            return topic.title.toLowerCase().includes(query.trim().toLowerCase());
        })
        this.setState({ searchRes })

    }

    componentDidMount() {
        this.props.toggleLoading("Loading topics..")
        getContent().then((data) => {
            this.setState({ data, searchRes: data })

        }).finally(() => {
            this.props.toggleLoading("Loading topics..")
        })

    }
    calculateVideos(subTopics) {
        var count = 0;
        for (var i = 0; i < subTopics.length; i++) {
            if (subTopics[i].type === "video") count += 1;
        }
        return count;
    }

    render() {
        return (
            <div className="body">
                <div className=" container">
                    <div class="row">
                        <div class="col-md-3"></div>
                        <div class="col-md-6">
                            <div class="text-center s009">
                                <form onSubmit={this.submit} class="text-center">
                                    <div class="inner-form">
                                        <div class="basic-search">
                                            <div class="input-field">
                                                <input onChange={this.search} id="search" type="text" placeholder="Search Topics.." />
                                                <div class="icon-wrap">
                                                    <svg class="svg-inline--fa fa-search fa-w-16" fill="#ccc" aria-hidden="true" data-prefix="fas" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>

                        </div>
                        <div class="col-md-3"></div>



                    </div>
                    <div className="content-wrapper mt-4">
                        {this.state.searchRes.map((value, index) => {

                            var color = Math.floor(Math.random() * 4);
                            return <div class="video-card">
                                <a href="#" class="video-card__card-link"></a>

                                <img class="video-card__image"
                                    src={value.subTopics[0].thumbNail}
                                    alt="Card image" /> alt="Card image" />
                            <div class="video-card__text-wrapper">
                                    <h2 class="video-card__title text-center">{value.title}</h2>
                                    <div class="video-card__post-date">
                                        <div className="col-sm-4">
                                            <p className="m-0">{this.calculateVideos(value.subTopics)}</p>
                                            <p className="text-muted">Videos</p>

                                        </div>
                                        {value.subTopics.length ? <a href={`/topic/${value._id}/subtopic/${value.subTopics[0].subTopicId}`} className="btn text-center  text-white btn-lg" ><FontAwesomeIcon className="border-white" style={{ fontSize: "45" }} icon={faPlayCircle} /></a> :
                                            <a href={`#`} className="btn text-center  text-white btn-lg" ><FontAwesomeIcon className="border-white" style={{ fontSize: "35" }} icon={faVideoSlash} /></a>
                                        }

                                        <div className="col-sm-4 items">
                                            <p className="m-0">{value.subTopics.length}</p>
                                            <p className="text-muted">Items</p>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            // </div>
                        })}

                    </div>
                </div>
            </div>
        )
    }


}
export default Content;