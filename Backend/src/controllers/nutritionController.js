const axios = require("axios");
const MealModel = require("../models/mealModel");
const qs = require("qs");
// qs used to stringify JavaScript objects into URL-encoded query strings

const API_KEY = process.env.SPOONACULAR_API_KEY;

async function getTotalNutrition(ingredientString) {
  const ingredients = ingredientString.split(",").map((i) => i.trim());

  let totalCalories = 0,
    totalProtein = 0,
    totalCarbs = 0,
    totalFat = 0;

  for (const ing of ingredients) {
    try {
      // Prepare form data for this ingredient
      const formData = qs.stringify({ ingredientList: ing });

      const response = await axios.post(
        "https://api.spoonacular.com/recipes/parseIngredients",
        formData,
        {
          params: { apiKey: API_KEY, includeNutrition: true },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      if (!response.data || response.data.length === 0) {
        console.warn(`⚠️ No data returned for "${ing}"`);
        continue;
      }

      const nutrients = response.data[0]?.nutrition?.nutrients || [];

      totalCalories += nutrients.find((n) => n.name === "Calories")?.amount || 0;
      totalProtein += nutrients.find((n) => n.name === "Protein")?.amount || 0;
      totalCarbs +=
        nutrients.find((n) => n.name === "Carbohydrates")?.amount || 0;
      totalFat += nutrients.find((n) => n.name === "Fat")?.amount || 0;
    } catch (error) {
      console.error(`❌ Error fetching nutrition for "${ing}":`, error.message);
    }
  }

  return {
    calories: totalCalories,
    macros: {
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    },
  };
}
// add a meal
const logMeal = async (req, res) => {
  try {
    const { mealName } = req.body;

    if (!mealName) {
      return res.status(400).json({ message: "Meal name is required" });
    }
    // // Prepare form data (parseIngredients expects ingredientList as form field)
    // const formData = qs.stringify({ ingredientList: mealName });

    // // calling the api
    // const response = await axios.post(
    //   `https://api.spoonacular.com/recipes/parseIngredients`,
    //   formData,
    //   {
    //     params: { apiKey: API_KEY, includeNutrition: true },
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   }
    // );
    
    
    // if (!response.data || response.data.length === 0) {
    //     return res.status(404).json({ message: "No nutrition data found" });
    // }
    // let totalCalories = 0,
    //   totalProtein = 0,
    //   totalCarbs = 0,
    //   totalFat = 0;
      
    //   console.log("Full Spoonacular Response:", JSON.stringify(response.data, null, 2));
    
    //   response.data.forEach((ingredient) => {
    //   console.log("Processing ingredient:", ingredient.name);
    //   console.log("Nutrients:", ingredient.nutrition?.nutrients);

    //   const nutrients = ingredient.nutrition?.nutrients || [];
    //   totalCalories +=
    //     nutrients.find((n) => n.name === "Calories")?.amount || 0;
    //   totalProtein += nutrients.find((n) => n.name === "Protein")?.amount || 0;
    //   totalCarbs +=
    //     nutrients.find((n) => n.name === "Carbohydrates")?.amount || 0;
    //   totalFat += nutrients.find((n) => n.name === "Fat")?.amount || 0;
    // });
    // console.log("Total Calculated:", { totalCalories, totalProtein, totalCarbs, totalFat });

    const nutritionData = await getTotalNutrition(mealName);

    // save the meal in database
    const meal = new MealModel({
      user: req.user.userId,
      mealName,
      calories: nutritionData.calories,
      macros: nutritionData.macros,
    });
    await meal.save();

    res.status(201).json({ message: "Meal Logged successfully", meal });
  } catch (err) {
    console.error("Error logging meal:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to log meal" });
  }
};

const getMeals = async (req, res) => {
  try {
    const meals = await MealModel.find({ user: req.user.userId }).sort({
      loggedAt: -1,
    });
    res.json(meals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch meals", error: err.message });
  }
};

module.exports = { logMeal, getMeals };
