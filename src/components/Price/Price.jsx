import * as turf from '@turf/turf';
import s from './Price.module.css';

const Price = (props) => {

    let targetPolygon = null;

    if (props.userCoords) {
        var pt = turf.point(props.userCoords.split(',').reverse());
        targetPolygon = props.mapPolygons.find(p => turf.booleanPointInPolygon(pt, turf.polygon(p.geometry.coordinates)))
    }

    return (
        <div className={s.PriceContainer + ' '+ (targetPolygon ? s._AV+'_available' : s._NA)}>
            {targetPolygon ? targetPolygon.title : 'Доставка по вашему адресу не производится'}
        </div>
    )
}

export default Price;