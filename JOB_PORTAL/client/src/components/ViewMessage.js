import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessage = async () => {
    try {
      const res = await fetch("/getMessages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.info("Message fetch successfully");
        console.log("message fetch successfully");
        setMessages(data);
        setLoading(false);
      } else {
        toast.error("something went wrong");
        console.log("message is not fetch successfully");
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      toast.error("something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessage();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/message/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result) {
        toast.success("Message Deleted Successfully");
        setLoading(true);
        fetchMessage();
      }
    } catch (err) {
      toast.error("something went wrong");
      console.log(err);
    }
  };

  const handleRead = async (id) => {
    const res = await fetch(`/markMessage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        marked: 1,
      }),
    });
    if (res.status === 200) {
      setLoading(true);
      fetchMessage();
      toast.success("Message Updated successfully");
      console.log("Message Updated successfully");
    } else {
      toast.error("Message not updated");
      console.log("Message not updated");
    }
  };

  return (
    <>
      <div className="messages-cards">
        {loading ? (
          <Spinner />
        ) : (
          messages.map((message) => (
            <div className="message-card" key={message.name}>
              <div className="message-header">
                <h3 className="message-title">{message.name}</h3>
                <p className="message-date">{message.email}</p>
              </div>
              <div className="message-body">
                <p className="message-text">{message.message}</p>
              </div>

              <div className="message-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(message._id)}
                >
                  Delete
                </button>
                <div className="message-read">
                  <input
                    type="checkbox"
                    checked={message.marked}
                    onChange={() => handleRead(message._id)}
                    disabled={message.marked === 1}
                  />
                  <span>Mark as Read</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default ViewMessage;
