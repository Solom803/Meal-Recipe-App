// API Configuration
const API_URL = "https://www.themealdb.com/api/json/v1/1";
// Global Variables
let allMeals = [];
let MEALS_PER_PAGE = 6;
let currentChunkIndex = 0;
// Function 1: Load All Meals on Page Load
// ============================================
/**
 * Load all meals when page loads
 * Uses Fetch API with Promises
 * Only loads meals starting with letter 'a'
 */

function loadAllMeals() {
    allMeals = [];
    currentChunkIndex = 0;
    fetch(`${API_URL}/search.php?f=a`)
        .then((response) => response.json())
        .then((data) => {
            const meals = data.meals || [];
            allMeals = meals;
            // console.log("allMeals:", allMeals);
            // displayMeals(allMeals);
            displayMealsChunk(allMeals);
            document.getElementById("loaderScreen").classList.add("d-none")
        })
        .catch((error) => {
            console.error(Error("there is no data", error));
            alert("Failed to load meals. Please refresh the page.");
            document.getElementById("loaderScreen").classList.add("d-none");
        })
}


// Function 2: Display Meals
// ============================================
/**
 * Display meals in the container
 * DOM Manipulation*/
function displayMeals(meals, append = false) {
    const container = document.getElementById("mealsContainer");
    if (!append) {
        container.innerHTML = ""
    }
    if (meals.length === 0 & !append) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No meals found.</p></div>';
        return;
    }

    meals.forEach((meal) => {
        let col = document.createElement("div")

        col.className = "col-md-4 col-sm-6 mb-4";
        col.innerHTML = `<div class="card h-100 shadow-sm">
                            <img src="${meal.strMealThumb}"
                                alt="${meal.strMeal}" class="card-img-top" style="height: 250px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal || "NA"}</h5>
                                <p class="card-text text-muted">${meal.strCategory}</p>
                                <button class="btn btn-primary"   onclick="showMealDetails('${meal.idMeal}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>`
        container.appendChild(col);
    });


}

// ============================================
// Function 3: Display Meals Chunk (6 meals)
// ============================================

/**
 * Display meals in chunks of 6
 * Simple function for beginners
 */

function displayMealsChunk(allMeals) {
    let startIndex = currentChunkIndex * MEALS_PER_PAGE;
    let endIndex = startIndex + MEALS_PER_PAGE
    let chunk = allMeals.slice(startIndex, endIndex);
    if (chunk.length === 0) {
        document.getElementById("loadMoreBtn").classList.add("d-none");
        return;
    }
    displayMeals(chunk, currentChunkIndex > 0);
    if (endIndex > allMeals.length) {
        document.getElementById("loadMoreBtn").classList.add("d-none");
        return;

    }
    else {
        document.getElementById("loadMoreBtn").classList.remove("d-none");

    }

}


// Function 4: Load More Meals
// ============================================

/**
 * Load more meals from array chunks (6 by 6)
 * Simple function for beginners
 */
function loadMoreMeals() {

    document.getElementById("loadMoreBtn").disapled = true;

    setTimeout(() => {
        currentChunkIndex++;
        document.getElementById("loadMoreBtn").disapled = false;
        displayMealsChunk(allMeals);
    }, 500)

}



// ============================================
// Function 5: Search Meals
// ============================================

/**
 * Search for meals by name
 * @param {string} searchTerm - The meal name to search for
 */

function sanitizeData(input) {
    return input.trim().replace(/[<>]/g, "");

}

function searchMeals(search) {
    let cleanedSearchTerm = sanitizeData(search);
    if (!cleanedSearchTerm) {
        currentChunkIndex = 0;
        displayMealsChunk(allMeals);
        document.getElementById("loadMoreBtn").classList.remove("d-none");
        return;
    }

    fetch(`${API_URL}/search.php?s=${encodeURIComponent(cleanedSearchTerm)}`)
        .then((responce) => responce.json())
        .then((data) => {
            const meals = data.meals
            allMeals = meals
            currentChunkIndex = 0;
            displayMealsChunk(allMeals)
        })
        .catch((error) => {
            console.error("Error loading meals:", error);
            alert("Failed to search meals. Please try again");
        });
}

