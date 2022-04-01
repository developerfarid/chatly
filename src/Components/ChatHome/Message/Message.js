import { BsThreeDots } from 'react-icons/bs';
import { format } from 'timeago.js';
import "./Message.css";

const Message = ({ message, own, user, handleDeleteMessage }) => {
    

    return (
        <div className={own ? 'message own' : "message"}>
            <div className="message-top">
                <span onClick={() => handleDeleteMessage(message?._id)} className='threeDot mx-3'>< BsThreeDots /></span>
                <img className='message-img' src={own ? user?.photoURL ? user?.photoURL  : "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png" : "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"} alt="" />
                <p className='message-text'>
                    {message?.text}
                </p>
            </div>
            <div className="message-button">
                {format(message?.time)}
            </div>
        </div>
    );
};

export default Message;