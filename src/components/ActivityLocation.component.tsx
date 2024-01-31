import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export function ActivityLocation(props: { lat: number; lng: number }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    //TODO: Setup this API KEY properly
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  });

  const center = {
    lat: props.lat,
    lng: props.lng,
  };

  const mapStyles = {
    width: '50%',
    height: '100%',
  };

  return isLoaded ? (
    <GoogleMap mapContainerStyle={mapStyles} center={center} zoom={15}>
      <Marker position={{ lat: props.lat, lng: props.lng }} />
    </GoogleMap>
  ) : (
    <></>
  );
}
