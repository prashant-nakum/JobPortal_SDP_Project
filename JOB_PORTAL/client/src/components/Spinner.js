import RingLoader from "react-spinners/RingLoader";

const Spinner = () => {
  return (
    <>
      <div className="spinner-wrapper">
        <RingLoader color="#9c0e10" className="spinner" />
      </div>
    </>
  );
};

export default Spinner;
