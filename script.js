const usertab =document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchform]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


//intial variable need

let oldTab=usertab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");

//ek kaam pending hai
 getfromSessionStorage();
  
function switchtab(newtab){
    if(newtab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newtab;
        oldTab.classList.add("current-tab");
     
        if(!searchForm.classList.contains("active")){
           //kya serch form wala container is invisible ,if yes then make it visible.
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main phle serch wale tab pr thaa ab your wether tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active")
             //ab main your wether tab me aa gya hu ,toh wether bhi display karna hoga so let's check local storage first
             //for coordinates ,if we haved saved them there.
            
             
             getfromSessionStorage();
        }
       
    } 
}

usertab.addEventListener("click",()=>{
    //pass clicked tab as input character
    switchtab(usertab);
});

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input character
    switchtab(searchTab);
});


//chcek if coordinates are alredy present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coorddinates");
    if (!localCoordinates){
        //agr local cordinates nhi hai
       grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);      //json.parse converts json string to json object
       fetchUserWeatherInfo(coordinates);
    }

    
}

  async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant container invisioble
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);


    }
    catch(err){
        loadingScreen.classList.remove("active");



    }

  } 


  function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements.
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]")
    const desc=document.querySelector("[data-weatherDesc]")
    const weatherIcon=document.querySelector("[data-weatherIcon]")
    const temp=document.querySelector("[data-temp]")
    const windspeed=document.querySelector("[data-windspeed]") 
    const humidity=document.querySelector("[data-humidity]")
    const cloudiness=document.querySelector("[data-cloudiness]")
  
    console.log(weatherInfo);
 //fetch values from wetherInfo and put in UI elements.
    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    

} 
 function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //-show an alert for no geoloaction
        alert("no geo loaction")

    }
    }
    function showPosition(position){
         const userCoordinates= {
            lat:position.coords.latitude,
            lon:position.coords.longitude,
         }
         sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
         fetchUserWeatherInfo(userCoordinates);
     
    }

 const grantAccessButton=document.querySelector("[data-grantAccess]")
 grantAccessButton.addEventListener("click",getLocation);


 const searchInput=document.querySelector("[data-searchInput]");
 searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();

  let cityName = searchInput.value;

 if(cityName==="")
    return;
else
    fetchSearchWeatherInfo(cityName);

});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
   
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
     const data=await response.json();
     loadingScreen.classList.remove("active");
     userInfoContainer.classList.add("active");
     renderWeatherInfo(data);

    }
    catch(err){
         alert("error found2");
    }

}





