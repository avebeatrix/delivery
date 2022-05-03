import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef } from 'react';
import { AddressSuggestions } from 'react-dadata';
import { YMaps, Map, Placemark, Polygon } from 'react-yandex-maps';
import * as turf from '@turf/turf'

const Address = props => {
  const [value, setValue] = React.useState();

  const isFirstRender = useRef(true);

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    value?.data?.geo_lat && props.updateData(value.data.geo_lat + ',' + value.data.geo_lon);
    
  }, [value]);

  return (
    <div className="address-container">
      <fieldset>
        <label>Адрес: <AddressSuggestions token="a6cb90372fd418364a490964fda6d184ded0a304" value={value} onChange={setValue} /></label>        
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
          obj.polygons.forEach((polygon) => {
            polygon.geometry.coordinates.forEach((coordinates, key1) => {
              coordinates.forEach((pair) => {
                [pair[0], pair[1]] = [pair[1], pair[0]]              
              })
            })
          })                        
          props.updateData(obj);
          setMapData(obj);
        });
      return;
    }
  }, [mapData]);

  return (    
    <div className="map-container">      
      <YMaps>        
          <Map width="100%" height="100%" defaultState={{ center: mapData.center, zoom: mapData.zoom }} modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}>    
              {mapData?.polygons?.map((p, key)=><Polygon
                  key={key}
                  geometry={p.geometry.coordinates}
                  properties={{
                    balloonContent: p.title.replace('\n','<br/>'),                   
                  }}
                  options={{                    
                    fillColor: p.fill.color,                    
                    fillOpacity: p.fill.opacity,
                    strokeWidth: p.stroke.width,
                    strokeColor: p.stroke.color,
                    strokeOpacity: p.stroke.opacity,
                    opacity:1,
                    strokeStyle: 'solid',                   
                  }}
                />)}                           
           
            <Placemark geometry={props?.userCoords?.split(',')} /> 
          </Map>     
      </YMaps>
    </div>
  )
 
}
const Price = (props) => { 

  let price = null;

  if (props.userCoords) {
      
      var pt = turf.point(props.userCoords.split(',').reverse());
      console.log(pt);

      // var poly = turf.polygon([[
        //   [-81, 41],
        //   [-81, 47],
        //   [-72, 47],
        //   [-72, 41],
        //   [-81, 41]
        // ]]);
    
        // turf.booleanPointInPolygon(pt, poly);
        //console.log(pt);   
    
      price = 'test';
      
  } 

  return (
    <div className="price-container">         
      Стоимость доставки по адресу: {price}
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
    console.log(mapData);
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
        <Price userCoords={state.coords} mapData={state.mapData} />      
    </div>
  );
}

export default App;
