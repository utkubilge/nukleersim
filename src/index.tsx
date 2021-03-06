import "./style.css";
import * as React from "react";
import * as ReactDom from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";

const api_secret: string = process.env.REACT_APP_SECRET ?? 'default'
const render = (status: Status) => {
  return <h1>{status}</h1>;
};


//main runner
const App: React.VFC = () => {
  //constonant functions
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(15); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 37.886386120532155,
    lng: 30.866635632735136
  });
  const [pow, setPow] = React.useState(10);
  const [p, setp] = React.useState(10);
  const onClick = (e: google.maps.MapMouseEvent) => {
    setClicks([...clicks, e.latLng!]);
  };
  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
    setPow(pow);
  };


  function fireball(p) { return Math.round(((Math.pow(pow * 1000, 0.4) * 145 / 3.3) / 10)) }
  function hblast(p) { return Math.round((Math.pow(p * 1000, 0.33) * 0.28) * 100) }
  function mblast(p) { return Math.round(Math.pow(p * 400, 0.33) * 70) }
  function radiation(p) { return Math.round(Math.pow(p * 400, 0.19) * 250) }
  function thermal(p) { return Math.round(Math.pow(p * 400, 0.41) * 50) }
  function lblast(p) { return Math.round((Math.pow(p * 400, 0.33) * 70 * 2.5)) }



  //gui div buttons
  const form = (
    <div className="formdiv"
      style={{

        padding: "1%",
        boxSizing: "border-box",
        height: "100%",
        background: "#ebe9e4",
        width: "15%",
        flexBasis: "250px"
      }}>
      <h1>Nükleer Simülasyon</h1>
      <h3>Baha Utku Bilge ve </h3>
      <h3>Emirhan Portakal tarafından yapılmıştır</h3>
      <br /><br />


      {/* enlem */}
      <label htmlFor="lat">Enlem</label>
      <input
        type="number"
        id="lat"
        name="lat"
        value={center.lat}
        onChange={(event) =>
          setCenter({ ...center, lat: Number(event.target.value) })
        }
      />
      <br /> <br />

      {/* boylam */}
      <label htmlFor="lng">Boylam</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={center.lng}
        onChange={(event) =>
          setCenter({ ...center, lng: Number(event.target.value) })
        }
      />
      <br /><br />

      {/* güç */}
      <label htmlFor="pow">Patlayıcı Gücü(KiloTon)</label>

      <input
        type="number"
        id="pow"
        name="pow"
        value={pow}
        onChange={(event) => setPow(Number(event.target.value))}
      />
      

      <br /><br />

      <label className="cars">Gerçek Bomba Değerleri</label>
      <select onChange={(event) =>setPow(Number(event.target.value))}>
      <option value="10" >(2013)'de Kuzey Kore Tarafından Denenen Bomba (10kt)</option>
        <option value="15" >(1945)"Little Boy" Hiroşima Bombası (15kt)</option>
        <option value="20">(1945)"Fat Man" Nagasaki Bombası (20kt)</option>
        <option value="50000">(1961)"Tzar Bomba" Soviet Rusya tarafından geliştirilen en büyük nükleer silah (50mt)</option>
        <option value="100000">(?)"Tzar Bomba 602" Soviet Rusya tarafından planlanan en büyük nükleer silah (100mt)</option>
        <option value="21">(1945)"Gadget" Trinity kod adlı ilk test edilen nükleer silah (21kt)</option>
        <option value="15000">(1954)"Amerika tarafından geliştirilen en büyük nükleer silah (15mt)</option>
      </select>
      <br /><br />

      {/* logging */}
      <h3>{clicks.length === 0 ? "Haritaya tıklayarak merkez seçin" : "Merkezler"}</h3>
      <button onClick={() => setClicks([])}>Merkezleri kaldır</button>
      {clicks.map((latLng, i) => (
        <div className="info">
        <pre key={i} style={{display:"block",boxShadow:"0 0 5px 0px",padding:"1px 4px", backgroundColor:"#bbbbbb"}}>
          <p>Enlem: {center.lat.toFixed(6)}</p> 
          <p>Boylam: {center.lng.toFixed(6)} </p>
          <p style={{color: "#ff0000"}}>Alev Topu: {fireball(pow)} metre.({Math.round((fireball(pow) / 2) / 3.14)}km²)</p>
          <p style={{color: "#ff4d00"}}>Ağır Tahrip: {hblast(pow)} metre.({Math.round((hblast(pow) / 2) / 3.14)}km²) </p>
          <p style={{color: "#ff7400"}}>Orta Düzeyde Tahrip: {mblast(pow)} metre.<br />({Math.round((mblast(pow) / 2) / 3.14)}km²)</p>
          <p style={{color: "#00cc00"}}>Radyasyon Alanı: {radiation(pow)} metre.({Math.round((radiation(pow) / 2) / 3.14)}km²)</p>
          <p style={{color: "#dd9000"}}>Termal Alan: {thermal(pow)} metre.({Math.round((thermal(pow) / 2) / 3.14)}km²)</p>
          <p style={{color: "#565d69"}}>Az Düzeyde Tahrip: {lblast(pow)} metre.({Math.round((lblast(pow) / 2) / 3.14)}km²)</p>
        </pre>
        </div>
      ))}

    </div>
  );


  //returning app
  return (
    <div style={{ display: "flex", height: "100%" }}>

      <Wrapper apiKey={api_secret} render={render}>

        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {/* lblast */}
          {clicks.map((latLng, i) => (<Marker key={i} center={latLng} radius={lblast(pow)} fillColor={"#565d69"} strokeWeight={1} /> ))}
          {/* thermal */}
          {clicks.map((latLng, i) => (<Marker key={i} center={latLng} radius={thermal(pow)} fillColor={"#ffc100"} strokeWeight={1} />))}
          {/* radiation */}
          {clicks.map((latLng, i) => (<Marker key={i} center={latLng} radius={radiation(pow)} fillColor={"#00FF00"} strokeWeight={1} />))}
          {/* mblast radius */}
          {clicks.map((latLng, i) => (<Marker key={i} center={latLng} radius={mblast(pow)} fillColor={"#ff7400"} strokeWeight={1} />))}
          {/* hblast radius */}
          {clicks.map((latLng, i) => (<Marker key={i} center={latLng} radius={hblast(pow)} fillColor={"#ff4d00"} strokeWeight={1} />))}
          {/* fireball */}
          {clicks.map((latLng, i) => (<Marker key={i} center={latLng} radius={fireball(pow)} fillColor={"#ff0000"} strokeWeight={1} />))}
        </Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );

};

//map options
interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};
//marker aka circle maker change this and make it a function
const Marker: React.FC<google.maps.CircleOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Circle>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Circle());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}


window.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(<App />, document.getElementById("root"));
});

export { };