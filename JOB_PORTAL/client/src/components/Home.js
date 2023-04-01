import { React, useState} from "react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
   const navigate = useNavigate();
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`viewjob?qparam=${searchTerm}`, { replace: true });
  };

  return (
    <>
      <div className="Home">
        <div className="search__container_home spacehome" id="serch">
          <input
            className="search__input_home"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button
            className="search__button_home"
            type="submit"
            onClick={handleSearchSubmit}
          >
            Search
          </button>
        </div>
        <div className="content_home">
          <h1 className="big-home-text">Find Your Dream Jobs Here</h1>
          <p className="small-home-text">
            Our Platform Will Help To Achieve Candidates Dreams And Get Their
            Dream Jobs..
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
