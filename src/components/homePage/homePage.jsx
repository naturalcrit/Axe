import React from "react";
import "./homePage.css";
import Nav from "../nav/navBar";

const Home = () => {
    return (
        <div className="home page">
            <Nav />
            <main className="content">
                <section id="about">
                    <div className="text">
                        <h2>About Axe</h2>
                        <p>
                            Axe is a web application that allows users to build
                            and share custom character sheets for any RPG out
                            there, using a simple Drag n Drop system.
                        </p>
                        <p>
                            It's part of the{" "}
                            <a href="http://naturalcrit.com">
                                NaturalCrit project
                            </a>
                            , a set of tools for DMs to improve their experience
                            building a world, or even an entire RPG. You may
                            have heard of the most famous tool we have,{" "}
                            <a href="https://homebrewery.naturalcrit.com/">
                                The Homebrewery
                            </a>
                            , a tool to build documents with custom stylings,
                            normally used to create homebrew resembling official
                            D&D books.
                        </p>
                        <p>
                            This project has some costs to it, so if you want
                            to, you can join us on{" "}
                            <a href="https://www.patreon.com/NaturalCrit">
                                our patreon
                            </a>{" "}
                            and help us keep our servers running.
                        </p>
                    </div>
                    <div className="image">
                        <img
                            src={require("../../assets/images/HB_homepage.png")}
                            alt="Homebrewery Home Page"
                        />
                    </div>
                </section>

                <hr />

                <section id="howToUse">
                    <div className="image">
                        <img
                            src={require("../../assets/images/Axe_Builder.png")}
                            alt="Homebrewery Home Page"
                        />
                    </div>
                    <div className="text">
                        <h2>How To Use Axe?</h2>
                        <p>
                            Axe is a pretty complex tool designed to make the
                            user experience easier, character sheets are rapidly
                            designed with a few clicks and drags.
                        </p>
                        <p>
                            To get started, check our navigation bar for the
                            link to our builder page. There you can start
                            creating your own Character Sheet by clicking to add
                            premade components like building blocks, customizing
                            them, and moving them around. We also offer some
                            settings to give you the best possible output, such
                            as page size controls, or some basic styling.
                        </p>
                        <p>
                            Using CSS, you can style your character sheet in any
                            way imaginable, although it is harder to learn than
                            a simple form.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;