// ============================================
// Function 6: Show Meal Details
// ============================================

/**
 * Show meal details page
 * Navigates to details page
 * @param {string} mealId - The meal ID
 */

function showMealDetails(mealId) {
    let col = document.getElementById("mealDetailsContent");
    let mealDetails = [];
    if (!mealId) {
        return alert("this is not here now")
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}
`)
        .then((responce) => responce.json())
        .then((data) => {


            document.getElementById("mealDetailsPage").classList.remove("d-none");
            mealDetails = data.meals[0]
            alert("your meal details at the end of page");
            let strIngredient = "";
            let strMeasure = ""
            for (let i = 1; i <= 20; i++) {
                if (!mealDetails[`strIngredient${i}`] || mealDetails[`strIngredient${i}`] === "") {
                    continue;
                }
                if (!mealDetails[`strMeasure${i}`] || mealDetails[`strMeasure${i}`] === "") {
                    continue;
                }
                strIngredient += mealDetails[`strIngredient${i}`] + "<br/>"
                strMeasure += mealDetails[`strMeasure${i}`] + "<br/>"
            }
            col.innerHTML = `
              <h2>${mealDetails.strMeal}</h2>
                 <p>
                <strong>How to cook:</strong><br>
                ${mealDetails.strInstructions}
              </p>

              <h5>Ingredients</h5>
              <p>
                ${strIngredient}<br>
              </p>
             <h5>Ingredient Measure</h5>
              
               <p>
                ${strMeasure}
                <br>
              </p>
            `
        })
        .catch((error) => {
            alert("there is no details")
            console.error(Error("no meal found"));
        })
}


// ============================================
// Function 7: Toggle Dark Mode
// ============================================

/**
 * Toggle dark mode and save to localStorage
 * BOM - localStorage usage
 */

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem("dark", isDark);

    const icon = document.getElementById("darkModeIcon");
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";

}
function loadDarkMode() {
    const dark = localStorage.getItem("dark");
    if (dark === "true") {
        document.body.classList.toggle("dark-mode");
        const icon = document.getElementById("darkModeIcon");

        icon.className = "fas fa-sun";
    }

}

/**
// Function 8 loadMealAreas
 * Fetch and load available meal regions (areas) from the API
 */
function loadMealAreas() {
    const myInput = document.getElementById("areaFilter");
    let countries = []
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
        .then((responce) => responce.json())
        .then((data) => {
            countries = data.meals
            countries.forEach((country) => {
                const option = document.createElement("option");
                option.value = country.strArea;
                option.textContent = ` ${country.strArea}`;

                myInput.appendChild(option);

            })


        })


}

/**
 *  Function 9 filterMealsByRegion

 * Filter meals based on selected region (area)
 */
function filterMealsByRegion(value) {
    console.log(value)
    let countriesFillter = []
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}`)
        .then((responce) => responce.json())
        .then((data) => {
            countriesFillter = data.meals
            displayMealsChunk(countriesFillter);

        })
}

window.addEventListener("DOMContentLoaded", function () {

    loadMealAreas()
    loadAllMeals();
    loadDarkMode();
    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const searchTerm = document.getElementById("searchInput").value;
        searchMeals(searchTerm);
    })
    document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode)
    document.getElementById("backButton").addEventListener("click", function () {
        document.getElementById("mealDetailsPage").classList.add("d-none");
    })


    document.getElementById("areaFilter").addEventListener("change", function () {
        const areaFilter = document.getElementById("areaFilter");

        const value = areaFilter.value;
        // console.log(value)

        if (!value) return;


        // console.log(value)
        filterMealsByRegion(value);
    });



})  
