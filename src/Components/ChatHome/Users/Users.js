import React from 'react';

const Users = ({item}) => {
    return (
        <div className='ChatOnline'>
            <div className="ChatOnlineFriend">
                <div className="ChatOnlineFriendImgContainer">
                    <img src={item?.photoURL ? item?.photoURL : "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png" } alt="" />
                </div>
                <span>{item?.displayName}</span>
            </div>
        </div>
    );
};

export default Users;