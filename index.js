function get(sel) {
   return document.querySelector(sel)
}
const pagehead = get('#header')
const spanThings = ['jacket', 'umbrella', 'sunscreen', 'sunglasses', 'air cooler']
const Showneed = get('#weather-header').querySelector('span');
let needs = [];

setInterval(() => {
   let Showneed = pagehead.querySelector('span')
   setTimeout(()=>{
     Showneed.style.opacity = 1 
   }, 500)
   Showneed.innerHTML = Showneed.innerHTML === spanThings[Math.floor(Math.random()*5)] 
      ? spanThings[Math.floor(Math.random()*5)] 
      : spanThings[Math.floor(Math.random()*5)]
      setTimeout(()=>{
         Showneed.style.opacity = 0
       }, 4500)
}, 5000)

//WALLPAPERS

const wallpapers = {
   //clear_day: 'http://eskipaper.com/images/sunny-day-wallpaper-2.jpg',
   clear_day: '/Images/clear-day.png',
   //clear_night: 'https://free4kwallpapers.com/uploads/originals/2015/07/25/clear-night-sky-wallpaper.jpg',
   clear_night: '/Images/clear-day.png',
   partly_cloudy_day: 'https://jooinn.com/images/cloudy-58.png',
   partly_cloudy_night: 'https://free4kwallpapers.com/uploads/originals/2015/10/06/cloudy-night-with-full-moon._.jpg',
   cloudy: 'http://getwallpapers.com/wallpaper/full/e/7/9/234482.jpg',
   rain: 'http://getwallpapers.com/wallpaper/full/8/3/3/998758-new-rain-hd-wallpaper-2560x1600-for-4k.jpg',
   sleet: 'https://fournews-assets-prod-s3b-ew1-aws-c4-pml.s3.amazonaws.com/media/2017/12/snow_london_g_hd.jpg',
   snow: 'https://i.pinimg.com/originals/ab/94/0b/ab940b5f1c068b82a14338800ee61b45.jpg',
   wind: 'https://wallpapercave.com/wp/wp2108762.jpg',
   fog: 'https://images.wallpaperscraft.com/image/forest_trees_fog_110131_1920x1080.jpg'
}

const submitBtn = get('#check')
submitBtn.addEventListener('click', () => {
   getWeather();
})
function getWeather() {
   if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function (location) {
         lat = location.coords.latitude;
         lon = location.coords.longitude;
         const keey = '5bccb0e1292722639f6fa1d1cb85bda1';
         const url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + keey + '/' + lat + ',' + lon + '?units=si&exclude=minutely,hourly,alerts,flags';
         parseweather(url);
      })
   }
   else {
      alert("No Geolocation. Decide if you need a jacket.")
   }
}
function parseweather(url) {
   fetch(url)
      .then((res) => {
         res.json()
         .then((data) => {
            needs = []
            let UV = data.daily.data[0].uvIndex;
            let clouds = data.daily.data[0].cloudCover;
            let feelsLike = data.currently.apparentTemperature;
            let rainPer = data.daily.data[0].precipProbability;
            let icon = data.currently.icon;
            if (UV >= 7 && (new Date().getHours) > 18) {
               needs.push('a sunscreen')
            }
            if (clouds <= 0.4 && (new Date().getHours) > 18) {
               needs.push('a sunglasses')
            }
            if (feelsLike >= 36) {
               needs.push('an air cooler')
            }
            if (feelsLike <= 22) {
               needs.push('a jacket')
            }
            if (rainPer >= 0.5) {
               needs.push('an umbrella')
            }
            if (needs[0] === "" || needs === undefined || needs.length === 0) {
               needs.push('nothing')
            }
            printNeeds();
            setWallpaper(icon)
            setData(UV, clouds, feelsLike, rainPer);
            document.querySelectorAll('#weather-header').forEach(element => {
               element.style.display = 'block';
               element.style.opacity = 1;
            });
         })
      })
}
function setWallpaper(icon) {
   let bg = icon.replace(/-/g, '_')
   document.body.style.backgroundImage = `url(${wallpapers[bg]})`
}
function setData(UV, CC, AT, RP) {
   let datas = get('.data').querySelectorAll('span')
   datas[0].innerHTML = UV
   datas[1].innerHTML = (CC * 100) + '%'
   datas[2].innerHTML = AT + ' C'
   datas[3].innerHTML = (RP * 100) + '%'
   datas[2].addEventListener('click', () => {
      if (datas[2].innerHTML.includes('C')) {
         datas[2].innerHTML = (AT * 1.8).toFixed(2) + ' F'
      }
      else {
         datas[2].innerHTML = AT + ' C'
      }
   })
}
function printNeeds() {
   let final = needs.join(', ');
   Showneed.innerHTML = final;
}
