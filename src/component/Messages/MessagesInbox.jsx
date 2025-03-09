import React, { useEffect, useRef, useState } from "react";
import EmojiPickerComponent from "./EmojiPickerComponent.jsx";
import { useDispatch, useSelector } from "react-redux";
import Attachment from "../Messages/Attachment.jsx";
import MsgSeparator from "../Messages/MessageSeparator.jsx";
import Document from "../Messages/Document.jsx";
import Text from "../Messages/Text.jsx";
import Media from "../Messages/Media.jsx";
import {
    getDirectChatHistory,
    sendDirectMessage,
} from "../../socket/socketConnection.js";
import { format } from "date-fns";

export default function MessagesInbox() {
    const dispatch = useDispatch();
    const containerRef = useRef(null);

    const { currentUser } = useSelector((state) => state.user);
    const { currentConversation, conversations } = useSelector(
        (state) => state.chat
    );

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [currentConversation, conversations]);

    const this_conversation = conversations.find(
        (el) => el._id === currentConversation
    );
    const this_user = this_conversation?.participants.find(
        (e) => e._id !== currentUser.data._id
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getDirectChatHistory({ conversationId: currentConversation });
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, [currentConversation]);

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => setInputValue(e.target.value);
    const handleEmojiSelect = (emoji) => setInputValue((prev) => prev + emoji);

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            sendDirectMessage({
                conversationId: currentConversation,
                message: {
                    author: currentUser.data._id,
                    type: "Text",
                    content: inputValue.trim(),
                },
            });
            setInputValue("");
        }
    };

    const formatTime = (dateString) =>
        new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

    const MSG_LIST =
        this_conversation?.messages?.map((msg) => ({
            id: msg._id,
            incoming: msg.author !== currentUser.data._id,
            content: msg.content,
            timestamp: formatTime(msg.date),
            authorName:
                msg.author !== currentUser.data._id
                    ? this_user?.name
                    : currentUser.data.name,
            type: msg.type,
            date: msg.date,
            document: msg.document,
            media: msg.media,
        })) || [];

    return (
        <>
            {currentConversation ? (
                <div className="flex h-full flex-col bg-gray-100 shadow-lg rounded-lg overflow-hidden">

                    <div className="sticky flex items-center justify-between bg-white px-6 py-3 border-b-2 border-gray-300 shadow-md">
                        <div className="flex items-center">
                            {this_user?.avatar ? (
                                <img
                                    src={this_user.avatar}
                                    alt="avatar"
                                    className="h-12 w-12 rounded-full shadow-md"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                                    {this_user?.name.charAt(0)}
                                </div>
                            )}
                            <div className="ml-4">
                                <h5 className="text-lg font-semibold text-gray-800 ">
                                    {this_user?.name}
                                </h5>
                                <p className="text-sm text-gray-600 ">
                                    {this_user?.designation}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div ref={containerRef} className="flex-1 overflow-auto px-6 py-4 space-y-3">
                        {MSG_LIST.map((message, index) => (
                            <React.Fragment key={message.id}>
                                {index === 0 ||
                                format(new Date(MSG_LIST[index - 1].date), "yyyy-MM-dd") !==
                                    format(new Date(message.date), "yyyy-MM-dd") ? (
                                    <MsgSeparator date={message.date} />
                                ) : null}

                                {message.type === "Text" && (
                                    <Text
                                        incoming={message.incoming}
                                        content={message.content}
                                        timestamp={message.timestamp}
                                    />
                                )}
                                {message.type === "Document" && (
                                    <Document
                                        incoming={message.incoming}
                                        content={message.content}
                                        timestamp={message.timestamp}
                                        document={message.document}
                                    />
                                )}
                                {message.type === "Media" && (
                                    <Media
                                        incoming={message.incoming}
                                        media={message.media}
                                        caption={message.content}
                                        timestamp={message.timestamp}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="sticky bottom-0 bg-white px-6 py-3 border-t-2 border-gray-300 shadow-md">
                        <form className="flex items-center space-x-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="w-full rounded-md border border-gray-300 py-2.5 pl-5 pr-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-3">
                                    <button className="text-gray-500 hover:text-blue-500">
                                        <Attachment />
                                    </button>
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        className="text-gray-500 hover:text-blue-500"
                                    >
                                        <EmojiPickerComponent
                                            onSelectEmoji={handleEmojiSelect}
                                        />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                disabled={!inputValue.trim()}
                                className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all ${
                                    !inputValue.trim()
                                        ? "bg-gray-300 text-gray-600"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                <i className="pi pi-send py-2"></i>
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    No Conversation Selected
                </div>
            )}
        </>
    );
}
