import React, { useState, useRef, useEffect } from 'react';
import { YMaps, Map, Placemark, Polygon } from 'react-yandex-maps';
import s from './MapZone.module.css';

const MapZone = props => {

    const [mapData, setMapData] = useState({});
  
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
      <div className={s.MapContainer}>
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
  export default MapZone;