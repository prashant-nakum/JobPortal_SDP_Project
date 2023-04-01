import { React, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });

  let name, value;

  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setContact({ ...contact, [name]: value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const { name, email, message } = contact;

    const res = await fetch("/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });
    if (res.status === 201) {
      toast.success("Message successfully sended");
      // window.alert("Message Sended Successfully");
      console.log("Message Sended Successfully");
    } else {
      toast.error("Message not sended");
      // window.alert("Message not Sended");
      console.log("Message not Sended");
    }
  };

  return (
    <>
      <div className="wrapper">
        <form className="form">
          <div className="pageTitle titlecontact">Contact Us </div>
          <div className="secondaryTitle titlecontact">
            We are open for any suggestions.
          </div>

          <input
            type="text"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleInputs}
            className="name formEntry"
            placeholder="Your Name"
            required
          />

          <input
            type="text"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleInputs}
            className="email formEntry"
            placeholder="Your Email"
            required
          />
          <textarea
            id="message"
            name="message"
            onChange={handleInputs}
            value={contact.message}
            className="message formEntry"
            placeholder="Message"
            required
          />

          <button className="submit formEntry" onClick={handleClick}>
            Send Message
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Contact;
