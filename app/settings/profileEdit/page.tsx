'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserCategory, updateUserCategory } from '@/app/actions';
import ModalSuccess from '@/components/modalSuccess';

const categories = {
  Automotive: [
    "Car culture",
    "Convertibles",
    "Hybrid and electric vehicles",
    "Luxury",
    "Minivans",
    "Motorcycles",
    "Offroad vehicles",
    "Performance vehicles",
    "Sedans",
    "SUVs",
    "Trucks",
    "Vintage cars"
  ],
  Technology: [
    "Artificial Intelligence",
    "Blockchain",
    "Cloud Computing",
    "Cybersecurity",
    "Data Science",
    "IoT",
    "Software Development",
    "Virtual Reality"
  ],
  Beauty: [
    "Body art",
    "Face care",
    "Hair care",
    "Make-up and cosmetics",
    "Skin care",
    "Spa and medical spa",
    "Tanning and sun care"
  ],
  Literature: [
    "Comics",
    "Mystery and crime",
    "Romance",
    "Health",
    "Nonfiction"
  ],
  Event: [
    "Entertainment awards",
    "Holidays",
    "Movie festival",
    "Concerts",
    "Sporting events"
  ],
  Gaming: [
    "board games",
    "Computer gaming",
    "Console gaming",
    "Mobile gaming",
    "Roleplaying games"
  ],
  Sports: [
    "Boxing",
    "Basketball",
    "Football",
    "Climbing",
    "Cycling",
    "Golf",
    "Ice Hockey"
  ],
  Media:[
    "Action and adventure",
    "Animation",
    "Bollywood",
    "Business and news",
    "Comedy",
    "Documentary",
    "Drama",
    "Horror",
    "Reality TV",
    "Romance",
    "Sci-fi",
    "Sports theme"
  ],
  Music:[
    "Blues",
    "Classical",
    "Country",
    "Electronic",
    "Hip hop and rap",
    "Indie",
    "Jazz",
    "Metal",
    "Pop",
    "R&B",
    "Reggae",
    "Rock"
  ]
};

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    mainCategories: [] as string[],
    subCategories: {} as Record<string, string[]>
  });

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();  // Initialize the useRouter hook

  useEffect(() => {
    // Fetch user's existing categories when the component mounts
    const fetchUserCategories = async () => {
      const userCategories = await getUserCategory();
      if (userCategories) {
        setFormData({
          mainCategories: userCategories.main_category || [],
          subCategories: userCategories.sub_category || {}
        });
      }
    };
    fetchUserCategories();
  }, []);

  const handleMainCategoryClick = (category: string) => {
    let updatedCategories = [...formData.mainCategories];
    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter(cat => cat !== category);
    } else if (updatedCategories.length < 3) {
      updatedCategories.push(category);
    }

    const updatedSubCategories = { ...formData.subCategories };
    if (!updatedCategories.includes(category)) {
      delete updatedSubCategories[category];
    }

    setFormData({ mainCategories: updatedCategories, subCategories: updatedSubCategories });
  };

  const handleSubCategoryClick = (mainCategory: string, subCategory: string) => {
    const updatedSubCategories = { ...formData.subCategories };
    if (!updatedSubCategories[mainCategory]) {
      updatedSubCategories[mainCategory] = [];
    }

    if (updatedSubCategories[mainCategory].includes(subCategory)) {
      updatedSubCategories[mainCategory] = updatedSubCategories[mainCategory].filter(cat => cat !== subCategory);
    } else {
      updatedSubCategories[mainCategory].push(subCategory);
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      subCategories: updatedSubCategories
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUserCategory(formData);
    if (success) {
      setShowModal(true);
    } else {
      // Handle update error (e.g., show an error message)
      console.error('Error updating categories');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push('/settings/profile');  // Navigate to the next page after closing modal
  };


  return (
    <div className="min-h-screen flex justify-center items-center font-raleway">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
        <div className="flex justify-center">
          <h1 className="text-center font-bold text-xl">Select Your Interests</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col mt-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Main Categories (Select up to 3)</label>
            <div className="flex flex-wrap justify-center">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleMainCategoryClick(category)}
                  className={`w-40 h-12 p-2 m-2 border rounded text-center font-bold ${formData.mainCategories.includes(category) ? 'bg-cyan-950 text-white' : 'bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          {formData.mainCategories.map((mainCategory) => (
            <div className="mb-4" key={mainCategory}>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">{mainCategory} Sub Category</label>
              <div className="flex flex-wrap justify-center">
                {categories[mainCategory].map((subCategory) => (
                  <button
                    key={subCategory}
                    type="button"
                    onClick={() => handleSubCategoryClick(mainCategory, subCategory)}
                    className={`w-50 h-12 p-2 m-2 border rounded text-center font-bold ${formData.subCategories[mainCategory]?.includes(subCategory) ? 'bg-cyan-950 text-white' : 'bg-gray-200'}`}
                  >
                    {subCategory}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <br />
          <div className="flex justify-end">
            <button type="submit" className="px-6 p-2 text-white bg-cyan-950 hover:bg-cyan-900 rounded cursor-pointer">
              Save
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <ModalSuccess
          message="Your interests has been updated!"
          onClose={handleModalClose}
          isOpen={showModal}
        />
      )}
    </div>
  );
};

export default FormComponent;
