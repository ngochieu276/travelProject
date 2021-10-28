import React, { Fragment, useState, useContext } from "react";
import { Link } from "react-router-dom";

import "./PlaceItem.css";
import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElement/Modal";
import Map from "../../shared/components/UIElement/Map";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openMapHanler = () => {
    setShowMap(true);
  };
  const closeMapHanler = () => {
    setShowMap(false);
  };

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
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={showMap}
        onCancel={closeMapHanler}
        header={props.address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHanler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        footerClass='place-item__modal-actions'
        footer={
          <React.Fragment>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
          </React.Fragment>
        }
      >
        <h2>This action can't be undone</h2>
      </Modal>

      <div className={`place-item${props.userPlaces ? props.userPlaces : ""}`}>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          {props.creator ? (
            <Link to={`/${props.creator.id}/places`}>
              <h2>{props.creator.name}</h2>
            </Link>
          ) : null}
          <div className='place-item__image'>
            <Link to={`/${props.id}`}>
              <img
                src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                alt={props.title}
              />
            </Link>
          </div>
          <h2 className='place-item__date'>{props.date}</h2>

          <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.userPlaces ? props.description : null}</p>
          </div>
          <div className='place-item__action'>
            <Button inverse onClick={openMapHanler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creator.id && (
              <Button to={`/place/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creator.id && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
          <div className='place-item__react'></div>
        </Card>
      </div>
    </Fragment>
  );
};

export default PlaceItem;
