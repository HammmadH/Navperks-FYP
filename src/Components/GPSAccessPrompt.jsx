const GPSAccessPrompt = ({ show }) => {
  if (show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-black bg-opacity-80 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-4">GPS Required</h2>
        <p className="text-gray-700 mb-4">
          This feature requires access to your location. Please enable GPS/location services in your phone settings and reload the app.
        </p>
        <div className="text-sm text-gray-500">
          Make sure you have granted location permissions to this app in your browser.
        </div>
      </div>
    </div>
  );
};

export default GPSAccessPrompt;
