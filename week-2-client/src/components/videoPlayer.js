import React from 'react';
import ReactPlayer from 'react-player'
import { faArrowRight,faArrowLeft,faEllipsisH, faPlus, faFileArchive, faTimesCircle, faStopwatch20, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown } from 'react-bootstrap'
function VideoPlayer(props) {
    return (
        <div  className="player "> 
            <ReactPlayer
                
                showNext={true}
                width={"100%"}
                height={"90%"}
                marginRight={"40px"}
                playbackRate={props.playbackRate}
                controls={true}
                config={{
                    file: {
                        attributes: {
                            onContextMenu: e => e.preventDefault(),
                            controlsList: 'nodownload'
                        }
                    }
                }}
                url={props.videoUrl}
            />

            <div className="row icons">
                <div className=" col-md-12 text-center">
               {props.prev=="#"?<div></div>:<a href={props.prev}><FontAwesomeIcon style={{fontSize:"25",marginTop:"3px"}} className=" mr-5 border-white text-white"  icon={faArrowLeft} /></a>} 
                <select onChange={(e)=>{props.changePlayback(e.target.value)}} className="mr-5 border-white text-dark mb-2">
                    <option>1x</option>
                    <option>1.25x</option>
                    <option>1.5x</option>
                    <option>1.75x</option>
                    <option>2x</option>
                    </select>
                    <select onChange={(e)=>{props.changeVideoQuality(e.target.value)}}  className="mr-5 border-white text-dark mb-2">
                    <option>HD</option>
                    <option>SD</option>
                    </select>
                
                    {props.next=="#"?<div></div>:<a href={props.next}><FontAwesomeIcon style={{fontSize:"25",marginTop:"3px"}} className=" mr-5 border-white text-white"  icon={faArrowRight} /></a>} 
                    
                   
                </div>
            </div>
        </div>
    );
}
export default VideoPlayer;