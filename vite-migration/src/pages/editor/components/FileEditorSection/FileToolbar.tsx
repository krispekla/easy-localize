import React from 'react';

function FileToolbar() {
  return (
    <div className="bg-gray-700 p-3 mt-3 w-4/12 h-20 rounded-sm shadow-lg flex">
      <button className="px-2 py-1 mr-5 h-8 text-xs text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg w-24">
        Toggle
      </button>
      <button className="px-2 h-8 text-xs text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg w-32">
        Refresh
      </button>
    </div>
  );
}

export default FileToolbar;
