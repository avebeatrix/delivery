import React, { useState, useEffect } from 'react';
import { AddressSuggestions } from 'react-dadata';
import s from './Address.module.css';

const Address = props => {
    const [value, setValue] = useState();

    useEffect(() => {       
        value?.data?.geo_lat && props.updateData(value.data.geo_lat + ',' + value.data.geo_lon);

    }, [value]);

    return (
        <div className={s.AddressContainer}>
            <fieldset>
                <label>Адрес: <AddressSuggestions token={process.env.REACT_APP_DADATA_TOKEN} value={value} onChange={setValue} /></label>
            </fieldset>
        </div>
    )

}
export default Address;