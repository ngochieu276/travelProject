import React from "react";

import Card from "../../shared/components/UIElement/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='place-list-center'>
        <Card>
          <h2>No places found.Maybe created one ?</h2>
          <Button to='/place/new'>Shared place</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`place-list${props.userPlaces ? props.userPlaces : ""}`}>
      {props.items.map((place) => {
        return (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            date={place.date}
            creator={place.creator}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            onDelete={props.onDeletePlace}
            userPlaces={props.userPlaces}
          />
        );
      })}
    </div>
  );
};

export default PlaceList;
