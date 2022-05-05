import React, { useState, useEffect, useRef } from 'react';
import { AddressSuggestions } from 'react-dadata';
import s from './Address.module.css';
import 'react-dadata/dist/react-dadata.css';

const Address = props => {
    const [value, setValue] = useState();
    const suggestionsRef = useRef(null);
    useEffect(() => {       
        value?.data?.geo_lat && props.updateData(value.data.geo_lat + ',' + value.data.geo_lon);
               
        if (suggestionsRef.current) {
            suggestionsRef.current.focus();           
        }
      
    }, [value]);

    return (
        <div className={s.AddressContainer}>
            <fieldset>
                <label><div>Адрес:</div> <AddressSuggestions ref={suggestionsRef} token={process.env.REACT_APP_DADATA_TOKEN} value={value} onChange={setValue} /></label>
            </fieldset>
        </div>
    )

}
export default Address;