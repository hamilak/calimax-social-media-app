import { FC, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Input, InputGroup, List } from 'rsuite';
import { AiOutlineSend } from 'react-icons/ai';
import io from 'socket.io-client'
import { MessageResponseValues } from '../Types/ResponseValues';
import axiosInstance from '../interceptor/axiosInstance';

const Messages: FC = () => {
    const socketURL = 'http://localhost:8080'

    const [socket, setSocket] = useState<any>(null)
    const [messages, setMessages] = useState<MessageResponseValues[]>([]);
    const [text, setText] = useState<string>('')
    const [selectedMessage, setSelectedMessage] = useState<MessageResponseValues | null>(null);

    const handleSelectMessage = (message: MessageResponseValues) => {
        setSelectedMessage(message);
    };
 
    useEffect(() => {
        const handleGetUserMessages = async () => {
            if(selectedMessage) {
                try {
                const response = await axiosInstance.get(`/api/messages/${selectedMessage.receiverId._id}`)
                console.log(response)
                if(response.status === 200) {
                    setMessages(response.data)
                }
            } catch (error) {
                console.error(error)
            }
            }
        }

        handleGetUserMessages()
    }, [selectedMessage])

    const handleSendMessage = async (receiverId: string) => {
        if (text.trim() && selectedMessage) {

            const response = await axiosInstance.post(`/api/message`, { receiverId, text })
            console.log(response)
            socket.emit('sendMessage', text);

            setText('');
        }
    };

    useEffect(() => {
        const socketConnection = io(socketURL)
        setSocket(socketConnection);

        socketConnection.on('receiveMessage', (message: MessageResponseValues) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socketConnection.disconnect();
        };

    }, [])

    return (
        <Layout>
            <div className="flex gap-4 h-full">
                <div className="w-1/3 overflow-auto max-h-full">
                    <div>
                        <h6>Messages</h6>
                    </div>
                    <div className="mt-2 max-h-screen overflow-auto">
                        <List>
                            {messages.length === 0 ? (
                                <List.Item>No messages available</List.Item>
                            ) : (
                                messages.map((message) => (
                                    <List.Item
                                        key={message._id}
                                        onClick={() => handleSelectMessage(message)}
                                        className="cursor-pointer hover:bg-gray-100"
                                    >
                                        <img
                                            src={message.senderId.profilePicture}
                                            alt="pfp"
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <div>
                                            <strong>{message.senderId.username}</strong>
                                            <p>{message.text}</p>
                                        </div>
                                    </List.Item>
                                ))
                            )}
                        </List>
                    </div>
                </div>
                <div className="w-2/3 border-l px-3 overflow-auto max-h-full">
                    {selectedMessage ? (
                        <>
                            <h6>{selectedMessage.senderId.username}</h6>
                            <div className="max-h-screen overflow-auto mt-2">
                                <List>
                                    <List.Item>{selectedMessage.text}</List.Item>
                                </List>
                                <div className='fixed bottom-10 flex justify-center w-1/2'>
                                    <form onSubmit={() => handleSendMessage(selectedMessage.receiverId._id)}>
                                        <InputGroup>
                                        <Input placeholder='Type message...' />
                                        <InputGroup.Addon>
                                            <button type='submit' className='flex gap-1'><AiOutlineSend />Send</button>
                                        </InputGroup.Addon>
                                    </InputGroup>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Click a chat to see chats</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Messages;
