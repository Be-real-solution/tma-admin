import { FormLabel, TextField } from "@mui/material";
import { useState, useEffect, createRef } from "react";
// import searchIcon from "../../../../public/assets/logos/search-icon.svg";
// import navigatorIcon from "../../../../public/assets/assets/images/navigator-icon.svg";

import { YMaps, Map, Placemark, ZoomControl } from "react-yandex-maps";



const MAP_APIKEY = process.env.NEXT_PUBLIC_ANALYTICS_MAPKEY || 'fdb5c81e-ce1a-4b37-be9d-23d7e6a06657'

const Modal = ({ shown, close, setMapModal, localization }) => {
   const [currentLocation, setCurrentLocation] = useState(shown.data ? [shown.data.lat, shown.data.long] : [
      41.29786742859592, 69.27929530550301
   ]);

   console.log(shown.data);
   const [locationName, setLocationName] = useState(shown.data.address);
   const [searchLocation, setSearchLocation] = useState("");
   const [zoom, setZoom] = useState(17);
   const [searchList, setSearchList] = useState({ open: false, data: [] });
   

   const mapState = {
      center: currentLocation,
      zoom: zoom,
   };
   const latitude = currentLocation[0] // Replace with the latitude of the location
   const longitude = currentLocation[1] // Replace with the longitude of the location


   useEffect(() => {
      try {
      
         fetch(`https://api.express24.uz/client/v4/geocode/by-coordinates?latitude=${latitude}&longitude=${longitude}`)
            .then(response => response.json())
            .then(data => {
               console.log(data);
               const address =  data.name  
              //  data.response?.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted;

               setLocationName(address); // Prints the location name to the console
               setSearchLocation(address);
            })
            .catch(error => console.error(error));
         setSearchList([]);
      } catch (error) {
         console.error(error.message);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentLocation]);

   useEffect(() => {
      try {
         if (searchLocation) {
            fetch(`https://api.express24.uz/client/v4/geocode/by-address?query=${searchLocation}`)
               .then((res) => res.json())
               .then((data) => {
                if (data.errors) {
                        setSearchList({ open: searchList.open, data: [] });
                    }
                    setSearchList({ open: searchList.open, data: data });
               })
               .catch((e) => {
                  console.error(e.message);
               });
         } else {
            setSearchList({ open: searchList.open, data: [] });
         }
      } catch (error) {
         console.error(error.message);
         // router.push("/error");
      }
   }, [searchLocation]);


function GettingCurrentPosition() {
   navigator.geolocation.getCurrentPosition(
      (position) => {
         setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
         console.error(error);
      }
   );
}

   useEffect(() => {
      !shown.data.lat && GettingCurrentPosition()
   }, [shown]);



   return (
      <>
         {shown && shown.status ? (
            <div className="modal-backdrop"   onClick={() => {
                           setMapModal({
                              status: false,
                              data: {
                                 lat: latitude.toString(),
                                 long: longitude.toString(),
                                 address: locationName
                           }})
                        }}>
               <div
                  className="location-modal"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="location-modal__title-wrapper">
                     <h3 className="location-modal__title">
                        {localization.table.address}
                     </h3>

                     <button className="close-btn"
                        type="button"
                        onClick={() => {
                           close()
                        }}>
                        &times;
                     </button>
                  </div>
                  <div className="location-modal__search-box">
                     <div className="location-modal__location-search">
                        <span>
                           <img src={"/assets/logos/search-icon.svg"} alt="searchicon" />
                        </span>

                        <input
                           required={false}
                           type="search"
                           defaultValue={locationName} value={searchLocation} className="location-modal__location-search-input"
                           onClick={() => {
                              setSearchList({ open: !searchList.open, data: searchList.data });
                           }} onChange={(e) => {
                              setSearchLocation(e.target.value)
                           }
                           } 
                        />
                     </div>

                     <ul className="location-name-list">
                        {searchLocation?.length > 1 &&
                           searchList.open &&
                           searchList.data?.length
                           ? searchList?.data?.map((e, i) => {
                              return (
                                 <>
                                    <li
                                       className="location-name-item"
                                       key={i}
                                       onClick={() => {
                                          setSearchLocation("");
                                          setCurrentLocation([
                                             e.coords.latitude,
                                             e.coords.longitude,
                                          ]);
                                          setSearchList({
                                             open: false,
                                             data: [],
                                          });
                                       }}>
                                       
                                       {e.name}
                                    </li>
                                 </>
                              );
                           })
                           : null}
                     </ul>
                     <button
                        type="button"
                        className="location-modal__btn"
                        onClick={() => {
                           setMapModal({
                              status: false,
                              data: {
                                 lat: latitude.toString(),
                                 long: longitude.toString(),
                                 address: locationName
                           }})
                        }}>
                        {localization.continue}
                     </button>
                  </div>
                  <div className="map-wrapper map-wrapper-web">                 
                     <button
                        type="button"
                        onClick={() => {
                           navigator.geolocation.getCurrentPosition(function (
                              position,
                           ) {
                              setCurrentLocation([
                                 position.coords.latitude,
                                 position.coords.longitude,
                              ]);
                           });
                        }}
                        className="current-location-btn">
             <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-location-filled" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0 0 1 -1.409 .903a1.547 1.547 0 0 1 -1.329 -.747l-.065 -.127l-3.352 -6.702l-6.67 -3.336a1.55 1.55 0 0 1 -.898 -1.259l-.006 -.149c0 -.56 .301 -1.072 .841 -1.37l.14 -.07l18.017 -6.506l.106 -.03l.108 -.018z" stroke-width="0" fill="currentColor" />
</svg>

                        </button>
                     <YMaps
                        enterprise
                        query={{
                           apikey: MAP_APIKEY,
                        }}>
                        <Map
                           
                              onBoundsChange={(e) => {
                              setZoom(e.get("newZoom"));
                              setCurrentLocation(e.get("newCenter"));
                           }}      
                           
                           width="100%"
                              height="100%"
                           state={mapState}
                           >
                          

                           <Placemark
                    options={{
                        preset: "islands#dotIcon",
                        iconColor: "#F96B09",
                        draggable: true // Make the Placemark draggable
                    }}
                    geometry={currentLocation}
                    onDragEnd={(e) => {
                        const newCoords = e.get('target').geometry.getCoordinates();
                        setCurrentLocation(newCoords); // Update the state with new coordinates
                    }}
                />                      
                           <ZoomControl options={{ size: "small", position: { top: 10, right: 10 } }}
                           />
                    
                           </Map>
                              
                     </YMaps>
                  </div>
               </div>
            </div>
         ) : null}
      </>
   );
};

function LocationModal({ mapModal, setMapModal, localization }) {
   return (
      <>
    
       
            <TextField
               fullWidth
            autoComplete="off"
            onClick={() => setMapModal({ status: !mapModal.status, data: mapModal.data })}
               value={mapModal?.data && mapModal?.data?.address} 
               label={localization.table.address}
            />

         <Modal
            localization={localization}
            shown={mapModal}
            setMapModal={setMapModal}
            close={() => {
               setMapModal({status:!mapModal.status, data:mapModal.data});
            }}></Modal>
      </>
   );
}

export default LocationModal;