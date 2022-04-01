import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import './Conversation.css';

const Conversation = ({ conversation, loginUsers, handleDeleteConversation }) => {
    const [friendId, setFriendId] = useState({})
    useEffect(() => {
        const firend = conversation?.member?.find((m) => m !== loginUsers?._id)
        const getFriend = async () => {
            try {
                const res = await axios.get(`https://rhubarb-cobbler-14699.herokuapp.com/getUsers/${firend}`)
                setFriendId(res?.data);
            } catch (err) {
                console.log(err);
            }
        }
        getFriend()
    }, [loginUsers?._id, conversation?.member])

    return (
        <div className='conversation'>
            <div>
                <img className='conversation-img' src={friendId?.photoURL ? friendId?.photoURL : "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"} alt="" />
                <span className='conversation-name'>
                    {friendId?.displayName}
                </span>
            </div>
            <span onClick={() => handleDeleteConversation(conversation?._id)} className='threeDot'>< BsThreeDots /></span>
        </div>
    );
};

export default Conversation;