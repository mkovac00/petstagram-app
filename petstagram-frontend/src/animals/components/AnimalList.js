import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from '../../shared/components/FormElements/Button';
import AnimalItem from "./AnimalItem";
import "./AnimalList.css";

const AnimalList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="animal-list center">
        <Card>
          <h2>No pets found yet. You can create a new pet card!</h2>
          <Button to="/animals/new">CREATE</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="animal-list">
      {props.items.map((animal) => (
        <AnimalItem
          key={animal.id}
          id={animal.id}
          image={animal.image}
          name={animal.name}
          description={animal.description}
          creatorId={animal.creator}
          onDelete={props.onDeleteAnimalCard}
        />
      ))}
    </ul>
  );
};

export default AnimalList;
