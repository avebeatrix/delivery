import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef } from 'react';
import { AddressSuggestions } from 'react-dadata';
import { YMaps, Map, Placemark, Polygon } from 'react-yandex-maps';
import * as turf from '@turf/turf'

const Address = props => {
  const [value, setValue] = React.useState();

  useEffect(() => {
    value?.data?.geo_lat && props.updateData(value.data.geo_lat + ',' + value.data.geo_lon);

  }, [value]);

  return (
    <div className="address-container">
      <fieldset>
        <label>Адрес: <AddressSuggestions token={process.env.REACT_APP_DADATA_TOKEN} value={value} onChange={setValue} /></label>
      </fieldset>
    </div>
  )

}

const MyMap = props => {

  const [mapData, setMapData] = React.useState({});

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetch('data.json')
        .then(response => response.json())
        .then(data => {
          let obj = {
            ...mapData,
            center: data.map.center.reverse(),
            zoom: data.map.zoom,
            features: data.features,
            polygons: data.features.filter(feature => feature.type === 'polygon')
          }
          props.updateData(obj);
          setMapData(obj);
        });
      return;
    }
  }, [mapData]);

  return (
    <div className="map-container">
      {mapData.center && <YMaps>
        <Map width="100%" height="100%" defaultState={{ center: mapData.center, zoom: mapData.zoom }} modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}>
          {mapData?.polygons?.map((p, key) => <Polygon
            key={key}
            geometry={p.geometry.coordinates.map((coordinates) => coordinates.map((pair) => [pair[1], pair[0]]))}
            properties={{
              balloonContent: p.title.replace('\n', '<br/>'),
            }}
            options={{
              fillColor: p.fill.color,
              fillOpacity: p.fill.opacity,
              strokeWidth: p.stroke.width,
              strokeColor: p.stroke.color,
              strokeOpacity: p.stroke.opacity,
              strokeStyle: 'solid',
            }}
          />)}

          <Placemark geometry={props?.userCoords?.split(',')} />
        </Map>
      </YMaps>}
    </div>
  )

}
const Price = (props) => {
 
  let targetPolygon = null;

  if (props.userCoords) {
    var pt = turf.point(props.userCoords.split(',').reverse());   
    targetPolygon = props.mapPolygons.find(p =>turf.booleanPointInPolygon(pt, turf.polygon(p.geometry.coordinates)))    
  }

  return (
    <div className="price-container">
      {targetPolygon ? targetPolygon.title : 'Доставка по вашему адресу не производится'}
    </div>
  )
}

function App() {

  const [state, setState] = React.useState({ url: '' });

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
      <MyMap userCoords={state.coords} updateData={updateMapData} />
      <Address updateData={updateCoords} />
      {state.mapData?.polygons && state?.coords && <Price userCoords={state.coords} mapPolygons={state.mapData.polygons} />}
    </div>
  );
}

export default App;
