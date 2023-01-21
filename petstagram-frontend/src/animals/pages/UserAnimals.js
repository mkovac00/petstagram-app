import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AnimalList from "../components/AnimalList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserAnimals = () => {
  const [loadedAnimals, setLoadedAnimals] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/animals/user/${userId}`
        );
        setLoadedAnimals(responseData.animals);
      } catch (err) {}
    };
    fetchAnimals();
  }, [sendRequest, userId]);

  const animalCardDeletedHandler = (deletedAnimalCardId) => {
    setLoadedAnimals((prevAnimalCards) =>
      prevAnimalCards.filter(
        (animalCard) => animalCard.id !== deletedAnimalCardId
      )
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedAnimals && (
        <AnimalList
          items={loadedAnimals}
          onDeleteAnimalCard={animalCardDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserAnimals;
