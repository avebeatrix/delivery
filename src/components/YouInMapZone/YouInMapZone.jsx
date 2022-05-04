import React, { useState } from 'react';
import Address from '../Address/Address';
import MapZone from '../MapZone/MapZone';
import Price from '../Price/Price';

const YouInMapZone = (props) => {
    const [state, setState] = useState({ url: '' });

    const updateCoords = (coords) => {
        setState(prevState => ({
            ...prevState,
            coords
        })
        )
    }

    const updateMapData = (mapData) => {
        setState(prevState => ({
            ...prevState,
            mapData
        })
        )
    }

    return (
        <div className="container">
            <MapZone userCoords={state.coords} updateData={updateMapData} />
            <Address updateData={updateCoords} />
            {state.mapData?.polygons && state?.coords && <Price userCoords={state.coords} mapPolygons={state.mapData.polygons} />}
        </div>
    );
}
export default YouInMapZone;