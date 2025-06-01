import { useState, useEffect } from "react";
import Car from "../assets/car.png";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from "./RadialSeparators";
import LiveSpeedometer from "./LiveSpeedometer";

const zones = [
  { id: "S", label: "COCIS" },
  { id: "M", label: "COMS" },
];

const NavigateSlot = ({
  onSelect,
  bookedSlot,
  isParked,
  releasing,
  speed,
  remainingTime,
  timerRunning,
  releaseSlot,
}) => {
  // To track if the timer is running
  const totalTime = 20; // Total time in seconds (2 minutes)

  const progressValue = (remainingTime / totalTime) * 100;

  return (
    <div className="h-[85vh] w-full flex pb-8 flex-col justify-between items-center">
      <ZoneNav selectedZone={bookedSlot ? bookedSlot[1] : 0} zones={zones} />

      <div className="flex justify-center flex-col my-4 items-center">
        <div className="flex justify-center items-center rounded-full w-60 h-full">
          <div className="absolute top-40 right-5 px-6 py-3 text-lg dark:text-white rounded-full">
            <LiveSpeedometer />
          </div>

          <CircularProgressbarWithChildren
            value={progressValue}
            text={
              remainingTime > 0
                ? ``
                : isParked
                ? "Parked"
                : bookedSlot
                ? "Park"
                : "Free"
            }
            strokeWidth={8}
            styles={{
              trail: {
                strokeLinecap: "butt",
                stroke: "#d6d6d6",
              },
              path: {
                strokeLinecap: "butt",
                stroke: remainingTime > 0 ? "#2cc40d" : "#2cc40d",
              },
              text: {
                fill: remainingTime > 0 ? "#ff4500" : "#2cc40d",
                fontSize: "24px",
              },
            }}
          >
            <RadialSeparators
              count={30}
              style={{
                background: "#fff",
                width: "2px",
                height: `${8}%`,
              }}
            />
            {isParked || releasing ? <img src={Car} width={80} /> : ""}
          </CircularProgressbarWithChildren>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 items-center">
        {bookedSlot ? (
          <div className=" flex flex-col items-center">
            <div className="text-xl font-bold">YOUR SLOT CODE IS</div>
            <div className="text-2xl font-bold">{bookedSlot}</div>
          </div>
        ) : (
          ""
        )}
        {remainingTime > 0 ? (
          <div className="flex flex-col items-center text-[#17502d]">
            <div className="text-2xl font-bold">{remainingTime} s</div>
          </div>
        ) : (
          ""
        )}
        <Button
          releasing={releasing}
          bookedSlot={bookedSlot}
          releaseSlot={releaseSlot}
          isParked={isParked}
          onSelect={onSelect}
          remainingTime={remainingTime}
          timerRunning={timerRunning}
        />
      </div>
    </div>
  );
};

const Button = ({
  releasing,
  bookedSlot,
  isParked,
  onSelect,
  timerRunning,
  remainingTime,
  releaseSlot,
}) => {
  if (releasing) {
    return (
      <button className="bg-[#2cc40d] w-40 rounded-xl text-white text-xl py-2 font-semibold cursor-pointer">
        Releasing
      </button>
    );
  } else if (!bookedSlot) {
    return (
      <button
        className="bg-[#2cc40d] w-40 rounded-xl text-white text-xl py-2 font-semibold cursor-pointer"
        onClick={() => {
          onSelect("bookSlot");
        }}
      >
        BOOK SLOT
      </button>
    );
  } else if (bookedSlot && !isParked) {
    return (
      <button
        className="bg-[#2cc40d] w-40 rounded-full text-white text-xl py-2 font-semibold cursor-pointer"
        onClick={() => {
          onSelect("kiet");
        }}
      >
        NAVIGATE SLOT
      </button>
    );
  } else if (bookedSlot && isParked) {
    if (!timerRunning) {
      return (
        <button
          className="bg-[#2cc40d] w-40 rounded-full text-white text-xl py-2 font-semibold cursor-pointer"
          onClick={() => {
            releaseSlot(bookedSlot);
          }}
        >
          FREE SLOT
        </button>
      );
    } else {
      return <></>;
    }
  }
};

export default NavigateSlot;

function ZoneNav({ selectedZone, zones, className, ...props }) {
  return (
    <nav
      className={`relative flex items-center w-full shadow-xl bg-gray-100 justify-center gap-4 px-4 py-2 text-center ${
        className || ""
      }`}
      {...props}
    >
      {zones.map((zone) => (
        <div
          key={zone.id}
          className={`relative flex h-32 w-16 flex-col items-center justify-center transition-all before:absolute before:inset-0 z-10 before:rounded-[40px_40px_20px_20px] ${
            selectedZone == zone.id
              ? " before:bg-[#2cc40d]"
              : "before:bg-gray-300"
          }`}
        >
          <div className="flex flex-col relative items-center rotate-[-90deg]">
            <span
              className={`text-lg font-bold whitespace-nowrap ${
                selectedZone == zone.id ? "text-white" : "text-black"
              }`}
            >
              {zone.label}
            </span>
          </div>
        </div>
      ))}
    </nav>
  );
}
