import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./AnimalForm.css";

const UpdateAnimal = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAnimal, setLoadedAnimal] = useState();
  const animalId = useParams().animalId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/animals/${animalId}`
        );
        setLoadedAnimal(responseData.animal);
        setFormData(
          {
            name: {
              value: responseData.animal.name,
              isValid: true,
            },
            description: {
              value: responseData.animal.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchAnimal();
  }, [sendRequest, animalId, setFormData]);

  const animalUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/animals/${animalId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/", +auth.userId + "/animals");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedAnimal && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the animal you are looking for!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedAnimal && (
        <form className="animal-form" onSubmit={animalUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedAnimal.name}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description of 5 characters minimum."
            onInput={inputHandler}
            initialValue={loadedAnimal.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE INFO
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateAnimal;
