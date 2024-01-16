import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export function ActivityLocation() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    //TODO: Setup this API KEY properly
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  });

  const center = {
    lat: 55.67932493025922,
    lng: 12.589861474856367,
  };

  const mapStyles = {
    width: '50%',
    height: '100%',
  };

  return isLoaded ? (
    <GoogleMap mapContainerStyle={mapStyles} center={center} zoom={15}>
      <Marker position={{ lat: 55.67932493025922, lng: 12.589861474856367 }} />
    </GoogleMap>
  ) : (
    <></>
  );
}
