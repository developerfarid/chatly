import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import ChatOnline from "../ChatOnline/ChatOnline";
import Conversation from '../Conversation/Conversation';
import Message from '../Message/Message';
import Users from '../Users/Users';
import './Messenger.css';

const Messenger = () => {
    const [users, setUsers] = useState([])
    const [offlineUser, setOfflineUser] = useState([])
    const [loginUsers, setLoginUsers] = useState(null)
    const [messages, setMessages] = useState([])
    const [arrivalMessages, setArrivalMessages] = useState(null)
    const [newMessages, setNewMessages] = useState("")
    const [curremtChat, setCurremtChat] = useState(null)
    const [conversation, setConversation] = useState([])
    const [onlineUser, setOnlineUser] = useState([])
    const scrollRef = useRef()
    const socket = useRef()
    console.log(onlineUser, "onlineUser");
    console.log(users, "onlineUser");

    useEffect(() => {
        const getData = async () => {
            try {
                await setLoginUsers(JSON.parse(localStorage.getItem("user")))
            } catch (error) {
                console.log(error);
            }
        }
        getData()
    }, [])

    useEffect(() => {
        axios.get(`https://rhubarb-cobbler-14699.herokuapp.com/conversation/${loginUsers?._id}`).then(res => {
            setConversation(res.data)
        })
    }, [loginUsers])

    useEffect(() => {
        socket.current = io("https://glacial-sea-16602.herokuapp.com/", { transports: ["websocket"] });
        socket.current.on("getMessage", (data) => {
            setArrivalMessages({
                sender: data.senderId,
                text: data.text,
                time: data.time,
            })
        })
    }, [])
    useEffect(() => {
        axios.get("https://rhubarb-cobbler-14699.herokuapp.com/allUser").then(data => setUsers(data))
    }, [])

    useEffect(() => {
        arrivalMessages && curremtChat?.member.includes(arrivalMessages.sender) && setMessages((prev) => [...prev, arrivalMessages])
    }, [arrivalMessages, curremtChat])

    useEffect(() => {
        socket.current.emit("addUser", loginUsers?._id, loginUsers)
        socket.current.on("getUsers", (users) => {
            const friendInfo = users.filter((f) => f?.userId !== loginUsers?._id)
            const friendArray = friendInfo.filter(n => n?.userInfo !== null)
            setOnlineUser(friendArray)
        })
    }, [loginUsers])
    useEffect(() => {
        const friend = users?.data?.filter(item => item?._id !== loginUsers?._id)
        setOfflineUser(friend)
    }, [users.data, loginUsers])


    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`https://rhubarb-cobbler-14699.herokuapp.com/messages/${curremtChat?._id}`)
                setMessages(res?.data);
            } catch (err) {
                console.log(err);
            }
        }
        getMessages()
    }, [newMessages, curremtChat])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessages !== "" && newMessages !== " ") {
            const receverId = await curremtChat?.member.find(mem => mem !== loginUsers?._id)
            const message = {
                senderId: loginUsers?._id,
                text: newMessages,
                converssationId: curremtChat?._id,
                time: new Date()
            }
            socket.current.emit("sendMessage", {
                senderId: loginUsers?._id,
                receverId: receverId,
                text: newMessages,
                time: new Date()
            })
            try {
                const res = await axios.post("https://rhubarb-cobbler-14699.herokuapp.com/messages", message)
                setMessages([...messages, res.data])
                setNewMessages("");
            } catch (err) {
                console.log(err);
            }
        }
    }

    const keyHandle = async (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            handleSubmit(e)
        }
    }
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handelesetMessage = async (reciverId) => {
        const alreadyAdd = conversation?.find(i => (i.member[0] === reciverId && i.member[1] === loginUsers?._id) || (i.member[1] === reciverId && i.member[0] === loginUsers?._id))
        if (alreadyAdd) {
            setCurremtChat(alreadyAdd)
        } else {
            const data = {
                member: [loginUsers?._id, reciverId]
            }
            try {
                const res = await axios.post("https://rhubarb-cobbler-14699.herokuapp.com/conversation", data)
                const accc = await axios.get(`https://rhubarb-cobbler-14699.herokuapp.com/conversatio/${res?.data?.insertedId}`)
                setCurremtChat(accc?.data)
                setConversation([...conversation, accc?.data])
            } catch (err) {
                console.log(err);
            }
        }
    }
    const handleDeleteMessage = (messageId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://rhubarb-cobbler-14699.herokuapp.com/messageDelete/${messageId}`, {
                    method: 'DELETE',
                    headers: { 'content-type': 'application/json' },
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount) {
                            const find = messages.filter(m => m._id !== messageId)
                            setMessages(find)
                            Swal.fire(
                                'Done',
                                'The Message has been successfully deleted!',
                                'success'
                            )
                        }
                    })
            }
        })
    }

    const handleDeleteConversation = (conversationId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://rhubarb-cobbler-14699.herokuapp.com/conversationDelete/${conversationId}`, {
                    method: 'DELETE',
                    headers: { 'content-type': 'application/json' },
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount) {
                            const find = conversation.filter(m => m._id !== conversationId)
                            setConversation(find)
                            Swal.fire(
                                'Done',
                                'The Conversation has been successfully deleted!',
                                'success'
                            )
                        }
                    })
            }
        })
    }

    const reserveConversation = [...conversation].reverse()


    return (

        <div className='messenger'>
            <div className="chatMenu">
                <div className="chatMenuWrapper">

                    {
                        reserveConversation.map((c) => (
                            <div key={Math.round()} onClick={() => setCurremtChat(c)}>
                                <Conversation handleDeleteConversation={handleDeleteConversation} conversation={c} loginUsers={loginUsers} key={Math.random()} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {
                        curremtChat ?
                            <>
                                <div className="chatBoxTop">
                                    {
                                        messages.map((m) => (
                                            <div key={Math.round()} ref={scrollRef}>
                                                <Message message={m} key={Math.random()} own={m?.senderId === loginUsers?._id} user={loginUsers} handleDeleteMessage={handleDeleteMessage} fd={loginUsers} />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="chatBoxButtom">
                                    <div className="search"><input placeholder='Write Something...'
                                        onChange={(e) => setNewMessages(e?.target?.value)}
                                        onKeyPress={keyHandle}
                                        value={newMessages} type="text" /> <button
                                            onClick={handleSubmit} className="btn"><FiSend /></button> </div>
                                </div>
                            </>
                            : <span className='open-chat'>Open a Conversation</span>
                    }
                </div>
            </div>
            <div className="chat">
                <div className="chatWrapper">
                    {
                        onlineUser.length > 0 ?
                            <>
                                <hr />
                                <span className='span'>Online Users</span>
                                <hr />
                            </> : null
                    }
                    {
                        onlineUser?.map((item) => (
                            <div key={item._id} onClick={() => handelesetMessage(item?.userId)} >
                                <ChatOnline key={item._id} user={item} />
                            </div>
                        ))
                    }
                    <hr />
                    <span className='span'>All Users</span>
                    <hr />
                    {
                        offlineUser?.map((item) => (
                            <div key={Math.random()} onClick={() => handelesetMessage(item?._id)} >
                                <Users item={item} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Messenger;