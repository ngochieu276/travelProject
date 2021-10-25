import React, { useContext, useState, useEffect, Fragment } from "react";
import { useParams } from "react-router";

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
          `http://localhost:5000/api/places/user/${userId}`
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
        <PlaceList items={loadPlaces} onDeletePlace={placeDeleteHandler} />
      )}
      ;
    </React.Fragment>
  );
};

export default UserPlaces;
