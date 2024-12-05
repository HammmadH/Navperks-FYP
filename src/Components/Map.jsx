import map from "../assets/map.svg";

export default function Map() {
  return (
    <div className="relative h-full w-full">
      <img src={map} className="h-full w-full object-cover z-50" alt="Map" />
    </div>
  );
}
