import React from "react";

export const Header = () => {
  return(
      <>
          <header className="bg-white shadow-lg px-6 py-4 flex items-center justify-between">
              <div className="text-2xl font-bold">Welcome, </div>
              <div>
                  <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                      Notifications
                  </button>
              </div>
          </header>
      </>
  );
};