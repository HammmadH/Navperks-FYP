import { useState, useEffect } from "react";
import Car from "../assets/car.png";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from "./RadialSeparators";
import useParking from "../Context/useParkingContext";

const zones = [
  { id: 1, label: "Floor 1" },
  { id: 2, label: "Floor 2" },
  { id: 3, label: "Floor 3" },
];

const NavigateSlot = ({ onSelect }) => {
  const {bookedSlot , setBookedSlot , setIsParked , isParked } = useParking();
  const [remainingTime, setRemainingTime] = useState(0); // Timer state
  const [timerRunning, setTimerRunning] = useState(false); // To track if the timer is running
  const totalTime = 120; // Total time in seconds (2 minutes)

  useEffect(() => {
    let timerInterval;
    if (timerRunning && remainingTime > 0) {
      timerInterval = setInterval(() => {
        setRemainingTime((prev) => Math.max(prev - 2, 0));
      }, 2000);
    } else if (remainingTime === 0 && timerRunning) {
      // Timer ends, reset localStorage
      setBookedSlot(null);
      setIsParked(false);
      setTimerRunning(false);
    }

    return () => clearInterval(timerInterval);
  }, [timerRunning, remainingTime , setBookedSlot , setIsParked]);

  const startTimer = () => {
    setRemainingTime(totalTime);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const progressValue = (remainingTime / totalTime) * 100;

  return (
    <div className="h-[85vh] w-full flex pb-8 flex-col justify-around items-center">
      <ZoneNav selectedZone={bookedSlot ? bookedSlot[1] : 0} zones={zones} />
      <div className="flex justify-center flex-col my-4 items-center">
        <div className="flex justify-center items-center rounded-full w-60 h-full">
          <CircularProgressbarWithChildren
            value={progressValue}
            text={remainingTime > 0 ? `${remainingTime}s` : isParked ? "Parked" : bookedSlot ? "Park" : "Free"}
            strokeWidth={8}
            styles={{
              trail: {
                strokeLinecap: "butt",
                stroke: "#d6d6d6",
              },
              path: {
                strokeLinecap: "butt",
                stroke: remainingTime > 0 ? "#ff4500" : "#2cc40d",
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
            {isParked ? <img src={Car} width={80} /> : ""}
          </CircularProgressbarWithChildren>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 items-center">
        {bookedSlot ? (
          <div className="p-4 flex flex-col items-center">
            <div className="">YOUR SLOT CODE IS</div>
            <div>{bookedSlot}</div>
          </div>
        ) : (
          ""
        )}{remainingTime>0 ? (
          <div className="p-4 flex flex-col items-center text-red-600">
            <div>{remainingTime}</div>
          </div>
        ) : (
          ""
        )}
        <Button
          bookedSlot={bookedSlot}
          isParked={isParked}
          onSelect={onSelect}
          startTimer={startTimer}
          stopTimer={stopTimer}
          remainingTime={remainingTime}
          timerRunning={timerRunning}
        />
      </div>
    </div>
  );
};

const Button = ({ bookedSlot, isParked, onSelect, startTimer, stopTimer, timerRunning, remainingTime }) => {
  if (!bookedSlot) {
    return (
      <button
        className="bg-[#2cc40d] rounded-xl text-white text-xl"
        onClick={() => {
          onSelect("bookSlot");
        }}
      >
        Book Slot
      </button>
    );
  } else if (bookedSlot && !isParked) {
    return (
      <button className="bg-[#2cc40d] rounded-full text-white text-xl">
        Navigate Slot
      </button>
    );
  } else if (bookedSlot && isParked) {
    if (!timerRunning) {
      return (
        <button
          className="bg-[#ff4500] rounded-full text-white text-xl"
          onClick={startTimer}
        >
          Free Slot
        </button>
      );
    } else if (timerRunning && remainingTime > 0) {
      return (
        <button
          className="bg-[#ff4500] rounded-full text-white text-xl"
          onClick={stopTimer}
        >
          Stop
        </button>
      );
    } else {
      return (
        <button
          className="bg-[#2cc40d] rounded-full text-white text-xl"
          onClick={startTimer}
        >
          Free Now
        </button>
      );
    }
  }
};

export default NavigateSlot;

function ZoneNav({ selectedZone, zones, className, ...props }) {
  return (
    <nav
      className={`relative flex items-center border-b sha justify-center gap-4 px-4 py-2 text-center ${className || ""}`}
      {...props}
    >
      {zones.map((zone) => (
        <div
          key={zone.id}
          className={`relative flex h-32 w-16 flex-col items-center justify-center transition-all ${selectedZone == zone.id
            ? "before:absolute before:inset-0 z-10 before:rounded-[40px_40px_20px_20px] before:bg-[#2cc40d]"
            : ""
            }`}
        >
          <div className="flex flex-col items-center rotate-[-90deg]">
            <span
              className={`text-lg font-bold whitespace-nowrap ${selectedZone === zone.id ? "text-white" : "text-gray-900"
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
