import React, { useContext } from "react";
import { ViewContext } from "../../context/view.ts";

import background from "../../assets/home-background.png";

import "./Home.scss";
import { Footer } from "../../components/footer/Footer.tsx";

export const Home = () => {
  const { setView } = useContext(ViewContext);

  const onClick = () => {
    setView("scan");
  };
  return (
    <>
      <article className="view view--home">
        <h1 className="home__title">
          Build your site with <span>real blocks</span>
        </h1>
        <p className="home__description">
          Arrange the puzzles, take a picture, and see your setup come to life
          in seconds.
        </p>
        <button
          onClick={onClick}
          className="button button--primary home__action"
        >
          Build your site
        </button>
        <img src={background} alt="Playground sites" className="home__image" />
      </article>
      <Footer />
    </>
  );
};
