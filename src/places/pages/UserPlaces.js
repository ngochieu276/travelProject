import React, { useContext, useState, useEffect, Fragment } from "react";
import { useParams } from "react-router";
import "./UserPlaces.css";

import PlaceList from "../components/PlaceList";

import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadPlaces, setLoadedPlaces] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletePlaceId) => {
    console.log("hey");
    setLoadedPlaces((prev) =>
      prev.filter((place) => place.id !== deletePlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadPlaces && (
        <React.Fragment>
          <h2 className='userPlaces-title'>
            The journey of {loadPlaces[0].creator.name}
          </h2>
          <PlaceList
            items={loadPlaces}
            userPlaces='-userPlaces'
            onDeletePlace={placeDeleteHandler}
          />
        </React.Fragment>
      )}
      ;
    </React.Fragment>
  );
};

export default UserPlaces;
