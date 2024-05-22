import React from 'react';
import './index.css';

const Result = ({word, phonetics, meanings, setText}) => {
    
    return (
        <ul>
            <li className="world">
                <h2>{word}</h2>
                {
                    phonetics.map((phonetic, index) => (
                        <span key={index}>{phonetic.text}</span>
                    ))
                }
            </li>

            {
                meanings.map((meaning, index) => (
                    <li className="contain" key={index}>
                        <h3>Noun</h3>
                        
                        <div className="details meaning">
                            <h3>Meaning</h3>
                            {
                                meaning.definitions.map((definition, defIndex) => (
                                    <p key={defIndex}>- {definition.definition}</p>
                                ))
                            }
                        </div>
                        
                        {
                            meaning.synonyms.length !== 0 &&
                            <div className="details synonyms">
                                <h3>Synonyms</h3>
                                {
                                    meaning.synonyms.map((synonym, synIndex) => (
                                        <p key={synIndex}
                                           onClick={() => setText(synonym)}>
                                            - {`${synonym}, `}
                                        </p>
                                    ))
                                }
                            </div>
                        }
                    </li>
                ))
            }
        </ul>
    )
};

export default Result;
