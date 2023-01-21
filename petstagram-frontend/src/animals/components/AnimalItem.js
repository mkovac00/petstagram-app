import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./AnimalItem.css";

const AnimalItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/animals/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Delete pet card?"
        footerClass="animal-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Are you sure you want to delete this pet card?</p>
      </Modal>

      <li className="animal-item">
        <Card className="animal-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="animal-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.name}
            />
          </div>
          <div className="animal-item__info">
            <h2>{props.name}</h2>
            <p>{props.description}</p>
          </div>
          <div className="animal-item__actions">
            {auth.userId === props.creatorId && (
              <Button to={`/animals/${props.id}`}>EDIT INFO</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE PET
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default AnimalItem;
