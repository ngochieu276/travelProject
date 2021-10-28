import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import PlaceItem from "../components/PlaceItem";
import "./HomePlaceList.css";

import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const PlaceDetail = () => {
  const placeId = useParams().placeId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadPlace, setLoadedPlace] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );

        setLoadedPlace(responseData.place);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadPlace && (
        <React.Fragment>
          <PlaceItem
            key={loadPlace.id}
            id={loadPlace.id}
            image={loadPlace.image}
            title={loadPlace.title}
            date={loadPlace.date}
            creator={loadPlace.creator}
            description={loadPlace.description}
            address={loadPlace.address}
            creatorId={loadPlace.creator}
            coordinates={loadPlace.location}
            userPlaces={loadPlace.userPlaces}
          />
        </React.Fragment>
      )}
      ;
    </React.Fragment>
  );
};

export default PlaceDetail;
