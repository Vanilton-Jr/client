import React, { useEffect, useState } from "react";

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes()
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
        return () => socket.on("receive_message"); 
    }, [socket]);

    return (
        <div className="chat-container">
            <div className='chat-header'>
                <p>Live Chat</p><br />
                <p>--- {room} ---</p>
            </div>
            <div className='chat-body'>{
                messageList.map((messageContent) => {
                    return (
                        <div className="message" id={username === messageContent.author ? "you" : "other"}>
                            <div>
                                <div className="message-content"> 
                                         <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta"> 
                                 <p>{messageContent.author}</p>
                                 <p>{messageContent.time}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
                )}
            </div>
            <div className='chat-footer'>
                <input className="message-input" type='text' placeholder="message" onChange={(event) => { setCurrentMessage(event.target.value); }} />
                <button className="message-butt" onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat