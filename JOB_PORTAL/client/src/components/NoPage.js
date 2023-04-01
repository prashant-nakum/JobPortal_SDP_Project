import ErrPhoto from "../images/img4.gif";

const NoPage = () => {
  return (
    <>
      <div className="error-page">
        <h1 className="err-h">Oops!</h1>
        <p className="err-msg">Something went wrong.</p>
        <img src={ErrPhoto} alt="Error" className="error-img" />
        <button className="errbtn" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </>
  );
};

export default NoPage;
