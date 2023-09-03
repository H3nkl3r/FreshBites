import React from "react";

export const kitchenList = [
  { value: "american", label: "American" },
  { value: "brazilian", label: "Brazilian" },
  { value: "british", label: "British" },
  { value: "caribbean", label: "Caribbean" },
  { value: "chinese", label: "Chinese" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  { value: "indian", label: "Indian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "lebanese", label: "Lebanese" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "mexican", label: "Mexican" },
  { value: "moroccan", label: "Moroccan" },
  { value: "spanish", label: "Spanish" },
  { value: "thai", label: "Thai" },
  { value: "turkish", label: "Turkish" },
  { value: "vietnamese", label: "Vietnamese" },
];

export const requirementsList = [
  { value: "dairyFree", label: "Dairy Free" },
  { value: "glutenFree", label: "Gluten Free" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "locallySourced", label: "Locally Sourced" },
  { value: "lowCarb", label: "Low Carb" },
  { value: "lowFat", label: "Low Fat" },
  { value: "nutFree", label: "Nut Free" },
  { value: "organic", label: "Organic" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "raw", label: "Raw" },
  { value: "sugarFree", label: "Sugar Free" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
];

/*
This function translates a given cuisine type value (as it is stored in the database) into a presentable label using kitchenList.
Example: Value input 'asian' => Label output 'Asian'
 */
export const parseCuisineValue = (cuisineValue) => {
  let label;
  kitchenList.forEach((cuisine) => {
    if (cuisine.value === cuisineValue) {
      label = cuisine.label;
    }
  });
  return label;
};

/*
This function translates a given special requirement value (as it is stored in the database) into a presentable label using requirementsList.
Example: Value input 'glutenFree' => Label output 'Gluten free'
 */
export const parseRequirementValue = (requirementValue) => {
  let label;
  requirementsList.forEach((requirement) => {
    if (requirement.value === requirementValue) {
      label = requirement.label;
    }
  });
  return label;
};

const detailsParser = {
  kitchenList,
  requirementsList,
  parseCuisineValue,
  parseRequirementValue,
};
