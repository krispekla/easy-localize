import React from 'react';

function TranslationToolbar() {
	return (
		<section className="bg-gray-700 p-3 mt-3 w-6/12 h-20 rounded-sm shadow-lg flex">
			<button className="px-2 py-1 mr-5 h-12 text-xs text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg w-24">
				Language settings
			</button>
			<button className="px-2 h-12 text-xs text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg w-32">
				Revert all occurances to text
			</button>
		</section>
	);
}

export default TranslationToolbar;
