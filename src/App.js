import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef } from 'react';
import { AddressSuggestions } from 'react-dadata';
import { YMaps, Map, Placemark, Polygon } from 'react-yandex-maps';

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
    <fieldset>
      <label>Адрес:</label>
      <AddressSuggestions token="a6cb90372fd418364a490964fda6d184ded0a304" value={value} onChange={setValue} />
    </fieldset>
  )

}

const MyMap = props => {

  const [mapData, setMapData] = React.useState({});

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false // toggle flag after first render/mounting
      fetch('data.json')
        .then(response => response.json())
        .then(data => {  
          console.log(data);
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
          
          setMapData(obj);
        });
      return;
    }
  }, [mapData]);

  return (    
    <div>      
      <YMaps>        
          <Map defaultState={{ center: mapData.center, zoom: mapData.zoom }} >    
              {mapData?.polygons?.map((p, key)=><Polygon
                  geometry={mapData.polygons[key].geometry.coordinates}
                  options={{
                    fillColor: '#00FF00',
                    strokeColor: '#0000FF',
                    opacity: 0.5,
                    strokeWidth: 5,
                    strokeStyle: 'shortdash',
                  }}
                />)}                           
           
            <Placemark geometry={props?.userCoords?.split(',')} /> 
          </Map>     
      </YMaps>
    </div>
  )
 
}
class Price extends React.Component {
  render() {
    return (
      <div>
        Стоимость доставки по адресу:
      </div>
    )
  }
}

function App() {

  const [state, setState] = React.useState({ url: '' });
 
  const updateCoords = (coords) => {
    setState(prevState => ({
      ...prevState,
      coords: coords
    })
    )
    console.log(coords);
  }

  return (
    <div className="container">
      <div>
        <Address updateData={updateCoords} />        
      </div>
      <div>
        <MyMap userCoords={state.coords} />
        <Price />
      </div>
    </div>
  );
}

export default App;
